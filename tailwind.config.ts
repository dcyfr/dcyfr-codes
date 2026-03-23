import type { Config } from 'tailwindcss';
import dcyfrPreset from './tailwind.preset';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [dcyfrPreset],
};

export default config;
