import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../utils/theme";
import { useResponsiveLayout } from "../../utils/responsive";

export default function AppScreen({
  children,
  scroll = true,
  style,
  contentStyle,
  backgroundColor = COLORS.background,
  keyboardShouldPersistTaps = "handled",
}) {
  const { gutter, contentMaxWidth } = useResponsiveLayout();

  const content = (
    <View
      style={[
        styles.content,
        { paddingHorizontal: gutter, maxWidth: contentMaxWidth },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }, style]} edges={["top", "bottom"]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.flex}>{content}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scrollContainer: { flexGrow: 1, alignItems: "center" },
  content: {
    width: "100%",
    paddingTop: 16,
    paddingBottom: 28,
  },
});
