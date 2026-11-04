// Tailwind is compiled through PostCSS so it also runs under
// `next build --webpack`; a webpack build ignores `turbopack.rules` in
// next.config.mjs and would emit the Tailwind at-rules unprocessed.
/** @type {import("postcss-load-config").Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
