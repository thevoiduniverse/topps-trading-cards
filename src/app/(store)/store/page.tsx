'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PlayerCard from '@/components/PlayerCard';
import { Card, Rarity, POSITIONS, RARITY_LABELS } from '@/lib/types';
import { useStore } from '@/store/useStore';

const RARITIES: Rarity[] = ['BRONZE', 'SILVER', 'GOLD', 'RARE_GOLD', 'INFORM', 'HERO', 'ICON'];

function StoreContent() {
  const searchParams = useSearchParams();
  const { addToCart, items } = useStore();

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    rarity: searchParams.get('rarity') || '',
    position: searchParams.get('position') || '',
    team: searchParams.get('team') || '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    maxRating: '',
    sortBy: searchParams.get('sortBy') || 'overall',
    sortOrder: searchParams.get('sortOrder') || 'desc',
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 24,
    total: 0,
    totalPages: 0,
  });

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('status', 'AVAILABLE');
      if (filters.search) params.set('search', filters.search);
      if (filters.rarity) params.set('rarity', filters.rarity);
      if (filters.position) params.set('position', filters.position);
      if (filters.team) params.set('team', filters.team);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.minRating) params.set('minRating', filters.minRating);
      if (filters.maxRating) params.set('maxRating', filters.maxRating);
      params.set('sortBy', filters.sortBy);
      params.set('sortOrder', filters.sortOrder);
      params.set('page', pagination.page.toString());
      params.set('limit', pagination.limit.toString());

      const res = await fetch(`/api/cards?${params}`);
      const data = await res.json();
      setCards(data.cards);
      setPagination((prev) => ({ ...prev, ...data.pagination }));
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const handleAddToCart = async (card: Card) => {
    const success = await addToCart(card.id);
    if (success) {
      fetchCards();
      setSelectedCard(null);
    }
  };

  const isInCart = (cardId: string) => items.some((item) => item.card.id === cardId);

  const clearFilters = () => {
    setFilters({
      search: '',
      rarity: '',
      position: '',
      team: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      maxRating: '',
      sortBy: 'overall',
      sortOrder: 'desc',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-[var(--nxg-bg-primary)]">
      {/* Header */}
      <div className="bg-[var(--nxg-bg-secondary)] border-b border-[var(--nxg-border)]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <span className="nxg-badge nxg-badge-lime mb-4 inline-block">Browse</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Marketplace
          </h1>
          <p className="text-[var(--nxg-text-secondary)] mt-3 text-lg">
            {pagination.total} cards available for purchase
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="glass-card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[var(--nxg-text-muted)] hover:text-[var(--nxg-lime)] transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-5">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-[var(--nxg-text-secondary)] mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Player, team..."
                    className="nxg-input"
                    value={filters.search}
                    onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                  />
                </div>

                {/* Rarity */}
                <div>
                  <label className="block text-sm font-medium text-[var(--nxg-text-secondary)] mb-2">Rarity</label>
                  <select
                    className="nxg-select w-full"
                    value={filters.rarity}
                    onChange={(e) => setFilters((f) => ({ ...f, rarity: e.target.value }))}
                  >
                    <option value="">All Rarities</option>
                    {RARITIES.map((r) => (
                      <option key={r} value={r}>{RARITY_LABELS[r]}</option>
                    ))}
                  </select>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-[var(--nxg-text-secondary)] mb-2">Position</label>
                  <select
                    className="nxg-select w-full"
                    value={filters.position}
                    onChange={(e) => setFilters((f) => ({ ...f, position: e.target.value }))}
                  >
                    <option value="">All Positions</option>
                    {POSITIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-[var(--nxg-text-secondary)] mb-2">Price Range</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      className="nxg-input"
                      value={filters.minPrice}
                      onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="nxg-input"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Rating Range */}
                <div>
                  <label className="block text-sm font-medium text-[var(--nxg-text-secondary)] mb-2">Rating</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      min="1"
                      max="99"
                      className="nxg-input"
                      value={filters.minRating}
                      onChange={(e) => setFilters((f) => ({ ...f, minRating: e.target.value }))}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      min="1"
                      max="99"
                      className="nxg-input"
                      value={filters.maxRating}
                      onChange={(e) => setFilters((f) => ({ ...f, maxRating: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-[var(--nxg-text-secondary)] mb-2">Sort By</label>
                  <select
                    className="nxg-select w-full"
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      setFilters((f) => ({ ...f, sortBy, sortOrder }));
                    }}
                  >
                    <option value="overall-desc">Rating: High to Low</option>
                    <option value="overall-asc">Rating: Low to High</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="playerName-asc">Name: A to Z</option>
                    <option value="createdAt-desc">Newest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="w-12 h-12 rounded-full border-3 border-[var(--nxg-lime)] border-t-transparent animate-spin" />
              </div>
            ) : cards.length === 0 ? (
              <div className="text-center py-20 glass-card">
                <svg className="w-20 h-20 mx-auto text-[var(--nxg-text-muted)] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-2xl font-semibold text-white mb-2">No cards found</h3>
                <p className="text-[var(--nxg-text-secondary)] mb-6">Try adjusting your filters</p>
                <button onClick={clearFilters} className="nxg-btn">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
                  {cards.map((card) => (
                    <div key={card.id} className="relative group">
                      <PlayerCard
                        card={card}
                        size="sm"
                        showPrice
                        onClick={() => setSelectedCard(card)}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(card);
                        }}
                        disabled={isInCart(card.id)}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity nxg-btn py-2.5 px-5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isInCart(card.id) ? 'In Cart' : 'Add to Cart'}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-12">
                    <button
                      onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                      disabled={pagination.page <= 1}
                      className="nxg-btn nxg-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-[var(--nxg-text-secondary)] font-medium">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                      disabled={pagination.page >= pagination.totalPages}
                      className="nxg-btn nxg-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div className="nxg-modal-overlay" onClick={() => setSelectedCard(null)}>
          <div className="nxg-modal max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Card Preview */}
              <div className="flex-shrink-0 flex justify-center">
                <PlayerCard card={selectedCard} size="lg" showStats />
              </div>

              {/* Card Details */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">{selectedCard.playerName}</h2>
                <p className="text-[var(--nxg-text-secondary)] mb-6">
                  {selectedCard.team} • {selectedCard.nation}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-[var(--nxg-text-muted)] mb-1">Position</p>
                    <p className="font-semibold text-white">{selectedCard.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--nxg-text-muted)] mb-1">Collection</p>
                    <p className="font-semibold text-white">{selectedCard.collection}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--nxg-text-muted)] mb-1">Rarity</p>
                    <span className={`nxg-badge nxg-badge-${selectedCard.rarity.toLowerCase().replace('_', '-')}`}>
                      {RARITY_LABELS[selectedCard.rarity as Rarity]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-[var(--nxg-text-muted)] mb-1">Rating</p>
                    <p className="text-2xl font-bold text-[var(--nxg-lime)]">{selectedCard.overall}</p>
                  </div>
                </div>

                <div className="border-t border-[var(--nxg-border)] pt-6">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[var(--nxg-text-muted)]">Price</span>
                    <span className="text-3xl font-bold text-[var(--nxg-lime)]">
                      ${selectedCard.price.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(selectedCard)}
                    disabled={isInCart(selectedCard.id)}
                    className="nxg-btn w-full text-lg py-4 disabled:opacity-50"
                  >
                    {isInCart(selectedCard.id) ? 'Already in Cart' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full border-3 border-[var(--nxg-lime)] border-t-transparent animate-spin" />
      </div>
    }>
      <StoreContent />
    </Suspense>
  );
}
