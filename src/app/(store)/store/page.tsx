'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TradingCard from '@/components/TradingCard';
import { Card, PARALLEL_LABELS, COLOR_LABELS, CONDITION_LABELS, COMMON_SETS, formatNumbered, getCardRarityInfo } from '@/lib/types';
import { useStore } from '@/store/useStore';
import Image from 'next/image';

const PARALLEL_TYPES = Object.keys(PARALLEL_LABELS);
const COLOR_VARIANTS = Object.keys(COLOR_LABELS);

function StoreContent() {
  const searchParams = useSearchParams();
  const { addToCart, items } = useStore();

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    parallelType: searchParams.get('parallelType') || '',
    colorVariant: searchParams.get('colorVariant') || '',
    team: searchParams.get('team') || '',
    setName: searchParams.get('setName') || '',
    year: searchParams.get('year') || '',
    minPrice: '',
    maxPrice: '',
    isNumbered: searchParams.get('isNumbered') || '',
    isRookie: searchParams.get('isRookie') || '',
    isAutograph: searchParams.get('isAutograph') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
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
      if (filters.parallelType) params.set('parallelType', filters.parallelType);
      if (filters.colorVariant) params.set('colorVariant', filters.colorVariant);
      if (filters.team) params.set('team', filters.team);
      if (filters.setName) params.set('setName', filters.setName);
      if (filters.year) params.set('year', filters.year);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.isNumbered === 'true') params.set('isNumbered', 'true');
      if (filters.isRookie === 'true') params.set('isRookie', 'true');
      if (filters.isAutograph === 'true') params.set('isAutograph', 'true');
      params.set('sortBy', filters.sortBy);
      params.set('sortOrder', filters.sortOrder);
      params.set('page', pagination.page.toString());
      params.set('limit', pagination.limit.toString());

      const res = await fetch(`/api/cards?${params}`);
      const data = await res.json();
      setCards(data.cards || []);
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
      parallelType: '',
      colorVariant: '',
      team: '',
      setName: '',
      year: '',
      minPrice: '',
      maxPrice: '',
      isNumbered: '',
      isRookie: '',
      isAutograph: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="bg-[var(--bg-secondary)] border-b border-[var(--border)]">
        <div className="container py-12">
          <div className="section-eyebrow">Browse</div>
          <h1 className="section-title">
            <span className="section-title-lime">Marketplace</span>
          </h1>
          <p className="text-[var(--text-secondary)] mt-3 text-lg">
            {pagination.total} cards available for purchase
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="sidebar sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-muted hover:text-lime transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-5">
                {/* Search */}
                <div className="filter-group">
                  <label className="label">Search</label>
                  <input
                    type="text"
                    placeholder="Player, team..."
                    className="input"
                    value={filters.search}
                    onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                  />
                </div>

                {/* Parallel Type */}
                <div className="filter-group">
                  <label className="label">Parallel Type</label>
                  <select
                    className="select"
                    value={filters.parallelType}
                    onChange={(e) => setFilters((f) => ({ ...f, parallelType: e.target.value }))}
                  >
                    <option value="">All Parallels</option>
                    {PARALLEL_TYPES.map((p) => (
                      <option key={p} value={p}>{PARALLEL_LABELS[p]}</option>
                    ))}
                  </select>
                </div>

                {/* Color Variant */}
                <div className="filter-group">
                  <label className="label">Color Variant</label>
                  <select
                    className="select"
                    value={filters.colorVariant}
                    onChange={(e) => setFilters((f) => ({ ...f, colorVariant: e.target.value }))}
                  >
                    <option value="">All Colors</option>
                    {COLOR_VARIANTS.map((c) => (
                      <option key={c} value={c}>{COLOR_LABELS[c]}</option>
                    ))}
                  </select>
                </div>

                {/* Set Name */}
                <div className="filter-group">
                  <label className="label">Set</label>
                  <select
                    className="select"
                    value={filters.setName}
                    onChange={(e) => setFilters((f) => ({ ...f, setName: e.target.value }))}
                  >
                    <option value="">All Sets</option>
                    {COMMON_SETS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div className="filter-group">
                  <label className="label">Year</label>
                  <select
                    className="select"
                    value={filters.year}
                    onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))}
                  >
                    <option value="">All Years</option>
                    {years.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div className="filter-group">
                  <label className="label">Price Range</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      placeholder="Min"
                      className="input"
                      value={filters.minPrice}
                      onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="input"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Special Filters */}
                <div className="filter-group">
                  <label className="label">Special</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={filters.isNumbered === 'true'}
                        onChange={(e) => setFilters((f) => ({ ...f, isNumbered: e.target.checked ? 'true' : '' }))}
                      />
                      <span className="text-sm text-[var(--text-secondary)]">Numbered Cards</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={filters.isRookie === 'true'}
                        onChange={(e) => setFilters((f) => ({ ...f, isRookie: e.target.checked ? 'true' : '' }))}
                      />
                      <span className="text-sm text-[var(--text-secondary)]">Rookie Cards</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={filters.isAutograph === 'true'}
                        onChange={(e) => setFilters((f) => ({ ...f, isAutograph: e.target.checked ? 'true' : '' }))}
                      />
                      <span className="text-sm text-[var(--text-secondary)]">Autographs</span>
                    </label>
                  </div>
                </div>

                {/* Sort */}
                <div className="filter-group">
                  <label className="label">Sort By</label>
                  <select
                    className="select"
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      setFilters((f) => ({ ...f, sortBy, sortOrder }));
                    }}
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="playerName-asc">Player: A to Z</option>
                    <option value="year-desc">Year: Newest</option>
                    <option value="year-asc">Year: Oldest</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="loader"></div>
              </div>
            ) : cards.length === 0 ? (
              <div className="empty-state card">
                <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="empty-state-title">No cards found</h3>
                <p className="empty-state-text">Try adjusting your filters</p>
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="cards-grid">
                  {cards.map((card) => (
                    <div key={card.id} className="relative group">
                      <TradingCard
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
                        className="absolute bottom-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity btn btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-[var(--text-secondary)] font-medium">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                      disabled={pagination.page >= pagination.totalPages}
                      className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
          <div className="modal max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="text-xl font-bold text-white">{selectedCard.playerName}</h2>
              <button
                onClick={() => setSelectedCard(null)}
                className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Card Images */}
                <div className="flex-shrink-0 flex flex-col gap-4 items-center">
                  <TradingCard card={selectedCard} size="lg" />
                </div>

                {/* Card Details */}
                <div className="flex-1">
                  <div className="mb-6">
                    <p className="text-[var(--text-secondary)] mb-2">
                      {selectedCard.year} {selectedCard.setName}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCard.parallelType !== 'BASE' && (
                        <span className="badge badge-refractor">
                          {PARALLEL_LABELS[selectedCard.parallelType] || selectedCard.parallelType}
                        </span>
                      )}
                      {selectedCard.colorVariant && (
                        <span className="badge badge-outline">
                          {COLOR_LABELS[selectedCard.colorVariant] || selectedCard.colorVariant}
                        </span>
                      )}
                      {selectedCard.isNumbered && selectedCard.printRun && (
                        <span className="badge badge-numbered">
                          {formatNumbered(selectedCard.serialNumber, selectedCard.printRun)}
                        </span>
                      )}
                      {selectedCard.isRookie && (
                        <span className="badge badge-rookie">RC</span>
                      )}
                      {selectedCard.isAutograph && (
                        <span className="badge badge-auto">AUTO</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-muted mb-1">Team</p>
                      <p className="font-semibold text-white">{selectedCard.team}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted mb-1">Sport</p>
                      <p className="font-semibold text-white">{selectedCard.sport}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted mb-1">Condition</p>
                      <p className="font-semibold text-white">
                        {CONDITION_LABELS[selectedCard.condition] || selectedCard.condition}
                      </p>
                    </div>
                    {selectedCard.cardNumber && (
                      <div>
                        <p className="text-sm text-muted mb-1">Card #</p>
                        <p className="font-semibold text-white">{selectedCard.cardNumber}</p>
                      </div>
                    )}
                  </div>

                  {selectedCard.conditionNotes && (
                    <div className="mb-6">
                      <p className="text-sm text-muted mb-1">Condition Notes</p>
                      <p className="text-[var(--text-secondary)]">{selectedCard.conditionNotes}</p>
                    </div>
                  )}

                  <div className="border-t border-[var(--border)] pt-6">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-muted">Price</span>
                      <span className="text-3xl font-bold text-lime">
                        ${selectedCard.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(selectedCard)}
                      disabled={isInCart(selectedCard.id)}
                      className="btn btn-primary w-full text-lg py-4 disabled:opacity-50"
                    >
                      {isInCart(selectedCard.id) ? 'Already in Cart' : 'Add to Cart'}
                    </button>
                  </div>
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
        <div className="loader"></div>
      </div>
    }>
      <StoreContent />
    </Suspense>
  );
}
