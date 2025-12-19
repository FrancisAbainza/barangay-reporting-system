export const colors = {
  // Primary Colors
  primary: '#0038A8',
  primaryLight: '#4D7FD1',
  primaryDark: '#002875',
  
  // Secondary Colors
  secondary: '#898FAC',
  secondaryLight: '#B3B8CC',
  secondaryDark: '#5F6580',
  
  // Tertiary Colors
  tertiary: '#F4C430',
  tertiaryLight: '#F8D966',
  tertiaryDark: '#D6A600',
  
  // Error Colors
  error: '#DC2626',
  errorLight: '#EF4444',
  errorDark: '#B91C1C',
  
  // Success Colors
  success: '#16A34A',
  successLight: '#22C55E',
  successDark: '#15803D',
  
  // Warning Colors
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningDark: '#D97706',
  
  // Info Colors
  info: '#3B82F6',
  infoLight: '#60A5FA',
  infoDark: '#2563EB',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Gray Scale
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Background Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F9FAFB',
  backgroundTertiary: '#F3F4F6',
  
  // Text Colors
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textDisabled: '#D1D5DB',
  textOnPrimary: '#FFFFFF',
  textOnSecondary: '#FFFFFF',
  textOnTertiary: '#111827',
  
  // Border Colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',
  
  // Shadow Colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
  
  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
} as const;

export type ColorKey = keyof typeof colors;
