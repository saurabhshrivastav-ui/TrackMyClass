import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { saveSession } from "../utils/session";
import { fetchUserByPhone } from "../utils/userApi";
import { COLORS, RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "../utils/theme";
import AppScreen from "../components/ui/AppScreen";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useResponsiveLayout } from "../utils/responsive";

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { isTablet } = useResponsiveLayout();

  const [country, setCountry] = useState({
    code: "+91",
    digits: 10,
    name: "India",
  });

  const countries = [
    { name: "India", code: "+91", digits: 10 },
    { name: "USA", code: "+1", digits: 10 },
    { name: "UK", code: "+44", digits: 10 },
    { name: "Australia", code: "+61", digits: 9 },
  ];

  // ✅ UPDATED LOGIN LOGIC
  const handleLogin = async () => {
    if (!phone) {
      Alert.alert("Error", "Phone number is required");
      return;
    }

    if (phone.length !== country.digits) {
      Alert.alert(
        "Invalid Number",
        `Enter ${country.digits}-digit phone number`
      );
      return;
    }

    setLoading(true);

    try {
      const fullPhone = `${country.code}${phone}`;
      // Query by digits so it matches Mongo whether it stores plain digits
      // (e.g. 9321656320) or full E.164 (e.g. +919321656320).
      const user = await fetchUserByPhone(phone);

      await saveSession({
        role: user.role,
        name: user.name,
        id: user.id,
        phone: fullPhone,
        semester: user.semester,
      });

      if (user.role === "admin") navigation.replace("AdminPanel");
      else if (user.role === "teacher") navigation.replace("TeacherDashboard");
      else navigation.replace("Main");
    } catch (error) {
      Alert.alert("Login Failed", error.message || "User not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <AppScreen scroll backgroundColor={COLORS.background} contentStyle={styles.screenContent}>
        <View style={styles.brandBlock}>
          <View style={styles.logoWrapper}>
            <Ionicons name="school" size={52} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>TrackMyClass</Text>
          <Text style={styles.tagline}>Welcome back! Sign in to continue.</Text>
        </View>

        <Card padding={SPACING.lg} style={[styles.card, isTablet && styles.cardTablet]}>
          <Text style={styles.loginText}>Log In</Text>
          <Text style={styles.loginSubtext}>Use your registered phone number</Text>

          <Text style={styles.subText}>Select country code and enter phone number</Text>

          {/* COUNTRY CODE DROPDOWN */}
          <Text style={styles.label}>Country</Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={country.code}
              onValueChange={(value) => {
                const selected = countries.find((c) => c.code === value);
                setCountry(selected);
                setPhone("");
              }}
            >
              {countries.map((item) => (
                <Picker.Item
                  key={item.code}
                  label={`${item.name} (${item.code})`}
                  value={item.code}
                />
              ))}
            </Picker>
          </View>

          {/* PHONE INPUT */}
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.prefix}>{country.code}</Text>
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              maxLength={country.digits}
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
              style={styles.input}
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <Button
            title={loading ? "Signing In..." : "Sign In"}
            onPress={handleLogin}
            disabled={phone.length !== country.digits || loading}
            style={styles.cta}
          />

          <Text style={styles.helperText}>
            By signing in, you agree to the app usage policy.
          </Text>
        </Card>
      </AppScreen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    justifyContent: "center",
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  brandBlock: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  logoWrapper: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
  },
  appName: {
    ...TYPOGRAPHY.h1,
    color: COLORS.primary,
  },
  tagline: {
    ...TYPOGRAPHY.muted,
    textAlign: "center",
    marginTop: 6,
  },
  card: {
    width: "100%",
    borderRadius: RADIUS.xl,
    ...SHADOW.card,
  },
  cardTablet: {
    padding: SPACING.xl,
  },
  loginText: {
    ...TYPOGRAPHY.h2,
    marginBottom: 6,
  },
  loginSubtext: {
    ...TYPOGRAPHY.caption,
    marginBottom: SPACING.md,
  },
  subText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.caption,
    marginBottom: 6,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    backgroundColor: "#F9FAFB",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 10,
    marginBottom: SPACING.lg,
    backgroundColor: "#F9FAFB",
    minHeight: 46,
  },
  prefix: {
    fontSize: 16,
    marginRight: 10,
    color: COLORS.textMuted,
    fontWeight: "700",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  cta: { marginTop: 2 },
  helperText: {
    marginTop: 12,
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: "center",
  },
});