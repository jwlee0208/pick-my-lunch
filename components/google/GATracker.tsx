'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function GATracker(): null {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag !== 'function') return;

    window.gtag('config', process.env.NEXT_PUBLIC_GA4_ID as string, {
      page_path: pathname,
    });
  }, [pathname]);

  return null;
}
