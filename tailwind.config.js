/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ide: {
          bg: '#0d1117',
          surface: '#161b22',
          border: '#21262d',
          hover: '#1c2128',
          editor: '#0d1117',
          linenum: '#484f58',
          accent: '#58a6ff',
          success: '#3fb950',
          error: '#f85149',
          warning: '#d29922',
          purple: '#bc8cff',
          teal: '#39d353',
          text: '#e6edf3',
          muted: '#8b949e',
        }
      },
      animation: {
        'slide-in': 'slideIn 0.2s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'spin-slow': 'spin 1s linear infinite',
      },
      keyframes: {
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}

