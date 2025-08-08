// app/[locale]/layout.tsx
import '../../styles/globals.css';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@/components/tailwind/ThemeProvider';
import { SiteHeader } from '@/components/SiteHeader';
import { getMessages } from 'next-intl/server';
import GATracker from "@/components/google/GATracker";
import Script from "next/script";
import FeedbackButton from '@/components/FeedbackButton';

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
      {/* ✅ Google Tag Manager (GTM) HEAD SCRIPT */}
      <Script id="gtm-head" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_GTM_ID}'+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
        `}
      </Script>
    </head>
    <body>

    {/* ✅ Google Tag Manager (GTM) NOSCRIPT iframe */}
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      ></iframe>
    </noscript>

    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <GATracker/>
        <SiteHeader />
        {children}
        <FeedbackButton />
      </ThemeProvider>
    </NextIntlClientProvider>
    </body>
    </html>
  );
}
