export const colors = {
  orange: '#FF6B1A',
  orangeLight: '#ff9a5a',
  black: '#0A0A0F',
  white: '#fff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#374151',
  gray700: '#111827',
  gray900: '#0A0A0F',
  green: '#16a34a',
  red: '#dc2626',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  h1: { fontSize: 22, fontWeight: '600', color: colors.gray900 },
  h2: { fontSize: 18, fontWeight: '600', color: colors.gray700 },
  subtitle: { fontSize: 15, color: colors.gray500, marginBottom: spacing.xxl },
  body: { fontSize: 14, color: colors.gray500 },
  label: { fontSize: 14, fontWeight: '500', color: colors.gray600, marginBottom: spacing.xs },
  helper: { fontSize: 12, color: colors.gray500, marginTop: spacing.xs },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
};

export const inputStyle = {
  height: 48,
  borderWidth: 1,
  borderColor: colors.gray300,
  borderRadius: borderRadius.lg,
  paddingHorizontal: spacing.lg,
  fontSize: 16,
  color: colors.gray700,
  backgroundColor: colors.white,
};
