import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/cards - List cards with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const rarity = searchParams.get('rarity');
    const team = searchParams.get('team');
    const collection = searchParams.get('collection');
    const position = searchParams.get('position');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const maxRating = searchParams.get('maxRating');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (rarity) where.rarity = rarity;
    if (team) where.team = { contains: team };
    if (collection) where.collection = collection;
    if (position) where.position = position;
    if (search) {
      where.OR = [
        { playerName: { contains: search } },
        { team: { contains: search } },
        { nation: { contains: search } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
    }
    if (minRating || maxRating) {
      where.overall = {};
      if (minRating) (where.overall as Record<string, number>).gte = parseInt(minRating);
      if (maxRating) (where.overall as Record<string, number>).lte = parseInt(maxRating);
    }

    const orderBy: Record<string, string> = {};
    orderBy[sortBy] = sortOrder;

    const [cards, total] = await Promise.all([
      prisma.card.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.card.count({ where }),
    ]);

    return NextResponse.json({
      cards,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}

// POST /api/cards - Create a new card
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const card = await prisma.card.create({
      data: {
        playerName: body.playerName,
        position: body.position,
        team: body.team,
        nation: body.nation,
        overall: body.overall,
        pace: body.pace,
        shooting: body.shooting,
        passing: body.passing,
        dribbling: body.dribbling,
        defending: body.defending,
        physical: body.physical,
        rarity: body.rarity,
        collection: body.collection,
        imageUrl: body.imageUrl || null,
        price: body.price,
        status: 'AVAILABLE',
      },
    });

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}
