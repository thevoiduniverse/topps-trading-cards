import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// POST /api/cards/bulk - Create multiple cards at once
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cards } = body;

    if (!Array.isArray(cards) || cards.length === 0) {
      return NextResponse.json({ error: 'Cards array is required' }, { status: 400 });
    }

    const createdCards = await prisma.card.createMany({
      data: cards.map((card: Record<string, unknown>) => ({
        playerName: card.playerName as string,
        position: card.position as string,
        team: card.team as string,
        nation: card.nation as string,
        overall: card.overall as number,
        pace: card.pace as number,
        shooting: card.shooting as number,
        passing: card.passing as number,
        dribbling: card.dribbling as number,
        defending: card.defending as number,
        physical: card.physical as number,
        rarity: card.rarity as string,
        collection: card.collection as string,
        imageUrl: (card.imageUrl as string) || null,
        price: card.price as number,
        status: 'AVAILABLE',
      })),
    });

    return NextResponse.json({ created: createdCards.count }, { status: 201 });
  } catch (error) {
    console.error('Error creating cards:', error);
    return NextResponse.json({ error: 'Failed to create cards' }, { status: 500 });
  }
}
