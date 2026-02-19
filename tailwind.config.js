
export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#0f172a',
          900: '#1e293b',
          800: '#334155',
          700: '#475569',
          600: '#64748b',
        },
        accent: {
          DEFAULT: '#f59e0b',
          hover: '#d97706',
          light: '#fbbf24',
        },
        success: '#10b981',
        warning: '#f97316',
        error: '#f43f5e',
        info: '#3b82f6',
        border: '#e7e5e3',
      },
    },
  },
}
