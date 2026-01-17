import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS } from "../../utils/theme";

export default function Button({
  title,
  onPress,
  disabled = false,
  variant = "primary", // primary | secondary | ghost
  size = "md", // sm | md | lg
  left,
  style,
  textStyle,
  accessibilityLabel,
}) {
  const cfg = useMemo(() => {
    const sizes = {
      sm: { height: 40, px: 14, fontSize: 14 },
      md: { height: 46, px: 16, fontSize: 15 },
      lg: { height: 54, px: 18, fontSize: 16 },
    };

    const variants = {
      primary: {
        bg: COLORS.primary,
        border: COLORS.primary,
        fg: "#fff",
        hoverBg: "#4338CA",
        pressedBg: "#3730A3",
      },
      secondary: {
        bg: COLORS.secondary,
        border: COLORS.secondary,
        fg: "#fff",
        hoverBg: "#DB2777",
        pressedBg: "#BE185D",
      },
      ghost: {
        bg: "transparent",
        border: COLORS.border,
        fg: COLORS.text,
        hoverBg: "rgba(17,24,39,0.04)",
        pressedBg: "rgba(17,24,39,0.08)",
      },
    };

    return { ...sizes[size], ...variants[variant] };
  }, [size, variant]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.base,
        {
          height: cfg.height,
          paddingHorizontal: cfg.px,
          backgroundColor: disabled
            ? "#A5B4FC"
            : pressed
              ? cfg.pressedBg
              : hovered
                ? cfg.hoverBg
                : cfg.bg,
          borderColor: cfg.border,
          opacity: disabled ? 0.7 : 1,
          transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }],
        },
        style,
      ]}
    >
      <View style={styles.row}>
        {left ? <View style={styles.left}>{left}</View> : null}
        <Text style={[styles.text, { color: cfg.fg, fontSize: cfg.fontSize }, textStyle]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
  },
  row: { flexDirection: "row", alignItems: "center" },
  left: { marginRight: 10 },
  text: { fontWeight: "700" },
});
