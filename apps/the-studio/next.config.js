const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

module.exports = {
  transpilePackages: ["@ess/firebase", "@ess/hooks", "@ess/zod", "@ess/utils"],
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com"],
  },
};
