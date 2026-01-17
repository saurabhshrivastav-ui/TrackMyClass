import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS, RADIUS } from "../../utils/theme";

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize = "none",
  maxLength,
  left,
  right,
  containerStyle,
  inputStyle,
}) {
  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputContainer}>
        {left ? <View style={styles.affix}>{left}</View> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          style={[styles.input, inputStyle]}
        />
        {right ? <View style={styles.affix}>{right}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 6,
    fontWeight: "700",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#F9FAFB",
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    minHeight: 46,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 10,
  },
  affix: { marginRight: 8 },
});
