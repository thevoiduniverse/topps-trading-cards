export type Rarity = 'BRONZE' | 'SILVER' | 'GOLD' | 'RARE_GOLD' | 'INFORM' | 'ICON' | 'HERO';
export type CardStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'PACKED';
export type Position = 'GK' | 'CB' | 'LB' | 'RB' | 'CDM' | 'CM' | 'CAM' | 'LM' | 'RM' | 'LW' | 'RW' | 'CF' | 'ST';

export interface Card {
  id: string;
  playerName: string;
  position: Position;
  team: string;
  nation: string;
  overall: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  rarity: Rarity;
  collection: string;
  imageUrl: string | null;
  price: number;
  status: CardStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CardFormData {
  playerName: string;
  position: Position;
  team: string;
  nation: string;
  overall: number;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  rarity: Rarity;
  collection: string;
  imageUrl?: string;
  price: number;
}

export interface RaritySlot {
  rarity: Rarity;
  count: number;
  guaranteedMin: number;
}

export interface PackTemplate {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  rarityDistribution: RaritySlot[];
  totalCards: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PackTemplateFormData {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  rarityDistribution: RaritySlot[];
  totalCards: number;
}

export interface CartItem {
  id: string;
  card: Card;
  addedAt: string;
}

export interface Cart {
  id: string;
  sessionId: string;
  items: CartItem[];
  expiresAt: string;
}

export const RARITY_ORDER: Rarity[] = ['BRONZE', 'SILVER', 'GOLD', 'RARE_GOLD', 'INFORM', 'HERO', 'ICON'];

export const RARITY_LABELS: Record<Rarity, string> = {
  BRONZE: 'Bronze',
  SILVER: 'Silver',
  GOLD: 'Gold',
  RARE_GOLD: 'Rare Gold',
  INFORM: 'In-Form',
  ICON: 'Icon',
  HERO: 'Hero',
};

export const POSITIONS: Position[] = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'CF', 'ST'];

export const POSITION_LABELS: Record<Position, string> = {
  GK: 'Goalkeeper',
  CB: 'Center Back',
  LB: 'Left Back',
  RB: 'Right Back',
  CDM: 'Defensive Mid',
  CM: 'Center Mid',
  CAM: 'Attacking Mid',
  LM: 'Left Mid',
  RM: 'Right Mid',
  LW: 'Left Wing',
  RW: 'Right Wing',
  CF: 'Center Forward',
  ST: 'Striker',
};
