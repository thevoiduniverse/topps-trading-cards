// Topps Card Types

export type ParallelType =
  | 'BASE'
  | 'REFRACTOR'
  | 'PRISM_REFRACTOR'
  | 'XFRACTOR'
  | 'SPECKLE_REFRACTOR'
  | 'WAVE_REFRACTOR'
  | 'SUPERFRACTOR';

export type ColorVariant =
  | 'BLUE'
  | 'GREEN'
  | 'GOLD'
  | 'ORANGE'
  | 'BLACK'
  | 'RED'
  | 'PURPLE'
  | 'PINK'
  | 'AQUA'
  | 'CAMO'
  | null;

export type Condition =
  | 'MINT'
  | 'NEAR_MINT'
  | 'EXCELLENT'
  | 'GOOD'
  | 'FAIR'
  | 'POOR';

export type CardStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD';

export interface Card {
  id: string;

  // Player info
  playerName: string;
  team: string;
  sport: string;

  // Card set info
  year: number;
  setName: string;
  cardNumber: string | null;

  // Images
  frontImageUrl: string | null;
  backImageUrl: string | null;

  // Parallel info
  parallelType: string;
  colorVariant: string | null;

  // Numbered
  isNumbered: boolean;
  printRun: number | null;
  serialNumber: number | null;

  // Special designations
  isRookie: boolean;
  isAutograph: boolean;
  isRelic: boolean;
  isShortPrint: boolean;
  isVariation: boolean;

  // Condition
  condition: string;
  conditionNotes: string | null;

  // Price and status
  price: number;
  status: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  cardId: string;
  card: Card;
  addedAt: Date;
}

export interface Cart {
  id: string;
  sessionId: string;
  items: CartItem[];
  expiresAt: Date;
}

// Display labels
export const PARALLEL_LABELS: Record<string, string> = {
  BASE: 'Base',
  REFRACTOR: 'Refractor',
  PRISM_REFRACTOR: 'Prism Refractor',
  XFRACTOR: 'X-Fractor',
  SPECKLE_REFRACTOR: 'Speckle Refractor',
  WAVE_REFRACTOR: 'Wave Refractor',
  SUPERFRACTOR: 'Superfractor',
};

export const COLOR_LABELS: Record<string, string> = {
  BLUE: 'Blue',
  GREEN: 'Green',
  GOLD: 'Gold',
  ORANGE: 'Orange',
  BLACK: 'Black',
  RED: 'Red',
  PURPLE: 'Purple',
  PINK: 'Pink',
  AQUA: 'Aqua',
  CAMO: 'Camo',
};

export const CONDITION_LABELS: Record<string, string> = {
  MINT: 'Mint',
  NEAR_MINT: 'Near Mint',
  EXCELLENT: 'Excellent',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor',
};

export const PARALLEL_TYPES = Object.keys(PARALLEL_LABELS);
export const COLOR_VARIANTS = Object.keys(COLOR_LABELS);
export const CONDITIONS = Object.keys(CONDITION_LABELS);

// Common Topps sets
export const COMMON_SETS = [
  'Topps Chrome',
  'Topps Finest',
  'Bowman Chrome',
  'Topps Stadium Club',
  'Topps Sapphire',
  'Topps Heritage',
  'Topps Update',
  'Topps Series 1',
  'Topps Series 2',
  'Topps Opening Day',
  'Topps Fire',
  'Topps Gold Label',
];

// Common print runs for numbered cards
export const COMMON_PRINT_RUNS = [1, 5, 10, 25, 50, 75, 99, 150, 199, 250, 299, 499];

// Helper function to format numbered display
export function formatNumbered(serialNumber: number | null, printRun: number | null): string {
  if (!printRun) return '';
  if (printRun === 1) return '1/1';
  if (serialNumber) return `${serialNumber}/${printRun}`;
  return `/${printRun}`;
}

// Helper to get card display name
export function getCardDisplayName(card: Card): string {
  const parts: string[] = [];

  if (card.year) parts.push(card.year.toString());
  if (card.setName) parts.push(card.setName);
  if (card.colorVariant) parts.push(COLOR_LABELS[card.colorVariant] || card.colorVariant);
  if (card.parallelType !== 'BASE') parts.push(PARALLEL_LABELS[card.parallelType] || card.parallelType);

  return parts.join(' ');
}

// Helper to get rarity badge info
export function getCardRarityInfo(card: Card): { label: string; color: string } {
  if (card.printRun === 1) {
    return { label: '1/1', color: '#ff0000' };
  }
  if (card.printRun && card.printRun <= 5) {
    return { label: `/${card.printRun}`, color: '#ff4444' };
  }
  if (card.printRun && card.printRun <= 10) {
    return { label: `/${card.printRun}`, color: '#ff6600' };
  }
  if (card.printRun && card.printRun <= 25) {
    return { label: `/${card.printRun}`, color: '#ffa500' };
  }
  if (card.printRun && card.printRun <= 50) {
    return { label: `/${card.printRun}`, color: '#ffd700' };
  }
  if (card.printRun && card.printRun <= 99) {
    return { label: `/${card.printRun}`, color: '#00ff00' };
  }
  if (card.printRun) {
    return { label: `/${card.printRun}`, color: '#00bfff' };
  }

  // Non-numbered cards
  if (card.parallelType === 'SUPERFRACTOR') {
    return { label: 'Superfractor', color: '#ff0000' };
  }
  if (card.parallelType !== 'BASE') {
    return { label: PARALLEL_LABELS[card.parallelType] || card.parallelType, color: '#c8f038' };
  }

  return { label: 'Base', color: '#888888' };
}
