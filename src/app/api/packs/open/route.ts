import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

interface RaritySlot {
  rarity: string;
  count: number;
  guaranteedMin: number;
}

// Rarity hierarchy for fallback (lower rarity can substitute higher if pool is empty)
const RARITY_HIERARCHY: Record<string, string[]> = {
  ICON: ['HERO', 'INFORM', 'RARE_GOLD', 'GOLD'],
  HERO: ['INFORM', 'RARE_GOLD', 'GOLD'],
  INFORM: ['RARE_GOLD', 'GOLD'],
  RARE_GOLD: ['GOLD'],
  GOLD: ['SILVER'],
  SILVER: ['BRONZE'],
  BRONZE: [],
};

// POST /api/packs/open - Open a pack and receive random cards
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { packTemplateId, buyerEmail, buyerName } = body;

    if (!packTemplateId || !buyerEmail) {
      return NextResponse.json(
        { error: 'Pack template ID and buyer email are required' },
        { status: 400 }
      );
    }

    // Get pack template
    const packTemplate = await prisma.packTemplate.findUnique({
      where: { id: packTemplateId },
    });

    if (!packTemplate) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    if (!packTemplate.isActive) {
      return NextResponse.json({ error: 'Pack is not available' }, { status: 400 });
    }

    const rarityDistribution: RaritySlot[] = JSON.parse(packTemplate.rarityDistribution);

    // Get available cards grouped by rarity
    const availableCardsByRarity = await getAvailableCardsByRarity();

    // Select cards based on rarity distribution with fallback logic
    const selectedCardIds: string[] = [];
    const errors: string[] = [];

    for (const slot of rarityDistribution) {
      const cardsForSlot = selectCardsForRaritySlot(
        slot,
        availableCardsByRarity,
        selectedCardIds
      );

      if (cardsForSlot.length < slot.guaranteedMin) {
        errors.push(
          `Could not find enough ${slot.rarity} cards. Required: ${slot.guaranteedMin}, Found: ${cardsForSlot.length}`
        );
      }

      selectedCardIds.push(...cardsForSlot);
    }

    // Check if we have minimum required cards
    const totalRequired = rarityDistribution.reduce((sum, slot) => sum + slot.guaranteedMin, 0);
    if (selectedCardIds.length < totalRequired) {
      return NextResponse.json(
        {
          error: 'Not enough cards available in inventory',
          details: errors,
        },
        { status: 400 }
      );
    }

    // Create the pack purchase and update card statuses in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create pack purchase record
      const packPurchase = await tx.packPurchase.create({
        data: {
          packTemplateId,
          buyerEmail,
          buyerName: buyerName || null,
          paidAmount: packTemplate.price,
          status: 'COMPLETED',
          openedAt: new Date(),
        },
      });

      // Update all selected cards to PACKED status
      await tx.card.updateMany({
        where: { id: { in: selectedCardIds } },
        data: { status: 'PACKED' },
      });

      // Create pack card records
      await tx.packCard.createMany({
        data: selectedCardIds.map((cardId) => ({
          packPurchaseId: packPurchase.id,
          cardId,
        })),
      });

      // Fetch the selected cards with full details
      const cards = await tx.card.findMany({
        where: { id: { in: selectedCardIds } },
      });

      return {
        packPurchase,
        cards,
      };
    });

    return NextResponse.json({
      purchaseId: result.packPurchase.id,
      pack: {
        ...packTemplate,
        rarityDistribution,
      },
      cards: result.cards,
    });
  } catch (error) {
    console.error('Error opening pack:', error);
    return NextResponse.json({ error: 'Failed to open pack' }, { status: 500 });
  }
}

// Get all available cards grouped by rarity
async function getAvailableCardsByRarity(): Promise<Map<string, string[]>> {
  const cards = await prisma.card.findMany({
    where: { status: 'AVAILABLE' },
    select: { id: true, rarity: true },
  });

  const cardsByRarity = new Map<string, string[]>();

  for (const card of cards) {
    const existing = cardsByRarity.get(card.rarity) || [];
    existing.push(card.id);
    cardsByRarity.set(card.rarity, existing);
  }

  return cardsByRarity;
}

// Select cards for a rarity slot with fallback logic
function selectCardsForRaritySlot(
  slot: RaritySlot,
  availableCardsByRarity: Map<string, string[]>,
  alreadySelected: string[]
): string[] {
  const selected: string[] = [];
  let remaining = slot.count;

  // Try to get cards from the requested rarity first
  const cardsOfRarity = (availableCardsByRarity.get(slot.rarity) || []).filter(
    (id) => !alreadySelected.includes(id) && !selected.includes(id)
  );

  // Shuffle to randomize selection
  shuffleArray(cardsOfRarity);

  // Take as many as we can from the requested rarity
  const fromRequested = Math.min(remaining, cardsOfRarity.length);
  selected.push(...cardsOfRarity.slice(0, fromRequested));
  remaining -= fromRequested;

  // If we still need more cards and haven't met the guaranteed minimum,
  // try fallback rarities (lower rarities)
  if (remaining > 0 && selected.length < slot.guaranteedMin) {
    const fallbackRarities = RARITY_HIERARCHY[slot.rarity] || [];

    for (const fallbackRarity of fallbackRarities) {
      if (remaining <= 0) break;

      const fallbackCards = (availableCardsByRarity.get(fallbackRarity) || []).filter(
        (id) => !alreadySelected.includes(id) && !selected.includes(id)
      );

      shuffleArray(fallbackCards);

      const neededForMinimum = Math.max(0, slot.guaranteedMin - selected.length);
      const toTake = Math.min(remaining, fallbackCards.length, neededForMinimum);
      selected.push(...fallbackCards.slice(0, toTake));
      remaining -= toTake;
    }
  }

  return selected;
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
