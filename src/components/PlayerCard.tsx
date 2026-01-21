'use client';

import { Card, Rarity, RARITY_LABELS } from '@/lib/types';

interface PlayerCardProps {
  card: Card;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  showPrice?: boolean;
  showStats?: boolean;
  className?: string;
  isRevealing?: boolean;
  revealDelay?: number;
}

const RARITY_CLASSES: Record<Rarity, string> = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  RARE_GOLD: 'rare-gold',
  INFORM: 'inform',
  ICON: 'icon',
  HERO: 'hero',
};

const SIZE_CLASSES = {
  sm: { card: 'w-[140px] h-[210px]', rating: 'text-lg w-8 h-8', name: 'text-xs', stats: 'text-[10px]' },
  md: { card: 'w-[180px] h-[270px]', rating: 'text-2xl w-10 h-10', name: 'text-sm', stats: 'text-xs' },
  lg: { card: 'w-[220px] h-[330px]', rating: 'text-3xl w-12 h-12', name: 'text-base', stats: 'text-sm' },
};

export default function PlayerCard({
  card,
  size = 'md',
  onClick,
  showPrice = false,
  showStats = true,
  className = '',
  isRevealing = false,
  revealDelay = 0,
}: PlayerCardProps) {
  const rarityClass = RARITY_CLASSES[card.rarity as Rarity] || 'gold';
  const sizeClass = SIZE_CLASSES[size];

  const isDarkCard = ['RARE_GOLD', 'INFORM', 'ICON', 'HERO'].includes(card.rarity);
  const textColor = isDarkCard ? 'text-white' : 'text-gray-900';
  const subTextColor = isDarkCard ? 'text-gray-300' : 'text-gray-700';

  return (
    <div
      className={`player-card ${rarityClass} ${sizeClass.card} ${className} ${
        onClick ? 'cursor-pointer' : ''
      } ${isRevealing ? 'card-revealing' : ''}`}
      onClick={onClick}
      style={isRevealing ? { animationDelay: `${revealDelay}ms` } : undefined}
    >
      {/* Rating Badge */}
      <div className="flex items-start justify-between mb-2">
        <div className={`rating-badge ${sizeClass.rating} rounded-lg`}>
          {card.overall}
        </div>
        <div className={`text-right ${subTextColor}`}>
          <div className={`${sizeClass.stats} font-bold uppercase`}>{card.position}</div>
        </div>
      </div>

      {/* Player Image Area */}
      <div className="flex-1 flex items-center justify-center relative mb-2">
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.playerName}
            className="max-h-full max-w-full object-contain drop-shadow-lg"
          />
        ) : (
          <div className={`${sizeClass.rating} ${isDarkCard ? 'text-gray-400' : 'text-gray-600'} flex items-center justify-center`}>
            <svg className="w-16 h-16 opacity-40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>

      {/* Player Name */}
      <div className={`text-center ${textColor} ${sizeClass.name} font-bold uppercase tracking-wide mb-1 truncate px-2`}>
        {card.playerName}
      </div>

      {/* Team & Nation */}
      <div className={`text-center ${subTextColor} ${sizeClass.stats} mb-2`}>
        <span>{card.team}</span>
        <span className="mx-1">•</span>
        <span>{card.nation}</span>
      </div>

      {/* Stats Grid */}
      {showStats && (
        <div className="grid grid-cols-3 gap-1 px-2 mb-2">
          <StatItem label="PAC" value={card.pace} size={size} isDark={isDarkCard} />
          <StatItem label="SHO" value={card.shooting} size={size} isDark={isDarkCard} />
          <StatItem label="PAS" value={card.passing} size={size} isDark={isDarkCard} />
          <StatItem label="DRI" value={card.dribbling} size={size} isDark={isDarkCard} />
          <StatItem label="DEF" value={card.defending} size={size} isDark={isDarkCard} />
          <StatItem label="PHY" value={card.physical} size={size} isDark={isDarkCard} />
        </div>
      )}

      {/* Price Tag */}
      {showPrice && (
        <div className="mt-auto pt-2 border-t border-black/20">
          <div className={`text-center ${sizeClass.name} font-bold ${isDarkCard ? 'text-[var(--nxg-lime)]' : 'text-gray-900'}`}>
            ${card.price.toLocaleString()}
          </div>
        </div>
      )}

      {/* Rarity Badge */}
      <div className="absolute bottom-2 right-2">
        <span className={`nxg-badge nxg-badge-${rarityClass.replace('-', '-')}`} style={{ fontSize: '9px', padding: '4px 8px' }}>
          {RARITY_LABELS[card.rarity as Rarity]}
        </span>
      </div>
    </div>
  );
}

function StatItem({ label, value, size, isDark }: { label: string; value: number; size: 'sm' | 'md' | 'lg'; isDark: boolean }) {
  const sizeClass = SIZE_CLASSES[size];
  return (
    <div className="text-center">
      <div className={`${sizeClass.stats} ${isDark ? 'text-gray-400' : 'text-gray-600'} uppercase`}>{label}</div>
      <div className={`${sizeClass.stats} ${isDark ? 'text-white' : 'text-gray-900'} font-bold`}>{value}</div>
    </div>
  );
}
