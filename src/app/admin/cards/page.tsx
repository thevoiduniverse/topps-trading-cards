'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import TradingCard from '@/components/TradingCard';
import { Card, PARALLEL_LABELS, COLOR_LABELS, formatNumbered } from '@/lib/types';
import { useStore } from '@/store/useStore';

const PARALLEL_TYPES = Object.keys(PARALLEL_LABELS);

export default function AdminCardsPage() {
  const searchParams = useSearchParams();
  const { showNotification } = useStore();

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    parallelType: '',
    status: 'AVAILABLE',
    team: '',
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.parallelType) params.set('parallelType', filters.parallelType);
      if (filters.status) params.set('status', filters.status);
      if (filters.team) params.set('team', filters.team);
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

  const handleDeleteCard = async (card: Card) => {
    if (!confirm(`Delete ${card.playerName}? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/cards/${card.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }
      showNotification('Card deleted successfully!', 'success');
      fetchCards();
    } catch (error) {
      showNotification(error instanceof Error ? error.message : 'Failed to delete card', 'error');
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="section-eyebrow">Admin</div>
          <h1 className="section-title">
            Card <span className="section-title-lime">Inventory</span>
          </h1>
          <p className="text-muted mt-1">
            {pagination.total} cards in database
          </p>
        </div>
        <Link href="/admin/add" className="btn btn-primary">
          Add Card
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search players..."
            className="input"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
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
          <select
            className="select"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
          </select>
          <input
            type="text"
            placeholder="Filter by team..."
            className="input"
            value={filters.team}
            onChange={(e) => setFilters((f) => ({ ...f, team: e.target.value }))}
          />
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="loader"></div>
        </div>
      ) : cards.length === 0 ? (
        <div className="empty-state card">
          <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="empty-state-title">No cards found</h3>
          <p className="empty-state-text">Add your first card to get started</p>
          <Link href="/admin/add" className="btn btn-primary">
            Add Card
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {cards.map((card) => (
              <div key={card.id} className="relative group">
                <TradingCard card={card} size="sm" showPrice />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-center gap-2 p-4">
                  <span className={`badge ${
                    card.status === 'AVAILABLE' ? 'bg-green-900/80 text-green-400' :
                    card.status === 'SOLD' ? 'bg-blue-900/80 text-blue-400' :
                    'bg-yellow-900/80 text-yellow-400'
                  }`}>
                    {card.status}
                  </span>
                  <div className="text-xs text-muted text-center">
                    {card.year} {card.setName}
                  </div>
                  {card.isNumbered && card.printRun && (
                    <span className="badge badge-numbered">
                      {formatNumbered(card.serialNumber, card.printRun)}
                    </span>
                  )}
                  {card.status === 'AVAILABLE' && (
                    <button
                      onClick={() => handleDeleteCard(card)}
                      className="mt-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page <= 1}
                className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-muted">
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
  );
}
