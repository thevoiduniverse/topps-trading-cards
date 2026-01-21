'use client';

import Link from 'next/link';
import Image from 'next/image';
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
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-[var(--nxg-bg-primary)]" />

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-[var(--nxg-purple)]/20 blur-[120px] animate-pulse-glow" />
          <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-[var(--nxg-lime)]/15 blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[var(--nxg-purple)]/10 blur-[150px]" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--nxg-text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--nxg-text-primary) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-8">
                <span className="nxg-badge nxg-badge-lime">
                  <span className="w-2 h-2 rounded-full bg-[var(--nxg-lime)] mr-2 animate-pulse" />
                  2024 Collection Live
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                The Future of
                <br />
                <span className="text-gradient-lime">
                  Card Collecting
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-[var(--nxg-text-secondary)] mb-10 leading-relaxed max-w-lg font-light">
                Discover premium football cards. Open exclusive packs. Build your ultimate collection.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-16">
                <Link href="/store" className="nxg-btn text-lg px-8 py-4">
                  Explore Collection
                </Link>
                <Link href="/packs" className="nxg-btn nxg-btn-secondary text-lg px-8 py-4">
                  Open Packs
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-12">
                <div>
                  <div className="text-4xl font-bold text-white mb-1">500+</div>
                  <div className="text-sm text-[var(--nxg-text-muted)] font-medium">Unique Cards</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-1">7</div>
                  <div className="text-sm text-[var(--nxg-text-muted)] font-medium">Rarity Tiers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-white mb-1">24/7</div>
                  <div className="text-sm text-[var(--nxg-text-muted)] font-medium">Pack Drops</div>
                </div>
              </div>
            </div>

            {/* Featured Card Display */}
            <div className="relative hidden lg:flex justify-center items-center">
              {!loading && featuredCards.length > 0 && (
                <div className="relative">
                  {/* Glow effect behind cards */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[var(--nxg-lime)]/20 blur-[80px]" />

                  {/* Main featured card */}
                  <div className="relative z-20 animate-float">
                    <PlayerCard card={featuredCards[0]} size="lg" />
                  </div>

                  {/* Background cards */}
                  {featuredCards[1] && (
                    <div className="absolute top-8 -left-16 opacity-50 -rotate-12 z-10 scale-90">
                      <PlayerCard card={featuredCards[1]} size="md" showStats={false} />
                    </div>
                  )}
                  {featuredCards[2] && (
                    <div className="absolute top-4 -right-12 opacity-40 rotate-6 z-0 scale-75">
                      <PlayerCard card={featuredCards[2]} size="md" showStats={false} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--nxg-text-muted)]">
          <span className="text-xs font-medium tracking-wider uppercase">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-[var(--nxg-border-strong)] flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-[var(--nxg-lime)] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Featured Cards Section */}
      {featuredCards.length > 0 && (
        <section className="relative py-24 bg-[var(--nxg-bg-secondary)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="nxg-badge nxg-badge-purple mb-4 inline-block">Featured</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                  Top Rated Cards
                </h2>
                <p className="text-[var(--nxg-text-secondary)] mt-3 text-lg">
                  The highest rated players in our collection
                </p>
              </div>
              <Link href="/store?sortBy=overall&sortOrder=desc" className="nxg-btn nxg-btn-secondary">
                View All Cards
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {featuredCards.map((card) => (
                <Link key={card.id} href={`/store?search=${encodeURIComponent(card.playerName)}`}>
                  <PlayerCard card={card} size="sm" showPrice />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Rarity Section */}
      <section className="py-24 bg-[var(--nxg-bg-primary)] relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--nxg-purple)]/10 blur-[150px]" />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <span className="nxg-badge nxg-badge-lime mb-4 inline-block">Card Tiers</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Seven Levels of Rarity
            </h2>
            <p className="text-[var(--nxg-text-secondary)] mt-4 text-lg max-w-2xl mx-auto">
              From common bronze cards to legendary icons, every pack holds the potential for greatness.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { name: 'Bronze', color: '#cd7f32', gradient: 'from-[#cd7f32]/20 to-[#8B4513]/20' },
              { name: 'Silver', color: '#c0c0c0', gradient: 'from-[#c0c0c0]/20 to-[#71797E]/20' },
              { name: 'Gold', color: '#ffd700', gradient: 'from-[#ffd700]/20 to-[#B8860B]/20' },
              { name: 'Rare Gold', color: '#ffc125', gradient: 'from-[#ffc125]/25 to-[#1a1a2e]/30', special: true },
              { name: 'In-Form', color: '#ff6b35', gradient: 'from-[#ff6b35]/20 to-[#1a1a1a]/30', special: true },
              { name: 'Hero', color: '#00d9ff', gradient: 'from-[#00d9ff]/20 to-[#0d3b45]/30', special: true },
              { name: 'Icon', color: '#e040fb', gradient: 'from-[#e040fb]/25 to-[#2d1f47]/30', special: true },
            ].map((rarity) => (
              <div
                key={rarity.name}
                className={`glass-card p-6 text-center group cursor-pointer`}
                style={{ borderColor: rarity.special ? rarity.color + '30' : undefined }}
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${rarity.color}30, ${rarity.color}10)` }}
                >
                  <div
                    className="w-6 h-6 rounded-md"
                    style={{ background: rarity.color }}
                  />
                </div>
                <div
                  className="text-lg font-semibold mb-1"
                  style={{ color: rarity.color }}
                >
                  {rarity.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[var(--nxg-bg-secondary)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              Why neXGen?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                ),
                title: 'Premium Packs',
                description: 'Open curated packs with guaranteed rare pulls and exclusive card variants.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Instant Delivery',
                description: 'Cards are added to your collection immediately. No waiting, no delays.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Authentic Cards',
                description: 'Every card is verified and tracked. Build your collection with confidence.',
              },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8">
                <div className="w-14 h-14 rounded-2xl bg-[var(--nxg-lime)]/10 flex items-center justify-center text-[var(--nxg-lime)] mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-[var(--nxg-text-secondary)] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[var(--nxg-bg-primary)] relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--nxg-lime)]/10 blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative">
          <div className="glass-card-strong p-12 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to Start?
            </h2>
            <p className="text-xl text-[var(--nxg-text-secondary)] mb-10 max-w-2xl mx-auto">
              Open packs for a chance at legendary icons or browse individual cards in our marketplace.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/packs" className="nxg-btn text-lg px-10 py-5">
                Open Packs
              </Link>
              <Link href="/store" className="nxg-btn nxg-btn-secondary text-lg px-10 py-5">
                Browse Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--nxg-border)] bg-[var(--nxg-bg-primary)]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                <Image
                  src="/logo.jpg"
                  alt="neXGen"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-lg font-semibold text-white">neXGen Collectibles</span>
            </div>
            <p className="text-[var(--nxg-text-muted)] text-sm text-center md:text-right">
              Premium football trading cards. Not affiliated with EA Sports.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
