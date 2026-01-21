import { PrismaClient } from '../generated/prisma';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || 'file:./dev.db',
  });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Card rarity types
export const RARITIES = ['BRONZE', 'SILVER', 'GOLD', 'RARE_GOLD', 'INFORM', 'ICON', 'HERO'] as const;
export type Rarity = typeof RARITIES[number];

// Card status types
export const CARD_STATUSES = ['AVAILABLE', 'RESERVED', 'SOLD', 'PACKED'] as const;
export type CardStatus = typeof CARD_STATUSES[number];

// Position types
export const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'CF', 'ST'] as const;
export type Position = typeof POSITIONS[number];

// Rarity configuration for display
export const RARITY_CONFIG: Record<Rarity, { label: string; color: string; bgColor: string; minRating: number; maxRating: number }> = {
  BRONZE: { label: 'Bronze', color: '#cd7f32', bgColor: '#8B4513', minRating: 50, maxRating: 64 },
  SILVER: { label: 'Silver', color: '#C0C0C0', bgColor: '#71797E', minRating: 65, maxRating: 74 },
  GOLD: { label: 'Gold', color: '#FFD700', bgColor: '#B8860B', minRating: 75, maxRating: 82 },
  RARE_GOLD: { label: 'Rare Gold', color: '#FFD700', bgColor: '#1a1a2e', minRating: 83, maxRating: 89 },
  INFORM: { label: 'In-Form', color: '#000000', bgColor: '#1a1a1a', minRating: 84, maxRating: 94 },
  ICON: { label: 'Icon', color: '#FFD700', bgColor: '#2d1f47', minRating: 85, maxRating: 97 },
  HERO: { label: 'Hero', color: '#00CED1', bgColor: '#0d3b45', minRating: 85, maxRating: 92 },
};

export default prisma;
