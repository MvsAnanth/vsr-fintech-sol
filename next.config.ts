import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",   // Generates static HTML/CSS/JS in /out folder
  trailingSlash: true, // Netlify expects this for clean URLs
};

export default nextConfig;
