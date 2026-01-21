import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/cards - List cards with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const parallelType = searchParams.get('parallelType');
    const colorVariant = searchParams.get('colorVariant');
    const team = searchParams.get('team');
    const setName = searchParams.get('setName');
    const year = searchParams.get('year');
    const sport = searchParams.get('sport');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const isNumbered = searchParams.get('isNumbered');
    const isRookie = searchParams.get('isRookie');
    const isAutograph = searchParams.get('isAutograph');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (parallelType) where.parallelType = parallelType;
    if (colorVariant) where.colorVariant = colorVariant;
    if (team) where.team = { contains: team };
    if (setName) where.setName = { contains: setName };
    if (year) where.year = parseInt(year);
    if (sport) where.sport = sport;
    if (isNumbered === 'true') where.isNumbered = true;
    if (isRookie === 'true') where.isRookie = true;
    if (isAutograph === 'true') where.isAutograph = true;

    if (search) {
      where.OR = [
        { playerName: { contains: search } },
        { team: { contains: search } },
        { setName: { contains: search } },
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
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
        team: body.team,
        sport: body.sport || 'Football',
        year: parseInt(body.year),
        setName: body.setName,
        cardNumber: body.cardNumber || null,
        frontImageUrl: body.frontImageUrl || null,
        backImageUrl: body.backImageUrl || null,
        parallelType: body.parallelType || 'BASE',
        colorVariant: body.colorVariant || null,
        isNumbered: body.isNumbered || false,
        printRun: body.printRun ? parseInt(body.printRun) : null,
        serialNumber: body.serialNumber ? parseInt(body.serialNumber) : null,
        isRookie: body.isRookie || false,
        isAutograph: body.isAutograph || false,
        isRelic: body.isRelic || false,
        isShortPrint: body.isShortPrint || false,
        isVariation: body.isVariation || false,
        condition: body.condition || 'NEAR_MINT',
        conditionNotes: body.conditionNotes || null,
        price: parseFloat(body.price),
        status: 'AVAILABLE',
      },
    });

    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}
