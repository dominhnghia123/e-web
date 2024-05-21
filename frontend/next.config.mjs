/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BASE_HOST: "http://localhost:8000/api",
    STRIPE_PUBLIC_KEY:
      "pk_test_51PFBxmDwGabP0xR6NFK6wEkD3V4gmD3G1ttaP6PXPFEzYsAfLRa2Dl82GkHduSeNGFE9qnXvc8tdKCLqRhhmSyoZ00lVboDEP0",
    STRIPE_SECRET_KEY:
      "sk_test_51PFBxmDwGabP0xR6eCxPB4ZVeMYqgQcfARx3Ctd5cINfzjijjs2fUZ4KwScDKJAQPr2GnP7nfgrfXb1l8Qjapnqg008pxsFx5f",
  },
};

export default nextConfig;
