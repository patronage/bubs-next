const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Match Wordpress
  trailingSlash: true,

  images: {
    // Sizes the image helper will generate, want to match bootstrap grid
    deviceSizes: [480, 640, 750, 828, 1080, 1200, 1600, 1920],

    // Customize with your domains
    domains: [
      'localhost',
      '127.0.0.1',
      'bubsnext.wpengine.com',
      'bubs.patronage.org',
    ],
  },

  async rewrites() {
    return [
      // these two rules are used to locally serve (and rewrite urls) from WP
      {
        source: '/(.*)sitemap.xml',
        destination: '/api/upstream-proxy',
      },
      {
        source: '/feed',
        destination: '/api/upstream-proxy',
      },
      // resolve relative links to WP upload assets
      {
        source: '/wp-content/uploads/:path*',
        destination: `https://${process.env.WORDPRESS_DOMAIN}/wp-content/uploads/:path*`,
      },
    ];
  },
});
