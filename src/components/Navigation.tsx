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
  ];

  const adminLinks = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/cards', label: 'Cards' },
    { href: '/admin/add', label: 'Add Card' },
  ];

  const links = isAdmin ? adminLinks : publicLinks;

  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <Link href={isAdmin ? '/admin' : '/'} className="nav-logo">
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
                <span className="text-[10px] font-medium text-muted tracking-wider uppercase">
                  Collectibles
                </span>
              )}
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="nav-links hidden md:flex ml-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <Link href="/" className="btn btn-outline btn-sm">
              View Store
            </Link>
          ) : (
            <>
              <Link href="/admin" className="nav-link hidden md:inline-block">
                Admin
              </Link>
              <button
                onClick={toggleCart}
                className="relative p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--lime)] transition-all"
              >
                <svg className="w-5 h-5 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-lime text-[var(--text-on-lime)] text-xs font-bold rounded-full flex items-center justify-center">
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
