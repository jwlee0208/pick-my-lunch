// app/[locale]/layout.tsx
import '../../styles/globals.css';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/SiteHeader';
import { getMessages } from 'next-intl/server';
import GATracker from "@/components/GATracker";
import Script from "next/script";

export default async function LocaleLayout({
                                             children,
                                             params,
                                           }: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let messages;
  try {
    // console.log(`Locale: ${locale}`);
    messages = await getMessages({ locale } as { locale: string }); // 타입 단언 추가
    // console.log(`Messages:`, messages);
  } catch (error) {
    console.error(`Error loading messages:`, error);
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
    <head>
      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}', {
                page_path: window.location.pathname,
              });
        `}
      </Script>
    </head>
    <body>
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <GATracker/>
        <SiteHeader />
        {children}
      </ThemeProvider>
    </NextIntlClientProvider>
    </body>
    </html>
  );
}
