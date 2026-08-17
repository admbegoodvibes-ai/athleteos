/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  transpilePackages: ['@athleteos/database', '@athleteos/ai', '@athleteos/analytics', '@athleteos/ui', '@athleteos/security'],
}

module.exports = nextConfig
