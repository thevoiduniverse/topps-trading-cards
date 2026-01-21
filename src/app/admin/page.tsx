'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  total: number;
  available: number;
  sold: number;
  reserved: number;
  byParallel: Record<string, number>;
  bySport: { sport: string; count: number }[];
  byYear: { year: number; count: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/cards/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="section-eyebrow">Admin</div>
          <h1 className="section-title">
            <span className="section-title-lime">Dashboard</span>
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Manage your trading card inventory
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/cards" className="btn btn-outline">
            Manage Cards
          </Link>
          <Link href="/admin/add" className="btn btn-primary">
            Add Card
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
          label="Reserved"
          value={stats?.reserved || 0}
          color="text-yellow-400"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/admin/add"
          className="card p-6 flex items-center gap-4 hover:border-[var(--lime)] transition-colors group"
        >
          <div className="w-12 h-12 rounded-lg bg-[var(--lime-muted)] flex items-center justify-center group-hover:bg-[var(--lime)] transition-colors">
            <svg className="w-6 h-6 text-lime group-hover:text-[var(--text-on-lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-white">Add New Card</h3>
            <p className="text-sm text-muted">Upload a card with images</p>
          </div>
        </Link>

        <Link
          href="/admin/cards"
          className="card p-6 flex items-center gap-4 hover:border-[var(--lime)] transition-colors group"
        >
          <div className="w-12 h-12 rounded-lg bg-blue-900/50 flex items-center justify-center group-hover:bg-blue-800/50 transition-colors">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-white">Manage Cards</h3>
            <p className="text-sm text-muted">Edit or delete existing cards</p>
          </div>
        </Link>

        <Link
          href="/store"
          className="card p-6 flex items-center gap-4 hover:border-[var(--lime)] transition-colors group"
        >
          <div className="w-12 h-12 rounded-lg bg-purple-900/50 flex items-center justify-center group-hover:bg-purple-800/50 transition-colors">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-white">View Store</h3>
            <p className="text-sm text-muted">See public marketplace</p>
          </div>
        </Link>
      </div>

      {/* Empty State */}
      {(!stats || stats.total === 0) && (
        <div className="card p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--lime-muted)] flex items-center justify-center">
            <svg className="w-10 h-10 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No Cards Yet</h3>
          <p className="text-muted mb-6 max-w-md mx-auto">
            Start building your collection by adding your first trading card with front and back images.
          </p>
          <Link href="/admin/add" className="btn btn-primary btn-lg">
            Add Your First Card
          </Link>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  color = 'text-lime',
  icon,
}: {
  label: string;
  value: number;
  color?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted uppercase tracking-wide">{label}</p>
          <p className={`text-4xl font-bold mt-2 ${color}`}>
            {value.toLocaleString()}
          </p>
        </div>
        <div className="text-muted">{icon}</div>
      </div>
    </div>
  );
}
