import '@/styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import Script from 'next/script'
import GATracker from '@/components/GATracker'
import {SiteHeader} from "@/components/site-header";
import {ReduxProviderWrapper} from "@/components/ReduxProviderWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
