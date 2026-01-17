import React from "react";
import { StyleSheet, View } from "react-native";
import { COLORS, RADIUS, SHADOW } from "../../utils/theme";

export default function Card({ children, style, padding = 16 }) {
  return (
    <View style={[styles.card, { padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.soft,
  },
});
