'use client';

import { siteConfig } from "@/config/site"
import { MainNav } from "@/components/MainNav"
import { ThemeToggle } from './ThemeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex items-center gap-4">
          <MainNav items={siteConfig.mainNav} />
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              <ThemeToggle />
              <LanguageSwitcher />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
