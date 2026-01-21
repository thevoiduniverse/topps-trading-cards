import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/packs/[id] - Get a single pack template
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pack = await prisma.packTemplate.findUnique({
      where: { id },
    });

    if (!pack) {
      return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...pack,
      rarityDistribution: JSON.parse(pack.rarityDistribution),
    });
  } catch (error) {
    console.error('Error fetching pack:', error);
    return NextResponse.json({ error: 'Failed to fetch pack' }, { status: 500 });
  }
}

// PUT /api/packs/[id] - Update a pack template
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate rarity distribution if provided
    if (body.rarityDistribution) {
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
    }

    const pack = await prisma.packTemplate.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description || null,
        price: body.price,
        imageUrl: body.imageUrl || null,
        rarityDistribution: JSON.stringify(body.rarityDistribution),
        totalCards: body.totalCards,
        isActive: body.isActive,
      },
    });

    return NextResponse.json({
      ...pack,
      rarityDistribution: JSON.parse(pack.rarityDistribution),
    });
  } catch (error) {
    console.error('Error updating pack:', error);
    return NextResponse.json({ error: 'Failed to update pack' }, { status: 500 });
  }
}

// DELETE /api/packs/[id] - Delete a pack template
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if pack has any purchases
    const purchaseCount = await prisma.packPurchase.count({
      where: { packTemplateId: id },
    });

    if (purchaseCount > 0) {
      // Instead of deleting, deactivate the pack
      await prisma.packTemplate.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({ success: true, deactivated: true });
    }

    await prisma.packTemplate.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting pack:', error);
    return NextResponse.json({ error: 'Failed to delete pack' }, { status: 500 });
  }
}
