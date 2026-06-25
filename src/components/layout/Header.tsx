"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { mainNavigation } from "@/lib/config/navigation";
import { useCart } from "@/lib/store/cart";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalItems = useCart((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const handleMouseEnter = useCallback((href: string) => {
    clearCloseTimer();
    setActiveDropdown(href);
  }, [clearCloseTimer]);

  const handleMouseLeave = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 150);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearCloseTimer();
    };
  }, [clearCloseTimer]);

  return (
    <header
      className={cn(
        "site-header fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-bg-primary/95 backdrop-blur-xl shadow-lg"
          : "bg-bg-secondary"
      )}
    >
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-2xl lg:text-3xl tracking-wider">
              <span className="text-text-primary">CLUB</span>
              <span className="text-bronze">-</span>
              <span className="text-bronze">RING</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {mainNavigation.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.children && handleMouseEnter(item.href)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-text-secondary hover:text-bronze transition-colors"
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-3.5 h-3.5" />}
                </Link>

                {item.children && activeDropdown === item.href && (
                  <div className="absolute top-full left-0 w-56 pt-3">
                    <div className="bg-bg-elevated border border-border rounded-xl shadow-xl py-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-text-secondary hover:text-bronze hover:bg-bronze/5 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/shop/cart"
              className="relative p-2 text-text-secondary hover:text-bronze transition-colors"
              aria-label="Корзина"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-bronze text-bg-primary text-[10px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </Link>

            <button
              className="lg:hidden p-2 text-text-secondary hover:text-bronze transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Меню"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-bg-primary border-t border-border">
          <nav className="max-w-7xl mx-auto px-5 py-6 space-y-1">
            {mainNavigation.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-lg font-medium text-text-secondary hover:text-bronze transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-8 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-text-muted hover:text-bronze transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
