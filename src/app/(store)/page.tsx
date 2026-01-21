'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import TradingCard from '@/components/TradingCard';
import { Card, PARALLEL_LABELS, COMMON_PRINT_RUNS } from '@/lib/types';

export default function HomePage() {
  const [featuredCards, setFeaturedCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCards();
  }, []);

  const fetchFeaturedCards = async () => {
    try {
      const res = await fetch('/api/cards?status=AVAILABLE&sortBy=price&sortOrder=desc&limit=8');
      const data = await res.json();
      setFeaturedCards(data.cards || []);
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-glow"></div>

        <div className="hero-content">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
              {/* Badge */}
              <div className="section-eyebrow">
                <span className="w-2 h-2 rounded-full bg-[var(--lime)] animate-pulse"></span>
                Premium Trading Cards
              </div>

              {/* Main Heading */}
              <h1 className="hero-title">
                Collect the
                <br />
                <span className="text-lime">Rarest Cards</span>
              </h1>

              <p className="hero-subtitle">
                Discover premium Topps trading cards. From base cards to numbered parallels,
                find refractors, autographs, and the rarest 1/1 superfractors.
              </p>

              {/* CTA Buttons */}
              <div className="hero-actions">
                <Link href="/store" className="btn btn-primary btn-lg">
                  Browse Collection
                </Link>
                <Link href="/admin/add" className="btn btn-outline btn-lg">
                  Sell Your Cards
                </Link>
              </div>

              {/* Stats */}
              <div className="hero-stats">
                <div>
                  <div className="hero-stat-value">
                    {loading ? '...' : featuredCards.length > 0 ? '100+' : '0'}
                  </div>
                  <div className="hero-stat-label">Cards Listed</div>
                </div>
                <div>
                  <div className="hero-stat-value">7</div>
                  <div className="hero-stat-label">Parallel Types</div>
                </div>
                <div>
                  <div className="hero-stat-value">/1</div>
                  <div className="hero-stat-label">Superfractors</div>
                </div>
              </div>
            </div>

            {/* Featured Card Display */}
            <div className="relative hidden lg:flex justify-center items-center">
              {!loading && featuredCards.length > 0 && (
                <div className="relative">
                  {/* Glow effect behind cards */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[var(--lime-glow)] blur-[100px]"></div>

                  {/* Main featured card */}
                  <div className="relative z-20 animate-float">
                    <TradingCard card={featuredCards[0]} size="lg" showPrice />
                  </div>

                  {/* Background cards */}
                  {featuredCards[1] && (
                    <div className="absolute top-8 -left-20 opacity-60 -rotate-12 z-10 scale-90">
                      <TradingCard card={featuredCards[1]} size="md" />
                    </div>
                  )}
                  {featuredCards[2] && (
                    <div className="absolute top-4 -right-16 opacity-50 rotate-6 z-0 scale-75">
                      <TradingCard card={featuredCards[2]} size="md" />
                    </div>
                  )}
                </div>
              )}

              {loading && (
                <div className="loader"></div>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted">
          <span className="text-xs font-medium tracking-wider uppercase">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-[var(--border-strong)] flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-[var(--lime)] rounded-full animate-bounce"></div>
          </div>
        </div>
      </section>

      {/* Featured Cards Section */}
      {featuredCards.length > 0 && (
        <section className="section bg-[var(--bg-secondary)]">
          <div className="container">
            <div className="section-header flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="section-eyebrow">Featured</div>
                <h2 className="section-title">
                  Premium <span className="section-title-lime">Cards</span>
                </h2>
                <p className="section-subtitle">
                  The most valuable cards in our collection
                </p>
              </div>
              <Link href="/store?sortBy=price&sortOrder=desc" className="btn btn-outline">
                View All Cards
              </Link>
            </div>

            <div className="cards-grid">
              {featuredCards.slice(0, 8).map((card) => (
                <Link key={card.id} href={`/store?search=${encodeURIComponent(card.playerName)}`}>
                  <TradingCard card={card} size="sm" showPrice />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Parallels Section */}
      <section className="section bg-[var(--bg-primary)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[var(--purple)]/10 blur-[150px]"></div>

        <div className="container relative">
          <div className="section-header text-center">
            <div className="section-eyebrow mx-auto">Card Types</div>
            <h2 className="section-title">
              Parallel <span className="section-title-lime">Varieties</span>
            </h2>
            <p className="section-subtitle mx-auto">
              From base cards to rare superfractors, each parallel offers unique visual appeal and collectibility.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(PARALLEL_LABELS).map(([key, label]) => {
              const colors: Record<string, string> = {
                BASE: '#888888',
                REFRACTOR: '#00d4ff',
                PRISM_REFRACTOR: '#e040fb',
                XFRACTOR: '#ffd700',
                SPECKLE_REFRACTOR: '#c0c0c0',
                WAVE_REFRACTOR: '#00ff88',
                SUPERFRACTOR: '#ff0000',
              };
              const color = colors[key] || '#c8f038';

              return (
                <div
                  key={key}
                  className="card p-6 text-center group hover:border-[var(--lime)]"
                >
                  <div
                    className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${color}30, ${color}10)` }}
                  >
                    <div
                      className="w-6 h-6 rounded-md"
                      style={{ background: color }}
                    ></div>
                  </div>
                  <div
                    className="text-sm font-semibold mb-1"
                    style={{ color }}
                  >
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Numbered Cards Section */}
      <section className="section bg-[var(--bg-secondary)]">
        <div className="container">
          <div className="section-header text-center">
            <div className="section-eyebrow mx-auto">Rarity</div>
            <h2 className="section-title">
              Numbered <span className="section-title-lime">Cards</span>
            </h2>
            <p className="section-subtitle mx-auto">
              Limited print runs make these cards highly sought after. The lower the number, the rarer the card.
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {COMMON_PRINT_RUNS.slice(0, 6).map((run) => {
              const getRarityColor = (printRun: number) => {
                if (printRun === 1) return '#ff0000';
                if (printRun <= 5) return '#ff4444';
                if (printRun <= 10) return '#ff6600';
                if (printRun <= 25) return '#ffa500';
                if (printRun <= 50) return '#ffd700';
                return '#00ff00';
              };

              return (
                <div
                  key={run}
                  className="card-lime p-6 text-center"
                  style={{ borderColor: getRarityColor(run), boxShadow: `0 0 30px ${getRarityColor(run)}40` }}
                >
                  <div
                    className="text-3xl font-bold mb-2"
                    style={{ color: getRarityColor(run) }}
                  >
                    /{run}
                  </div>
                  <div className="text-muted text-sm">
                    {run === 1 ? 'One of One' : `Print Run`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-[var(--bg-primary)]">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">
              Why <span className="section-title-lime">neXGen</span>?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Authentic Cards',
                description: 'Every card is verified and photographed front and back. Buy with confidence.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'HD Images',
                description: 'High-resolution photos of both sides of every card. See exactly what you\'re buying.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Easy Selling',
                description: 'List your cards in minutes. Upload photos, set your price, and start selling.',
              },
            ].map((feature, i) => (
              <div key={i} className="card p-8 hover:border-[var(--lime)]">
                <div className="w-14 h-14 rounded-2xl bg-[var(--lime-muted)] flex items-center justify-center text-lime mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-[var(--bg-secondary)] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--lime-glow)] blur-[120px]"></div>
        </div>

        <div className="container relative">
          <div className="card-lime p-12 md:p-16 text-center">
            <h2 className="section-title mb-6">
              Ready to <span className="section-title-lime">Collect</span>?
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
              Browse our collection of premium Topps trading cards or list your own cards for sale.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/store" className="btn btn-primary btn-lg">
                Browse Marketplace
              </Link>
              <Link href="/admin/add" className="btn btn-outline btn-lg">
                List Your Cards
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--bg-primary)]">
        <div className="container py-12">
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
            <p className="text-muted text-sm text-center md:text-right">
              Premium Topps trading cards marketplace.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
