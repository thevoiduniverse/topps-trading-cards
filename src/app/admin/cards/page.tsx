'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import PlayerCard from '@/components/PlayerCard';
import { Card, CardFormData, Rarity, Position, POSITIONS, RARITY_LABELS } from '@/lib/types';
import { useStore } from '@/store/useStore';

const RARITIES: Rarity[] = ['BRONZE', 'SILVER', 'GOLD', 'RARE_GOLD', 'INFORM', 'HERO', 'ICON'];

const DEFAULT_CARD: CardFormData = {
  playerName: '',
  position: 'ST',
  team: '',
  nation: '',
  overall: 75,
  pace: 70,
  shooting: 70,
  passing: 70,
  dribbling: 70,
  defending: 50,
  physical: 70,
  rarity: 'GOLD',
  collection: 'Base 2024',
  price: 10,
};

export default function AdminCardsPage() {
  const searchParams = useSearchParams();
  const action = searchParams.get('action');
  const { showNotification } = useStore();

  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(action === 'create' || action === 'bulk');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'bulk'>(action === 'bulk' ? 'bulk' : 'create');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [formData, setFormData] = useState<CardFormData>(DEFAULT_CARD);
  const [bulkJson, setBulkJson] = useState('');
  const [saving, setSaving] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    rarity: '',
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
      if (filters.rarity) params.set('rarity', filters.rarity);
      if (filters.status) params.set('status', filters.status);
      if (filters.team) params.set('team', filters.team);
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

  const handleCreateCard = () => {
    setSelectedCard(null);
    setFormData(DEFAULT_CARD);
    setModalMode('create');
    setShowModal(true);
  };

  const handleEditCard = (card: Card) => {
    setSelectedCard(card);
    setFormData({
      playerName: card.playerName,
      position: card.position as Position,
      team: card.team,
      nation: card.nation,
      overall: card.overall,
      pace: card.pace,
      shooting: card.shooting,
      passing: card.passing,
      dribbling: card.dribbling,
      defending: card.defending,
      physical: card.physical,
      rarity: card.rarity as Rarity,
      collection: card.collection,
      imageUrl: card.imageUrl || '',
      price: card.price,
    });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleBulkImport = () => {
    setModalMode('bulk');
    setBulkJson('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (modalMode === 'bulk') {
        const cards = JSON.parse(bulkJson);
        const res = await fetch('/api/cards/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cards }),
        });

        if (!res.ok) throw new Error('Failed to import cards');

        const data = await res.json();
        showNotification(`Successfully imported ${data.created} cards!`, 'success');
      } else {
        const url = selectedCard ? `/api/cards/${selectedCard.id}` : '/api/cards';
        const method = selectedCard ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error('Failed to save card');

        showNotification(
          selectedCard ? 'Card updated successfully!' : 'Card created successfully!',
          'success'
        );
      }

      setShowModal(false);
      fetchCards();
    } catch (error) {
      console.error('Error saving:', error);
      showNotification('Failed to save. Please check your input.', 'error');
    } finally {
      setSaving(false);
    }
  };

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

  const updateFormData = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[var(--fut-gold)]" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '2px' }}>
            CARD INVENTORY
          </h1>
          <p className="text-[var(--fut-text-secondary)] mt-1">
            {pagination.total} cards in database
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleBulkImport} className="fut-btn fut-btn-secondary">
            Bulk Import
          </button>
          <button onClick={handleCreateCard} className="fut-btn">
            Add Card
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="fut-card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search players..."
            className="fut-input"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
          />
          <select
            className="fut-select"
            value={filters.rarity}
            onChange={(e) => setFilters((f) => ({ ...f, rarity: e.target.value }))}
          >
            <option value="">All Rarities</option>
            {RARITIES.map((r) => (
              <option key={r} value={r}>{RARITY_LABELS[r]}</option>
            ))}
          </select>
          <select
            className="fut-select"
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
            <option value="PACKED">Packed</option>
          </select>
          <input
            type="text"
            placeholder="Filter by team..."
            className="fut-input"
            value={filters.team}
            onChange={(e) => setFilters((f) => ({ ...f, team: e.target.value }))}
          />
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--fut-gold)] border-t-transparent" />
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-20 h-20 mx-auto text-[var(--fut-text-muted)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-xl font-bold mb-2">No cards found</h3>
          <p className="text-[var(--fut-text-secondary)] mb-4">Add your first card to get started</p>
          <button onClick={handleCreateCard} className="fut-btn">
            Add Card
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {cards.map((card) => (
              <div key={card.id} className="relative group">
                <PlayerCard card={card} size="sm" showPrice />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center gap-2 p-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    card.status === 'AVAILABLE' ? 'bg-green-900/50 text-green-400' :
                    card.status === 'SOLD' ? 'bg-blue-900/50 text-blue-400' :
                    card.status === 'PACKED' ? 'bg-purple-900/50 text-purple-400' :
                    'bg-yellow-900/50 text-yellow-400'
                  }`}>
                    {card.status}
                  </span>
                  <button
                    onClick={() => handleEditCard(card)}
                    className="text-sm bg-[var(--fut-gold)] text-black px-4 py-1 rounded font-semibold hover:bg-yellow-400 transition-colors"
                  >
                    Edit
                  </button>
                  {card.status === 'AVAILABLE' && (
                    <button
                      onClick={() => handleDeleteCard(card)}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              disabled={pagination.page <= 1}
              className="fut-btn fut-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-[var(--fut-text-secondary)]">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              disabled={pagination.page >= pagination.totalPages}
              className="fut-btn fut-btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fut-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="fut-modal max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-[var(--fut-gold)] mb-6" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '1px' }}>
              {modalMode === 'bulk' ? 'BULK IMPORT CARDS' : modalMode === 'edit' ? 'EDIT CARD' : 'ADD NEW CARD'}
            </h2>

            {modalMode === 'bulk' ? (
              <form onSubmit={handleSubmit}>
                <p className="text-[var(--fut-text-secondary)] mb-4">
                  Paste a JSON array of cards. Each card should have: playerName, position, team, nation, overall, pace, shooting, passing, dribbling, defending, physical, rarity, collection, price
                </p>
                <textarea
                  className="fut-input h-64 font-mono text-sm"
                  value={bulkJson}
                  onChange={(e) => setBulkJson(e.target.value)}
                  placeholder='[{"playerName": "Messi", "position": "RW", "team": "Inter Miami", ...}]'
                />
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="fut-btn fut-btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="fut-btn disabled:opacity-50">
                    {saving ? 'Importing...' : 'Import Cards'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-[var(--fut-text-secondary)] mb-1">Player Name</label>
                    <input
                      type="text"
                      className="fut-input"
                      value={formData.playerName}
                      onChange={(e) => updateFormData('playerName', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[var(--fut-text-secondary)] mb-1">Position</label>
                    <select
                      className="fut-select w-full"
                      value={formData.position}
                      onChange={(e) => updateFormData('position', e.target.value)}
                    >
                      {POSITIONS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-[var(--fut-text-secondary)] mb-1">Rarity</label>
                    <select
                      className="fut-select w-full"
                      value={formData.rarity}
                      onChange={(e) => updateFormData('rarity', e.target.value)}
                    >
                      {RARITIES.map((r) => (
                        <option key={r} value={r}>{RARITY_LABELS[r]}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-[var(--fut-text-secondary)] mb-1">Team</label>
                    <input
                      type="text"
                      className="fut-input"
                      value={formData.team}
                      onChange={(e) => updateFormData('team', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[var(--fut-text-secondary)] mb-1">Nation</label>
                    <input
                      type="text"
                      className="fut-input"
                      value={formData.nation}
                      onChange={(e) => updateFormData('nation', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[var(--fut-text-secondary)] mb-1">Collection</label>
                    <input
                      type="text"
                      className="fut-input"
                      value={formData.collection}
                      onChange={(e) => updateFormData('collection', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[var(--fut-text-secondary)] mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="fut-input"
                      value={formData.price}
                      onChange={(e) => updateFormData('price', parseFloat(e.target.value))}
                      required
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm text-[var(--fut-text-secondary)] mb-1">Image URL (optional)</label>
                    <input
                      type="url"
                      className="fut-input"
                      value={formData.imageUrl || ''}
                      onChange={(e) => updateFormData('imageUrl', e.target.value)}
                    />
                  </div>

                  {/* Stats */}
                  <div className="col-span-2">
                    <label className="block text-sm text-[var(--fut-text-secondary)] mb-3">Stats</label>
                    <div className="grid grid-cols-7 gap-3">
                      {[
                        { key: 'overall', label: 'OVR' },
                        { key: 'pace', label: 'PAC' },
                        { key: 'shooting', label: 'SHO' },
                        { key: 'passing', label: 'PAS' },
                        { key: 'dribbling', label: 'DRI' },
                        { key: 'defending', label: 'DEF' },
                        { key: 'physical', label: 'PHY' },
                      ].map((stat) => (
                        <div key={stat.key}>
                          <label className="block text-xs text-center text-[var(--fut-text-muted)] mb-1">{stat.label}</label>
                          <input
                            type="number"
                            min="1"
                            max="99"
                            className="fut-input text-center py-2"
                            value={formData[stat.key as keyof CardFormData] as number}
                            onChange={(e) => updateFormData(stat.key, parseInt(e.target.value) || 1)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="fut-btn fut-btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="fut-btn disabled:opacity-50">
                    {saving ? 'Saving...' : selectedCard ? 'Update Card' : 'Create Card'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
