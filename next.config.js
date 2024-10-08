/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

module.exports = {
  output: "standalone",
  trailingSlash: true,
  reactStrictMode: false,
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  },
  env: {
    googleKey: "AIzaSyAeJCd8gM5oLEo4ue8nH4g2HR5w6r8l57w",
  },
  images: {
    minimumCacheTTL: 0,
  },
}
