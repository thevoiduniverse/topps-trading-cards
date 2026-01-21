'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { useEffect } from 'react';

interface NavigationProps {
  isAdmin?: boolean;
}

export default function Navigation({ isAdmin = false }: NavigationProps) {
  const pathname = usePathname();
  const { items, fetchCart, toggleCart } = useStore();

  useEffect(() => {
    if (!isAdmin) {
      fetchCart();
    }
  }, [isAdmin, fetchCart]);

  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/store', label: 'Store' },
    { href: '/packs', label: 'Open Packs' },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/cards', label: 'Cards' },
    { href: '/admin/packs', label: 'Packs' },
  ];

  const links = isAdmin ? adminLinks : publicLinks;

  return (
    <nav className="fut-nav">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Link href={isAdmin ? '/admin' : '/'} className="flex items-center gap-3 mr-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
              <span className="text-black font-black text-lg" style={{ fontFamily: 'var(--font-bebas)' }}>T</span>
            </div>
            <span className="text-xl font-bold tracking-wider" style={{ fontFamily: 'var(--font-bebas)', letterSpacing: '2px' }}>
              {isAdmin ? 'ADMIN' : 'TOPPS'}
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`fut-nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {isAdmin ? (
            <Link href="/" className="fut-btn-secondary fut-btn text-sm py-2 px-4">
              View Store
            </Link>
          ) : (
            <>
              <Link href="/admin" className="fut-nav-link">
                Admin
              </Link>
              <button
                onClick={toggleCart}
                className="relative p-3 rounded-lg bg-[var(--fut-bg-card)] border border-[var(--fut-border)] hover:border-[var(--fut-gold)] transition-colors"
              >
                <svg className="w-6 h-6 text-[var(--fut-gold)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--fut-gold)] text-black text-xs font-bold rounded-full flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
