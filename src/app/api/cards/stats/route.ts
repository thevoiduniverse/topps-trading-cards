import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/cards/stats - Get inventory statistics
export async function GET() {
  try {
    const [
      totalCards,
      availableCards,
      soldCards,
      packedCards,
      rarityStats,
      teamStats,
      collectionStats,
    ] = await Promise.all([
      prisma.card.count(),
      prisma.card.count({ where: { status: 'AVAILABLE' } }),
      prisma.card.count({ where: { status: 'SOLD' } }),
      prisma.card.count({ where: { status: 'PACKED' } }),
      prisma.card.groupBy({
        by: ['rarity'],
        _count: { rarity: true },
        where: { status: 'AVAILABLE' },
      }),
      prisma.card.groupBy({
        by: ['team'],
        _count: { team: true },
        where: { status: 'AVAILABLE' },
        orderBy: { _count: { team: 'desc' } },
        take: 20,
      }),
      prisma.card.groupBy({
        by: ['collection'],
        _count: { collection: true },
        where: { status: 'AVAILABLE' },
      }),
    ]);

    return NextResponse.json({
      total: totalCards,
      available: availableCards,
      sold: soldCards,
      packed: packedCards,
      byRarity: rarityStats.reduce((acc, item) => {
        acc[item.rarity] = item._count.rarity;
        return acc;
      }, {} as Record<string, number>),
      teams: teamStats.map((t) => ({ team: t.team, count: t._count.team })),
      collections: collectionStats.map((c) => ({
        collection: c.collection,
        count: c._count.collection,
      })),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
