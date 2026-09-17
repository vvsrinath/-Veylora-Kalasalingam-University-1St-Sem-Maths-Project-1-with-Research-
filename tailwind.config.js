export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        navy: '#07131F',
        navydark: '#0D2130',
        surface: '#132C3D',
        soft: '#F4F8FA',
        muted: '#9AAEBB',
        accent: '#2DD8A0',
        accent2: '#38BDF8',
        warn: '#F5A524',
        danger: '#E5484D',
        success: '#2DD8A0',
        lighttext: '#0F2436',
        lightmuted: '#5B7284',
        lightborder: '#E2E8EE',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(45, 216, 160, 0.35)',
        card: '0 1px 2px rgba(7, 19, 31, 0.06), 0 8px 24px -12px rgba(7, 19, 31, 0.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
};
