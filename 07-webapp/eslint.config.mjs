import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * Konfigurasi ESLint datar (flat config) untuk Next.js 16.
 *
 * eslint-config-next versi 16 sudah mengekspor flat config, jadi tidak perlu
 * FlatCompat. Skrip `lint` di package.json memakai `eslint .` karena perintah
 * `next lint` sudah dihapus pada Next.js 16.
 */
const config = [
  {
    // Artefak build, dependensi, dan screenshot uji lokal diabaikan.
    ignores: [".next/**", "node_modules/**", "out/**", ".shots/**", "next-env.d.ts"],
  },
  ...coreWebVitals,
  ...nextTypescript,
  {
    // Skrip uji Node memakai impor TypeScript ber-ekstensi .ts dan berjalan
    // di luar bundler Next, sehingga sebagian aturan tidak relevan.
    files: ["scripts/**/*.{ts,mts,mjs,js}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@next/next/no-assign-module-variable": "off",
    },
  },
];

export default config;
