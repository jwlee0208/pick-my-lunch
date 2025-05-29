// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  svgo: false,
};

const withNextIntl = createNextIntlPlugin('@/i18n/request.ts');

export default withNextIntl(nextConfig);
