import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/packs - List pack templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const where = activeOnly ? { isActive: true } : {};

    const packs = await prisma.packTemplate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    // Parse the rarityDistribution JSON for each pack
    const parsedPacks = packs.map((pack) => ({
      ...pack,
      rarityDistribution: JSON.parse(pack.rarityDistribution),
    }));

    return NextResponse.json(parsedPacks);
  } catch (error) {
    console.error('Error fetching packs:', error);
    return NextResponse.json({ error: 'Failed to fetch packs' }, { status: 500 });
  }
}

// POST /api/packs - Create a new pack template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate rarity distribution
    const totalCards = body.rarityDistribution.reduce(
      (sum: number, slot: { count: number }) => sum + slot.count,
      0
    );

    if (totalCards !== body.totalCards) {
      return NextResponse.json(
        { error: 'Total cards must match sum of rarity distribution' },
        { status: 400 }
      );
    }

    const pack = await prisma.packTemplate.create({
      data: {
        name: body.name,
        description: body.description || null,
        price: body.price,
        imageUrl: body.imageUrl || null,
        rarityDistribution: JSON.stringify(body.rarityDistribution),
        totalCards: body.totalCards,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(
      {
        ...pack,
        rarityDistribution: JSON.parse(pack.rarityDistribution),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating pack:', error);
    return NextResponse.json({ error: 'Failed to create pack' }, { status: 500 });
  }
}
