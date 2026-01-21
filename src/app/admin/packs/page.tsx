'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PackTemplate, RaritySlot, Rarity, RARITY_LABELS } from '@/lib/types';
import { useStore } from '@/store/useStore';

const RARITIES: Rarity[] = ['BRONZE', 'SILVER', 'GOLD', 'RARE_GOLD', 'INFORM', 'HERO', 'ICON'];

const DEFAULT_PACK = {
  name: '',
  description: '',
  price: 5,
  imageUrl: '',
  totalCards: 6,
  rarityDistribution: [
    { rarity: 'GOLD' as Rarity, count: 3, guaranteedMin: 1 },
    { rarity: 'SILVER' as Rarity, count: 2, guaranteedMin: 1 },
    { rarity: 'BRONZE' as Rarity, count: 1, guaranteedMin: 1 },
  ],
};

export default function AdminPacksPage() {
  const searchParams = useSearchParams();
  const action = searchParams.get('action');
  const { showNotification } = useStore();

  const [packs, setPacks] = useState<PackTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(action === 'create');
  const [selectedPack, setSelectedPack] = useState<PackTemplate | null>(null);
  const [formData, setFormData] = useState(DEFAULT_PACK);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/packs');
      const data = await res.json();
      setPacks(data);
    } catch (error) {
      console.error('Failed to fetch packs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePack = () => {
    setSelectedPack(null);
    setFormData(DEFAULT_PACK);
    setShowModal(true);
  };

  const handleEditPack = (pack: PackTemplate) => {
    setSelectedPack(pack);
    setFormData({
      name: pack.name,
      description: pack.description || '',
      price: pack.price,
      imageUrl: pack.imageUrl || '',
      totalCards: pack.totalCards,
      rarityDistribution: pack.rarityDistribution,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Validate total cards
    const slotTotal = formData.rarityDistribution.reduce((sum, slot) => sum + slot.count, 0);
    if (slotTotal !== formData.totalCards) {
      showNotification(`Slot counts (${slotTotal}) must equal total cards (${formData.totalCards})`, 'error');
      setSaving(false);
      return;
    }

    try {
      const url = selectedPack ? `/api/packs/${selectedPack.id}` : '/api/packs';
      const method = selectedPack ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          isActive: true,
        }),
      });

      if (!res.ok) throw new Error('Failed to save pack');

      showNotification(
        selectedPack ? 'Pack updated successfully!' : 'Pack created successfully!',
        'success'
      );

      setShowModal(false);
      fetchPacks();
    } catch (error) {
      console.error('Error saving:', error);
      showNotification('Failed to save pack', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePack = async (pack: PackTemplate) => {
    if (!confirm(`Delete ${pack.name}? This will deactivate the pack if it has purchases.`)) return;

    try {
      const res = await fetch(`/api/packs/${pack.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete pack');

      const data = await res.json();
      showNotification(
        data.deactivated ? 'Pack deactivated (has purchase history)' : 'Pack deleted successfully!',
        'success'
      );
      fetchPacks();
    } catch (error) {
      showNotification('Failed to delete pack', 'error');
    }
  };

  const handleToggleActive = async (pack: PackTemplate) => {
    try {
      const res = await fetch(`/api/packs/${pack.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pack,
          isActive: !pack.isActive,
        }),
      });

      if (!res.ok) throw new Error('Failed to update pack');
      fetchPacks();
    } catch (error) {
      showNotification('Failed to update pack status', 'error');
    }
  };

  const updateRaritySlot = (index: number, field: keyof RaritySlot, value: string | number) => {
    const newSlots = [...formData.rarityDistribution];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setFormData({ ...formData, rarityDistribution: newSlots });
  };

  const addRaritySlot = () => {
    const usedRarities = formData.rarityDistribution.map((s) => s.rarity);
    const availableRarity = RARITIES.find((r) => !usedRarities.includes(r)) || 'GOLD';
    setFormData({
      ...formData,
      rarityDistribution: [
        ...formData.rarityDistribution,
        { rarity: availableRarity, count: 1, guaranteedMin: 1 },
      ],
    });
  };

  const removeRaritySlot = (index: number) => {
    setFormData({
      ...formData,
      rarityDistribution: formData.rarityDistribution.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[var(--fut-gold)]" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '2px' }}>
            PACK TEMPLATES
          </h1>
          <p className="text-[var(--fut-text-secondary)] mt-1">
            Configure pack types and their rarity distributions
          </p>
        </div>
        <button onClick={handleCreatePack} className="fut-btn">
          Create Pack
        </button>
      </div>

      {/* Packs Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--fut-gold)] border-t-transparent" />
        </div>
      ) : packs.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-20 h-20 mx-auto text-[var(--fut-text-muted)] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-xl font-bold mb-2">No packs configured</h3>
          <p className="text-[var(--fut-text-secondary)] mb-4">Create your first pack template</p>
          <button onClick={handleCreatePack} className="fut-btn">
            Create Pack
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className={`fut-card p-6 relative ${!pack.isActive ? 'opacity-60' : ''}`}
            >
              {!pack.isActive && (
                <div className="absolute top-4 right-4">
                  <span className="bg-red-900/50 text-red-400 text-xs px-2 py-1 rounded">Inactive</span>
                </div>
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center pack-glow">
                  <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{pack.name}</h3>
                  <p className="text-[var(--fut-text-secondary)] text-sm">{pack.description}</p>
                  <p className="text-2xl font-bold text-[var(--fut-gold)] mt-2">${pack.price}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-[var(--fut-text-muted)]">
                  {pack.totalCards} cards per pack
                </p>
                <div className="flex flex-wrap gap-2">
                  {pack.rarityDistribution.map((slot, i) => (
                    <span
                      key={i}
                      className={`fut-badge fut-badge-${slot.rarity.toLowerCase().replace('_', '-')}`}
                    >
                      {slot.count}x {RARITY_LABELS[slot.rarity as Rarity]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--fut-border)]">
                <button
                  onClick={() => handleEditPack(pack)}
                  className="flex-1 text-sm bg-[var(--fut-bg-card-hover)] hover:bg-[var(--fut-bg-panel)] px-3 py-2 rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(pack)}
                  className="flex-1 text-sm bg-[var(--fut-bg-card-hover)] hover:bg-[var(--fut-bg-panel)] px-3 py-2 rounded transition-colors"
                >
                  {pack.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDeletePack(pack)}
                  className="text-sm text-red-400 hover:text-red-300 px-3 py-2 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fut-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="fut-modal max-w-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold text-[var(--fut-gold)] mb-6" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '1px' }}>
              {selectedPack ? 'EDIT PACK' : 'CREATE PACK'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--fut-text-secondary)] mb-1">Pack Name</label>
                  <input
                    type="text"
                    className="fut-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Gold Pack"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--fut-text-secondary)] mb-1">Description</label>
                  <textarea
                    className="fut-input"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Pack description..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[var(--fut-text-secondary)] mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="fut-input"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--fut-text-secondary)] mb-1">Total Cards</label>
                    <input
                      type="number"
                      min="1"
                      className="fut-input"
                      value={formData.totalCards}
                      onChange={(e) => setFormData({ ...formData, totalCards: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                {/* Rarity Distribution */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-[var(--fut-text-secondary)]">Rarity Distribution</label>
                    <button
                      type="button"
                      onClick={addRaritySlot}
                      className="text-sm text-[var(--fut-gold)] hover:underline"
                    >
                      + Add Slot
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.rarityDistribution.map((slot, index) => (
                      <div key={index} className="flex items-center gap-3 bg-[var(--fut-bg-card)] p-3 rounded-lg">
                        <select
                          className="fut-select flex-1"
                          value={slot.rarity}
                          onChange={(e) => updateRaritySlot(index, 'rarity', e.target.value)}
                        >
                          {RARITIES.map((r) => (
                            <option key={r} value={r}>{RARITY_LABELS[r]}</option>
                          ))}
                        </select>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--fut-text-muted)]">Count:</span>
                          <input
                            type="number"
                            min="0"
                            className="fut-input w-16 text-center py-1"
                            value={slot.count}
                            onChange={(e) => updateRaritySlot(index, 'count', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--fut-text-muted)]">Min:</span>
                          <input
                            type="number"
                            min="0"
                            max={slot.count}
                            className="fut-input w-16 text-center py-1"
                            value={slot.guaranteedMin}
                            onChange={(e) => updateRaritySlot(index, 'guaranteedMin', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        {formData.rarityDistribution.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRaritySlot(index)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-[var(--fut-text-muted)] mt-2">
                    Total slots: {formData.rarityDistribution.reduce((s, slot) => s + slot.count, 0)} / {formData.totalCards} cards
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="fut-btn fut-btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="fut-btn disabled:opacity-50">
                  {saving ? 'Saving...' : selectedPack ? 'Update Pack' : 'Create Pack'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
