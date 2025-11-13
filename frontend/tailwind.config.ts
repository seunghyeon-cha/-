import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Color - Sky Blue (여행의 자유와 설렘)
        primary: {
          50: '#E0F2FE',
          100: '#BAE6FD',
          200: '#7DD3FC',
          300: '#38BDF8',
          400: '#0EA5E9',
          500: '#0284C7', // Main Brand Color
          600: '#0369A1',
          700: '#075985',
          800: '#0C4A6E',
          900: '#0F172A',
        },
        // Secondary Color - Green (성공, 긍정)
        secondary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981', // Main
          600: '#059669',
          700: '#047857',
        },
        // Semantic Colors
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'sans-serif',
        ],
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'fadeIn': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'fade-out': 'fade-out 0.3s ease-out',
        'fadeIn': 'fadeIn 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
