const { withContentlayer } = require('next-contentlayer')
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true
})
const { withSentryConfig } = require('@sentry/nextjs')

// Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' *.googleapis.com *.googletagmanager.com;
  img-src 'self' data: blob: *.amazonaws.com randomuser.me lh3.googleusercontent.com avatars.githubusercontent.com;
  style-src 'self' 'unsafe-inline' *.googleapis.com;
  font-src 'self' data: fonts.gstatic.com;
  connect-src 'self' *.supabase.co sentry.io vitals.vercel-insights.com;
  frame-src 'self';
  object-src 'none';
`;

// Enhanced security headers
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    config.module.rules.push({
      test: /\.(woff|woff2|ttf)$/,
      type: 'asset/resource',
    });
    return config;
  },
  experimental: {
    serverExternalPackages: ["@prisma/client"],
  },
  async headers() {
    return [
      // Apply security headers to all routes
      {
        source: '/:path*',
        headers: [
          ...securityHeaders,
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'development' 
              ? 'http://localhost:3002' 
              : process.env.NEXT_PUBLIC_APP_URL
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization'
          }
        ]
      }
    ]
  },
};

// Sentry configuration options
const sentryWebpackPluginOptions = {
  // Additional options for the Sentry Webpack plugin.
  silent: true, // Suppresses all logs
};

// Apply enhancements in order
module.exports = withSentryConfig(
  withPWA(
    withContentlayer(nextConfig)
  ),
  sentryWebpackPluginOptions
);
