const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const securityHeaders = [{
  key: 'Strict-Transport-Security',
  value: 'max-age=63072000; includeSubDomains; preload'
}, {
  key: 'X-Content-Type-Options',
  value: 'nosniff'
}, {
  key: 'Content-Security-Policy',
  value: 'upgrade-insecure-requests'
}, {
  key: 'X-XSS-Protection',
  value: '1'
}];

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
      {
        source: '/(.*)sitemap.xml',
        destination: '/api/upstream-proxy',
      },
      {
        source: '/feed',
        destination: '/api/upstream-proxy',
      },
    ];
  },

  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  // For some projects, /wp-content upload paths still need to resolve
  // Proxy the resource up to Wordpress. Uncomment to enable.
  /*async redirects() {
    return [
      {
        source: '/wp-content/uploads/:path*',
        destination:
          'https://bubsnext.wpengine.com/wp-content/uploads/:path*',
        permanent: true,
      },
    ];
  },*/
});
