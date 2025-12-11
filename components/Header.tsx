'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { href: '/', label: '상품 안내' },
        { href: '/comparison', label: '상품별 수익 비교' },
        { href: '/extra', label: '전략별 추가 수익' },
        { href: '/target', label: '현금흐름 설계' },
        { href: '/simulator', label: '여유 시뮬레이터' },
    ];

    return (
        <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-6 py-5">
                <h1 className="text-2xl font-bold mb-4 tracking-tight">
                    숲파트너스 투자 수익 시뮬레이터
                </h1>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-2 flex-wrap">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${pathname === item.href
                                    ? 'bg-white text-primary'
                                    : 'bg-white bg-opacity-10 border border-white border-opacity-20 hover:bg-white hover:bg-opacity-20 hover:-translate-y-0.5'
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white bg-opacity-10"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {mobileMenuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="md:hidden mt-4 flex flex-col gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-5 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${pathname === item.href
                                        ? 'bg-white text-primary'
                                        : 'bg-white bg-opacity-10 border border-white border-opacity-20'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
}
