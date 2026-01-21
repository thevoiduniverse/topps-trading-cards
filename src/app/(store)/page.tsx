'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import PlayerCard from '@/components/PlayerCard';
import { Card } from '@/lib/types';

export default function HomePage() {
  const [featuredCards, setFeaturedCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCards();
  }, []);

  const fetchFeaturedCards = async () => {
    try {
      const res = await fetch('/api/cards?status=AVAILABLE&sortBy=overall&sortOrder=desc&limit=6');
      const data = await res.json();
      setFeaturedCards(data.cards);
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden hex-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--fut-bg-dark)]/50 to-[var(--fut-bg-dark)]" />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-yellow-500/10 to-transparent blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/2 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-yellow-600/10 to-transparent blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-4">
                <span className="bg-[var(--fut-gold)]/20 text-[var(--fut-gold)] text-sm font-semibold px-4 py-2 rounded-full border border-[var(--fut-gold)]/30">
                  2024 COLLECTION
                </span>
              </div>

              <h1
                className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none mb-6"
                style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '3px' }}
              >
                BUILD YOUR
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
                  ULTIMATE TEAM
                </span>
              </h1>

              <p className="text-xl text-[var(--fut-text-secondary)] mb-8 max-w-lg">
                Collect legendary players, rip exclusive packs, and build the ultimate football card collection.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/store" className="fut-btn text-lg px-8 py-4">
                  Browse Cards
                </Link>
                <Link href="/packs" className="fut-btn fut-btn-secondary text-lg px-8 py-4">
                  Open Packs
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                <div>
                  <div className="text-4xl font-bold text-[var(--fut-gold)]" style={{ fontFamily: 'var(--font-bebas)' }}>500+</div>
                  <div className="text-sm text-[var(--fut-text-muted)]">UNIQUE CARDS</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[var(--fut-gold)]" style={{ fontFamily: 'var(--font-bebas)' }}>7</div>
                  <div className="text-sm text-[var(--fut-text-muted)]">RARITY TIERS</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[var(--fut-gold)]" style={{ fontFamily: 'var(--font-bebas)' }}>100%</div>
                  <div className="text-sm text-[var(--fut-text-muted)]">AUTHENTIC</div>
                </div>
              </div>
            </div>

            {/* Featured Card Display */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--fut-bg-dark)] via-transparent to-transparent z-10" />
              {!loading && featuredCards.length > 0 && (
                <div className="relative">
                  {/* Main featured card */}
                  <div className="relative z-20 ml-12">
                    <PlayerCard card={featuredCards[0]} size="lg" />
                  </div>
                  {/* Background cards */}
                  {featuredCards[1] && (
                    <div className="absolute top-8 -left-4 opacity-60 -rotate-12 z-10">
                      <PlayerCard card={featuredCards[1]} size="md" showStats={false} />
                    </div>
                  )}
                  {featuredCards[2] && (
                    <div className="absolute top-4 right-0 opacity-40 rotate-6 z-0">
                      <PlayerCard card={featuredCards[2]} size="sm" showStats={false} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cards Section */}
      {featuredCards.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2
                className="text-4xl font-bold text-[var(--fut-gold)]"
                style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '2px' }}
              >
                TOP RATED CARDS
              </h2>
              <p className="text-[var(--fut-text-secondary)] mt-1">
                The highest rated players in our collection
              </p>
            </div>
            <Link href="/store?sortBy=overall&sortOrder=desc" className="fut-btn fut-btn-secondary">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {featuredCards.map((card) => (
              <Link key={card.id} href={`/store?search=${encodeURIComponent(card.playerName)}`}>
                <PlayerCard card={card} size="sm" showPrice />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Rarity Section */}
      <section className="bg-[var(--fut-bg-card)] border-y border-[var(--fut-border)]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold text-white"
              style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '2px' }}
            >
              RARITY TIERS
            </h2>
            <p className="text-[var(--fut-text-secondary)] mt-2">
              From common bronzes to legendary icons
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { name: 'BRONZE', color: '#cd7f32', bg: 'from-[#cd7f32]/20 to-[#8B4513]/20' },
              { name: 'SILVER', color: '#c0c0c0', bg: 'from-[#c0c0c0]/20 to-[#71797E]/20' },
              { name: 'GOLD', color: '#ffd700', bg: 'from-[#ffd700]/20 to-[#B8860B]/20' },
              { name: 'RARE GOLD', color: '#ffd700', bg: 'from-[#ffd700]/30 to-[#1a1a2e]/50', special: true },
              { name: 'IN-FORM', color: '#ff6b00', bg: 'from-[#ff6b00]/20 to-[#1a1a1a]/50', special: true },
              { name: 'HERO', color: '#00ced1', bg: 'from-[#00ced1]/20 to-[#0d3b45]/50', special: true },
              { name: 'ICON', color: '#ffd700', bg: 'from-[#ffd700]/30 to-[#2d1f47]/50', special: true },
            ].map((rarity) => (
              <div
                key={rarity.name}
                className={`p-6 rounded-xl bg-gradient-to-br ${rarity.bg} border border-[var(--fut-border)] text-center hover:scale-105 transition-transform cursor-pointer`}
                style={{ borderColor: rarity.special ? rarity.color + '40' : undefined }}
              >
                <div
                  className="text-3xl font-bold mb-2"
                  style={{ color: rarity.color, fontFamily: 'var(--font-bebas)' }}
                >
                  {rarity.name.split(' ')[0]}
                </div>
                {rarity.name.includes(' ') && (
                  <div className="text-sm" style={{ color: rarity.color }}>
                    {rarity.name.split(' ')[1]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="fut-card p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10" />

          <h2
            className="text-5xl font-bold text-white mb-4 relative"
            style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '2px' }}
          >
            READY TO START YOUR COLLECTION?
          </h2>
          <p className="text-xl text-[var(--fut-text-secondary)] mb-8 relative max-w-2xl mx-auto">
            Open packs for a chance at legendary icons or browse individual cards in our store.
          </p>
          <div className="flex justify-center gap-4 relative">
            <Link href="/packs" className="fut-btn text-lg px-8 py-4">
              Open Packs
            </Link>
            <Link href="/store" className="fut-btn fut-btn-secondary text-lg px-8 py-4">
              Browse Store
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--fut-border)] py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-[var(--fut-text-muted)] text-sm">
          <p>TOPPS Trading Cards - Demo Application</p>
          <p className="mt-1">FUT-inspired design. Not affiliated with EA Sports.</p>
        </div>
      </footer>
    </div>
  );
}
