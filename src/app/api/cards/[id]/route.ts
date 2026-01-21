import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/cards/[id] - Get a single card
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const card = await prisma.card.findUnique({
      where: { id },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error fetching card:', error);
    return NextResponse.json({ error: 'Failed to fetch card' }, { status: 500 });
  }
}

// PUT /api/cards/[id] - Update a card
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const card = await prisma.card.update({
      where: { id },
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
        status: body.status,
      },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
  }
}

// DELETE /api/cards/[id] - Delete a card
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if card exists and is available
    const card = await prisma.card.findUnique({ where: { id } });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    if (card.status !== 'AVAILABLE') {
      return NextResponse.json(
        { error: 'Cannot delete a card that is not available' },
        { status: 400 }
      );
    }

    await prisma.card.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting card:', error);
    return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
  }
}
