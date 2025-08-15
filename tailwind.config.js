/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'header-accent': {
          DEFAULT: 'hsl(var(--header-accent))',
          foreground: 'hsl(var(--header-accent-foreground))',
        },
        'floating-header': {
          DEFAULT: 'hsl(var(--floating-header))',
          foreground: 'hsl(var(--floating-header-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: 'hsl(var(--primary-50, 240 100% 97%))',
          100: 'hsl(var(--primary-100, 240 100% 94%))',
          200: 'hsl(var(--primary-200, 240 100% 89%))',
          300: 'hsl(var(--primary-300, 240 100% 83%))',
          400: 'hsl(var(--primary-400, 240 100% 75%))',
          500: 'hsl(var(--primary-500, 240 100% 67%))',
          600: 'hsl(var(--primary-600, 240 100% 59%))',
          700: 'hsl(var(--primary-700, 240 100% 51%))',
          800: 'hsl(var(--primary-800, 240 100% 43%))',
          900: 'hsl(var(--primary-900, 240 100% 35%))',
          950: 'hsl(var(--primary-950, 240 100% 27%))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-slow': 'spin 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'cyber-pulse': 'cyberPulse 1.5s ease-in-out infinite',
        'matrix-rain': 'matrixRain 4s linear infinite',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'slide-out-right': 'slideOutRight 0.3s cubic-bezier(0.55, 0.06, 0.68, 0.19)',
        'tech-hover': 'techHover 0.2s ease-out',
        'icon-spin': 'iconSpin 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px hsl(120 85% 60%), 0 0 10px hsl(120 85% 60%), 0 0 15px hsl(120 85% 60%)' },
          '100%': { boxShadow: '0 0 10px hsl(120 85% 60%), 0 0 20px hsl(120 85% 60%), 0 0 30px hsl(120 85% 60%)' },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 2px hsl(120 25% 85%), 0 0 4px hsl(120 25% 85%)',
            borderColor: 'hsl(85 40% 25%)'
          },
          '50%': { 
            boxShadow: '0 0 8px hsl(120 85% 60%), 0 0 16px hsl(120 85% 60%)',
            borderColor: 'hsl(120 85% 60%)'
          },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '0.6' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        cyberPulse: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        matrixRain: {
          '0%': { transform: 'translateY(-100px)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100px)', opacity: '0' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        techHover: {
          '0%': { transform: 'scale(1) rotate(0deg)', filter: 'brightness(1)' },
          '100%': { transform: 'scale(1.05) rotate(1deg)', filter: 'brightness(1.2)' },
        },
        iconSpin: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}