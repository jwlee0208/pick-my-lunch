import '@/styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import Script from 'next/script'
import GATracker from '@/components/GATracker'
import {SiteHeader} from "@/components/site-header";
import {ReduxProviderWrapper} from "@/components/ReduxProviderWrapper";

export const metadata = {
  title: '(: PickMyLunch :)',
  description: '(: recommend lunch menu for you :)',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
    <head>
      {/* Favicon and Meta Tags */}
      <link rel="apple-touch-icon" sizes="57x57" href="/public/apple-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/public/apple-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/public/apple-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/public/apple-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/public/apple-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/public/apple-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/public/apple-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/public/apple-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/public/apple-icon-180x180.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/public/android-icon-192x192.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/public/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="96x96" href="/public/favicon-96x96.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/public/favicon-16x16.png" />
      <link rel="manifest" href="/public/manifest.json" />
      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
      <meta name="theme-color" content="#ffffff" />

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
      <ReduxProviderWrapper>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <GATracker />
          <SiteHeader />
          {children}
        </ThemeProvider>
      </ReduxProviderWrapper>
    </body>
    </html>
  )
}
