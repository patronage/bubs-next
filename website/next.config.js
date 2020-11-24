const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  images: {
    loader: "cloudinary",
    path: "https://res.cloudinary.com/patronage/image/fetch/",
  },
});
