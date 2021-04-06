const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Enable webpack 5
  future: {
    webpack5: true,
  },

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
});
