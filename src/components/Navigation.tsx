'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    { href: '/store', label: 'Marketplace' },
    { href: '/packs', label: 'Open Packs' },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/cards', label: 'Cards' },
    { href: '/admin/packs', label: 'Packs' },
  ];

  const links = isAdmin ? adminLinks : publicLinks;

  return (
    <nav className="nxg-nav">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Link href={isAdmin ? '/admin' : '/'} className="flex items-center gap-3 mr-8">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden">
              <Image
                src="/logo.jpg"
                alt="neXGen"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white leading-none">
                {isAdmin ? 'Admin' : 'neXGen'}
              </span>
              {!isAdmin && (
                <span className="text-[10px] font-medium text-[var(--nxg-text-muted)] tracking-wider uppercase">
                  Collectibles
                </span>
              )}
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nxg-nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <Link href="/" className="nxg-btn nxg-btn-secondary text-sm py-2.5 px-5">
              View Store
            </Link>
          ) : (
            <>
              <Link href="/admin" className="nxg-nav-link hidden md:inline-block">
                Admin
              </Link>
              <button
                onClick={toggleCart}
                className="relative p-3 rounded-xl glass-card hover:bg-[var(--nxg-glass-hover)] transition-all"
              >
                <svg className="w-5 h-5 text-[var(--nxg-lime)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--nxg-lime)] text-black text-xs font-bold rounded-full flex items-center justify-center">
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
