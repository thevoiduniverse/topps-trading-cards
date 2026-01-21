'use client';

import { useEffect, useState } from 'react';
import PlayerCard from '@/components/PlayerCard';
import { PackTemplate, Card, Rarity, RARITY_LABELS } from '@/lib/types';
import { useStore } from '@/store/useStore';

export default function PacksPage() {
  const { showNotification } = useStore();

  const [packs, setPacks] = useState<PackTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPack, setSelectedPack] = useState<PackTemplate | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [revealedCards, setRevealedCards] = useState<Card[]>([]);
  const [revealPhase, setRevealPhase] = useState<'idle' | 'opening' | 'revealing' | 'done'>('idle');
  const [currentRevealIndex, setCurrentRevealIndex] = useState(0);

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    try {
      const res = await fetch('/api/packs?activeOnly=true');
      const data = await res.json();
      setPacks(data);
    } catch (error) {
      console.error('Failed to fetch packs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPack = async (pack: PackTemplate) => {
    setSelectedPack(pack);
    setIsOpening(true);
    setRevealPhase('opening');
    setRevealedCards([]);
    setCurrentRevealIndex(0);

    // Simulate pack opening animation
    setTimeout(async () => {
      try {
        const res = await fetch('/api/packs/open', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            packTemplateId: pack.id,
            buyerEmail: 'demo@example.com',
            buyerName: 'Demo User',
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to open pack');
        }

        const data = await res.json();
        setRevealedCards(data.cards);
        setRevealPhase('revealing');

        // Start revealing cards one by one
        for (let i = 0; i < data.cards.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 400));
          setCurrentRevealIndex(i + 1);
        }

        setRevealPhase('done');
      } catch (error) {
        console.error('Failed to open pack:', error);
        showNotification(error instanceof Error ? error.message : 'Failed to open pack', 'error');
        setIsOpening(false);
        setRevealPhase('idle');
      }
    }, 1500);
  };

  const handleClose = () => {
    setIsOpening(false);
    setRevealPhase('idle');
    setSelectedPack(null);
    setRevealedCards([]);
    setCurrentRevealIndex(0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--fut-gold)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1
          className="text-5xl md:text-6xl font-bold text-[var(--fut-gold)]"
          style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '3px' }}
        >
          OPEN PACKS
        </h1>
        <p className="text-[var(--fut-text-secondary)] mt-2 text-lg">
          Test your luck and pull legendary cards
        </p>
      </div>

      {/* Packs Grid */}
      {packs.length === 0 ? (
        <div className="text-center py-16 fut-card max-w-md mx-auto">
          <svg className="w-20 h-20 mx-auto text-[var(--fut-text-muted)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-xl font-bold mb-2">No packs available</h3>
          <p className="text-[var(--fut-text-secondary)]">
            Check back soon or contact admin
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="fut-card p-8 text-center group hover:border-[var(--fut-gold)] transition-all duration-300"
            >
              {/* Pack Visual */}
              <div className="relative w-32 h-44 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 rounded-xl pack-glow transform group-hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-2 border-2 border-yellow-300/30 rounded-lg" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto text-black/60 mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span className="text-black/80 font-bold text-xs uppercase tracking-wider">
                        {pack.totalCards} Cards
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <h3
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '1px' }}
              >
                {pack.name}
              </h3>

              {pack.description && (
                <p className="text-[var(--fut-text-secondary)] text-sm mb-4">
                  {pack.description}
                </p>
              )}

              {/* Rarity Distribution */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {pack.rarityDistribution.map((slot, i) => (
                  <span
                    key={i}
                    className={`fut-badge fut-badge-${slot.rarity.toLowerCase().replace('_', '-')} text-xs`}
                  >
                    {slot.count}x {RARITY_LABELS[slot.rarity as Rarity]}
                  </span>
                ))}
              </div>

              <div className="text-3xl font-bold text-[var(--fut-gold)] mb-4">
                ${pack.price}
              </div>

              <button
                onClick={() => handleOpenPack(pack)}
                className="fut-btn w-full text-lg py-4 group-hover:shadow-lg group-hover:shadow-yellow-500/20"
              >
                Open Pack
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pack Opening Modal */}
      {isOpening && selectedPack && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-yellow-500/20 to-transparent blur-3xl animate-pulse" />
          </div>

          {/* Opening Animation */}
          {revealPhase === 'opening' && (
            <div className="relative z-10 text-center">
              <div className="w-48 h-64 mx-auto mb-8 relative pack-opening">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-700 rounded-xl pack-glow">
                  <div className="absolute inset-4 border-2 border-yellow-300/30 rounded-lg" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-16 h-16 text-black/60" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
              </div>
              <h2
                className="text-4xl font-bold text-[var(--fut-gold)] animate-pulse"
                style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '2px' }}
              >
                OPENING {selectedPack.name.toUpperCase()}...
              </h2>
            </div>
          )}

          {/* Card Reveal */}
          {(revealPhase === 'revealing' || revealPhase === 'done') && (
            <div className="relative z-10 w-full max-w-6xl px-6">
              <h2
                className="text-4xl font-bold text-center text-[var(--fut-gold)] mb-8"
                style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '2px' }}
              >
                {revealPhase === 'revealing' ? 'REVEALING YOUR CARDS...' : 'YOUR CARDS!'}
              </h2>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {revealedCards.map((card, index) => (
                  <div
                    key={card.id}
                    className={`transition-all duration-500 ${
                      index < currentRevealIndex
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-50'
                    }`}
                    style={{
                      transitionDelay: `${index * 100}ms`,
                    }}
                  >
                    <PlayerCard
                      card={card}
                      size="sm"
                      isRevealing={index < currentRevealIndex}
                      revealDelay={index * 100}
                    />
                  </div>
                ))}
              </div>

              {revealPhase === 'done' && (
                <div className="text-center">
                  <p className="text-[var(--fut-text-secondary)] mb-6">
                    {revealedCards.length} cards added to collection!
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => handleOpenPack(selectedPack)}
                      className="fut-btn text-lg px-8 py-4"
                    >
                      Open Another
                    </button>
                    <button
                      onClick={handleClose}
                      className="fut-btn fut-btn-secondary text-lg px-8 py-4"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Close button */}
          {revealPhase !== 'opening' && (
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-3 text-[var(--fut-text-muted)] hover:text-white transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
