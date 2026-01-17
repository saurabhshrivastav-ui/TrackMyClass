import { useMemo } from "react";
import { useWindowDimensions } from "react-native";

export const BREAKPOINTS = {
  sm: 360,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export function getResponsiveLayout(width) {
  const isSmallPhone = width < BREAKPOINTS.sm;
  const isPhone = width < BREAKPOINTS.md;
  const isTablet = width >= BREAKPOINTS.md && width < BREAKPOINTS.lg;
  const isDesktop = width >= BREAKPOINTS.lg;

  const gutter = isSmallPhone ? 14 : isPhone ? 16 : isTablet ? 22 : 28;
  const contentMaxWidth = isDesktop ? 1080 : isTablet ? 820 : 520;

  return {
    width,
    isSmallPhone,
    isPhone,
    isTablet,
    isDesktop,
    gutter,
    contentMaxWidth,
  };
}

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();

  const layout = useMemo(() => {
    return { ...getResponsiveLayout(width), height };
  }, [width, height]);

  return layout;
}
