export const COLORS = {
  primary: "#4F46E5",
  secondary: "#EC4899",
  background: "#F5F7FA",
  surface: "#FFFFFF",
  text: "#111827",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
  night: "#111827",
};

export const SPACING = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const SHADOW = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  soft: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
};

export const TYPOGRAPHY = {
  h1: { fontSize: 28, fontWeight: "800", color: COLORS.text },
  h2: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  h3: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  body: { fontSize: 15, fontWeight: "500", color: COLORS.text },
  muted: { fontSize: 13, fontWeight: "500", color: COLORS.textMuted },
  caption: { fontSize: 12, fontWeight: "600", color: COLORS.textMuted },
};

export const LAYOUT = {
  maxWidthPhone: 520,
  maxWidthTablet: 820,
  maxWidthDesktop: 1080,
};