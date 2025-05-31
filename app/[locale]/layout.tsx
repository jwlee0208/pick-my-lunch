// app/[locale]/layout.tsx
import '../../styles/globals.css';
import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/SiteHeader';
import { getMessages } from 'next-intl/server';

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
    <body>
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SiteHeader />
        {children}
      </ThemeProvider>
    </NextIntlClientProvider>
    </body>
    </html>
  );
}
