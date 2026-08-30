/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  webpack: (config, { isServer, dev }) => {
    if (!dev) {
      config.cache = { type: "memory" };
    }

    if (isServer) {
      config.plugins.push({
        apply(compiler) {
          compiler.hooks.afterEmit.tap("EnsurePagesManifestDefaults", (compilation) => {
            const manifestAsset = compilation.assets["pages-manifest.json"];
            if (manifestAsset) {
              try {
                const manifest = JSON.parse(manifestAsset.source().toString());
                if (!manifest["/_app"]) manifest["/_app"] = "pages/_app.js";
                if (!manifest["/_document"]) manifest["/_document"] = "pages/_document.js";
                if (!manifest["/_error"]) manifest["/_error"] = "pages/_error.js";
                const sourceStr = JSON.stringify(manifest, null, 2);
                compilation.assets["pages-manifest.json"] = {
                  source: () => sourceStr,
                  size: () => sourceStr.length,
                };
              } catch (e) {
                console.error("PagesManifest hook error:", e);
              }
            }
          });
        },
      });
    }

    return config;
  },
};

export default nextConfig;
