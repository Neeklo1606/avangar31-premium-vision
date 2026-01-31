// Константы темы из Figma

export const COLORS = {
  primary: {
    DEFAULT: '#3CA4F4',
    dark: '#2A8FD9',
    light: '#6BB8F7',
  },
  dark: {
    DEFAULT: '#1E1E1E',
    50: '#2D2D2D',
    100: '#1A1A1A',
  },
  gray: {
    light: '#DFDFDF',
    medium: '#8E8E8E',
    dark: '#6B6B6B',
  },
  white: '#FFFFFF',
  error: '#E74C3C',
  success: '#27AE60',
  warning: '#F39C12',
}

export const FONT_SIZES = {
  xs: '10px',
  sm: '12px',
  base: '14px',
  md: '16px',
  lg: '18px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '40px',
}

export const FONT_WEIGHTS = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}

export const BORDER_RADIUS = {
  sm: '5px',
  md: '10px',
  lg: '15px',
  xl: '25px',
  full: '9999px',
}

export const BREAKPOINTS = {
  mobile: '320px',
  mobileLarge: '480px',
  tablet: '768px',
  desktop: '1024px',
  desktopLarge: '1200px',
  wide: '1440px',
}

export const SPACING = {
  section: {
    mobile: '32px',
    desktop: '48px',
  },
  container: {
    mobile: '16px',
    desktop: '60px',
  },
}

export const TRANSITIONS = {
  default: 'all 0.3s ease',
  fast: 'all 0.15s ease',
  slow: 'all 0.5s ease',
}

export const SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
}

export const Z_INDEX = {
  base: 0,
  dropdown: 100,
  modal: 200,
  tooltip: 300,
  header: 400,
}
