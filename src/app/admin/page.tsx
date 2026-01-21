'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  total: number;
  available: number;
  sold: number;
  packed: number;
  byRarity: Record<string, number>;
  teams: { team: string; count: number }[];
  collections: { collection: string; count: number }[];
}

const RARITY_ORDER = ['BRONZE', 'SILVER', 'GOLD', 'RARE_GOLD', 'INFORM', 'HERO', 'ICON'];
const RARITY_COLORS: Record<string, string> = {
  BRONZE: '#cd7f32',
  SILVER: '#c0c0c0',
  GOLD: '#ffd700',
  RARE_GOLD: '#ffd700',
  INFORM: '#ff6b00',
  HERO: '#00ced1',
  ICON: '#ffd700',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/cards/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[var(--fut-gold)]" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '2px' }}>
            ADMIN DASHBOARD
          </h1>
          <p className="text-[var(--fut-text-secondary)] mt-1">
            Manage your trading card inventory
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/cards" className="fut-btn">
            Manage Cards
          </Link>
          <Link href="/admin/packs" className="fut-btn fut-btn-secondary">
            Manage Packs
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Cards"
          value={stats?.total || 0}
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
        <StatCard
          label="Available"
          value={stats?.available || 0}
          color="text-green-400"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          }
        />
        <StatCard
          label="Sold"
          value={stats?.sold || 0}
          color="text-blue-400"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="In Packs"
          value={stats?.packed || 0}
          color="text-purple-400"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
      </div>

      {/* Rarity Distribution */}
      <div className="fut-card p-6 mb-8">
        <h2 className="text-xl font-bold mb-6 text-[var(--fut-gold)]" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '1px' }}>
          AVAILABLE BY RARITY
        </h2>
        <div className="grid grid-cols-7 gap-4">
          {RARITY_ORDER.map((rarity) => {
            const count = stats?.byRarity[rarity] || 0;
            const maxCount = Math.max(...Object.values(stats?.byRarity || { x: 1 }));
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

            return (
              <div key={rarity} className="text-center">
                <div className="h-32 flex flex-col justify-end mb-2">
                  <div
                    className="w-full rounded-t-md transition-all duration-500"
                    style={{
                      height: `${Math.max(percentage, 5)}%`,
                      backgroundColor: RARITY_COLORS[rarity],
                      opacity: count > 0 ? 1 : 0.3,
                    }}
                  />
                </div>
                <div className="text-2xl font-bold" style={{ color: RARITY_COLORS[rarity] }}>
                  {count}
                </div>
                <div className="text-xs text-[var(--fut-text-secondary)] uppercase mt-1">
                  {rarity.replace('_', ' ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Collections and Teams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collections */}
        <div className="fut-card p-6">
          <h2 className="text-xl font-bold mb-4 text-[var(--fut-gold)]" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '1px' }}>
            COLLECTIONS
          </h2>
          {stats?.collections && stats.collections.length > 0 ? (
            <div className="space-y-3">
              {stats.collections.map((col) => (
                <div key={col.collection} className="flex items-center justify-between">
                  <span className="text-[var(--fut-text-secondary)]">{col.collection}</span>
                  <span className="text-[var(--fut-gold)] font-bold">{col.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--fut-text-muted)]">No collections yet</p>
          )}
        </div>

        {/* Top Teams */}
        <div className="fut-card p-6">
          <h2 className="text-xl font-bold mb-4 text-[var(--fut-gold)]" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '1px' }}>
            TOP TEAMS
          </h2>
          {stats?.teams && stats.teams.length > 0 ? (
            <div className="space-y-3">
              {stats.teams.slice(0, 10).map((team) => (
                <div key={team.team} className="flex items-center justify-between">
                  <span className="text-[var(--fut-text-secondary)]">{team.team}</span>
                  <span className="text-[var(--fut-gold)] font-bold">{team.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[var(--fut-text-muted)]">No teams yet</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/cards?action=create"
          className="fut-card p-6 flex items-center gap-4 hover:border-[var(--fut-gold)] transition-colors group"
        >
          <div className="w-12 h-12 rounded-lg bg-green-900/50 flex items-center justify-center group-hover:bg-green-800/50 transition-colors">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold">Add New Card</h3>
            <p className="text-sm text-[var(--fut-text-secondary)]">Create a single card</p>
          </div>
        </Link>

        <Link
          href="/admin/cards?action=bulk"
          className="fut-card p-6 flex items-center gap-4 hover:border-[var(--fut-gold)] transition-colors group"
        >
          <div className="w-12 h-12 rounded-lg bg-blue-900/50 flex items-center justify-center group-hover:bg-blue-800/50 transition-colors">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold">Bulk Import</h3>
            <p className="text-sm text-[var(--fut-text-secondary)]">Upload multiple cards</p>
          </div>
        </Link>

        <Link
          href="/admin/packs?action=create"
          className="fut-card p-6 flex items-center gap-4 hover:border-[var(--fut-gold)] transition-colors group"
        >
          <div className="w-12 h-12 rounded-lg bg-purple-900/50 flex items-center justify-center group-hover:bg-purple-800/50 transition-colors">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold">Create Pack</h3>
            <p className="text-sm text-[var(--fut-text-secondary)]">Define a new pack type</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = 'text-[var(--fut-gold)]',
  icon,
}: {
  label: string;
  value: number;
  color?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="fut-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--fut-text-secondary)] uppercase tracking-wide">{label}</p>
          <p className={`text-4xl font-bold mt-2 ${color}`} style={{ fontFamily: 'var(--font-bebas)' }}>
            {value.toLocaleString()}
          </p>
        </div>
        <div className="text-[var(--fut-text-muted)]">{icon}</div>
      </div>
    </div>
  );
}
