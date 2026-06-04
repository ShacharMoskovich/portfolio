'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import type { Locale } from '@/lib/portfolio/types';

interface NavbarProps {
  locale: Locale;
}

export function Navbar({ locale }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isRtl = locale === 'he';

  const navItems = [
    { label: { en: 'Work', he: 'עבודות' }, href: '/portfolio' },
    { label: { en: 'Shop', he: 'חנות' }, href: '/shop' },
    { label: { en: 'Gallery', he: 'גלריה' }, href: '/gallery' },
    { label: { en: 'About', he: 'אודות' }, href: '/about' },
    { label: { en: 'Contact', he: 'יצירת קשר' }, href: '/contact' },
  ];

  const isActive = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <nav
      className="bg-canvas border-b border-border sticky top-0 z-40"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="px-5 md:px-10">
        <div className="flex items-center justify-center h-16 md:h-20">
          {/* Desktop Nav - Centered */}
          <div className="hidden md:flex gap-12 items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className={`text-lg transition-colors ${
                  isRtl ? 'font-display-he' : 'font-display'
                } ${
                  isActive(item.href)
                    ? 'text-ink font-medium'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                {item.label[locale]}
              </Link>
            ))}
            {/* Language Toggle */}
            <Link
              href={`/${locale === 'en' ? 'he' : 'en'}${pathname.replace(/^\/(en|he)/, '')}`}
              className={`text-lg tracking-[0.1em] uppercase text-ink-secondary hover:text-ink transition-colors border-l border-border pl-12 ${locale === 'en' ? 'font-display-he' : 'font-display'}`}
            >
              {locale === 'en' ? 'עברית' : 'English'}
            </Link>          
            </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1.5 absolute left-5"
            aria-label="Toggle menu"
          >
            <span
              className={`w-5 h-0.5 bg-ink transition-all ${
                isOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-ink transition-opacity ${
                isOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-ink transition-all ${
                isOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-border pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                onClick={() => setIsOpen(false)}
                className={`block text-base transition-colors ${
                  isRtl ? 'font-display-he' : 'font-display'
                } ${
                  isActive(item.href)
                    ? 'text-ink font-medium'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                {item.label[locale]}
              </Link>
            ))}
            <div className="border-t border-border pt-3">
              <Link
                href={`/${locale === 'en' ? 'he' : 'en'}${pathname.replace(/^\/(en|he)/, '')}`}
                onClick={() => setIsOpen(false)}
                className={`text-base tracking-[0.1em] uppercase text-ink-secondary hover:text-ink transition-colors ${locale === 'en' ? 'font-display-he' : 'font-display'}`}
              >
                {locale === 'en' ? 'עברית' : 'English'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
