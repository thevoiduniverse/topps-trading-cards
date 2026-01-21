'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, PARALLEL_LABELS, COLOR_LABELS, formatNumbered, getCardRarityInfo } from '@/lib/types';

interface TradingCardProps {
  card: Card;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  showPrice?: boolean;
  className?: string;
}

const SIZE_CONFIG = {
  sm: {
    card: 'w-[180px]',
    image: 'h-[240px]',
    name: 'text-sm',
    meta: 'text-xs',
    price: 'text-base',
    badge: 'text-[10px] px-2 py-1'
  },
  md: {
    card: 'w-[220px]',
    image: 'h-[293px]',
    name: 'text-base',
    meta: 'text-sm',
    price: 'text-lg',
    badge: 'text-xs px-2.5 py-1'
  },
  lg: {
    card: 'w-[280px]',
    image: 'h-[373px]',
    name: 'text-lg',
    meta: 'text-sm',
    price: 'text-xl',
    badge: 'text-xs px-3 py-1.5'
  },
};

export default function TradingCard({
  card,
  size = 'md',
  onClick,
  showPrice = false,
  className = '',
}: TradingCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState({ front: false, back: false });
  const config = SIZE_CONFIG[size];
  const rarityInfo = getCardRarityInfo(card);

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (card.backImageUrl) {
      setIsFlipped(!isFlipped);
    }
  };

  const hasNumbered = card.isNumbered && card.printRun;
  const parallelLabel = card.parallelType !== 'BASE' ? PARALLEL_LABELS[card.parallelType] || card.parallelType : null;
  const colorLabel = card.colorVariant ? COLOR_LABELS[card.colorVariant] || card.colorVariant : null;

  return (
    <div className={`${config.card} ${className}`}>
      {/* Card Container with 3D flip */}
      <div
        className={`relative cursor-pointer perspective-1000`}
        onClick={onClick}
        style={{ perspective: '1000px' }}
      >
        <div
          className={`relative transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front of Card */}
          <div
            className="trading-card"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Image Container */}
            <div className={`trading-card-image ${config.image}`}>
              {card.frontImageUrl && !imageError.front ? (
                <Image
                  src={card.frontImageUrl}
                  alt={`${card.playerName} - Front`}
                  fill
                  className="object-cover"
                  onError={() => setImageError(prev => ({ ...prev, front: true }))}
                />
              ) : (
                <div className="trading-card-placeholder">
                  <svg className="w-16 h-16 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                  </svg>
                </div>
              )}

              {/* Badges */}
              <div className="trading-card-badges">
                <div className="flex flex-col gap-1">
                  {hasNumbered && (
                    <span
                      className={`trading-card-numbered ${config.badge}`}
                      style={{ backgroundColor: rarityInfo.color }}
                    >
                      {formatNumbered(card.serialNumber, card.printRun)}
                    </span>
                  )}
                  {card.isRookie && (
                    <span className={`badge badge-rookie ${config.badge}`}>RC</span>
                  )}
                  {card.isAutograph && (
                    <span className={`badge badge-auto ${config.badge}`}>AUTO</span>
                  )}
                </div>

                {card.backImageUrl && (
                  <button
                    onClick={handleFlip}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
                    title="Flip card"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Card Info */}
            <div className="trading-card-info">
              <div className={`trading-card-name ${config.name}`}>
                {card.playerName}
              </div>
              <div className={`trading-card-meta ${config.meta}`}>
                {card.year} {card.setName}
                {colorLabel && ` • ${colorLabel}`}
                {parallelLabel && ` ${parallelLabel}`}
              </div>

              <div className="trading-card-footer">
                {showPrice ? (
                  <span className={`trading-card-price ${config.price}`}>
                    ${card.price.toLocaleString()}
                  </span>
                ) : (
                  <span className={`badge badge-outline ${config.badge}`}>
                    {rarityInfo.label}
                  </span>
                )}

                <span className={`text-muted ${config.meta}`}>
                  {card.team}
                </span>
              </div>
            </div>
          </div>

          {/* Back of Card */}
          {card.backImageUrl && (
            <div
              className="trading-card absolute inset-0"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <div className={`trading-card-image ${config.image}`}>
                {!imageError.back ? (
                  <Image
                    src={card.backImageUrl}
                    alt={`${card.playerName} - Back`}
                    fill
                    className="object-cover"
                    onError={() => setImageError(prev => ({ ...prev, back: true }))}
                  />
                ) : (
                  <div className="trading-card-placeholder">
                    <svg className="w-16 h-16 opacity-30" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </div>
                )}

                <div className="trading-card-badges">
                  <div></div>
                  <button
                    onClick={handleFlip}
                    className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
                    title="Flip card"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="trading-card-info">
                <div className={`trading-card-name ${config.name}`}>
                  {card.playerName}
                </div>
                <div className={`trading-card-meta ${config.meta}`}>
                  Card Back
                </div>
                <div className="trading-card-footer">
                  <span className={`text-lime ${config.meta}`}>
                    Click to flip
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
