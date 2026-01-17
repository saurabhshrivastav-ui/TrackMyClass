import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert, // Added Alert
} from "react-native";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native"; // Added Navigation Hook
import { clearSession, getSession } from "../../utils/session";
import { COLORS, RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "../../utils/theme";
import { fetchUserById } from "../../utils/userApi";
import { useResponsiveLayout } from "../../utils/responsive";

export default function ProfileScreen() {
  const navigation = useNavigation(); // Hook for navigation
  const { gutter, contentMaxWidth } = useResponsiveLayout();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    const loadUser = async () => {
      try {
        const session = await getSession();
        if (!session?.id) {
          setLoading(false);
          return;
        }
        const userData = await fetchUserById(session.id);
        setUser(userData);
      } catch (error) {
        console.error("Profile load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive", 
          onPress: async () => {
            await clearSession();
            // Reset navigation stack to prevent going back
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }], 
            });
          } 
        }
      ]
    );
  };

  const DetailRow = ({ icon, label, value }) => (
    <View style={styles.detailRow}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: gutter }]}
        showsVerticalScrollIndicator={true}
        bounces={true}
        overScrollMode="always"
      >
        <View style={styles.headerBackground}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <Text style={styles.headerSubtitle}>
            {user?.role === "teacher" ? "Teacher Portal" : "Student Portal"}
          </Text>
        </View>

        <Animated.View
          style={[
            styles.card,
            { maxWidth: contentMaxWidth },
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Animated.View
            style={[
              styles.avatarContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.lottieWrapper}>
              <LottieView
                source={require("../../../assets/User.json")}
                autoPlay
                loop
                style={styles.lottie}
                resizeMode="cover"
              />
            </View>
            <View style={styles.statusDotContainer}>
              <View style={styles.statusDot} />
            </View>
          </Animated.View>

          <Text style={styles.name}>{user?.name || "User"}</Text>
          <Text style={styles.role}>
            {user?.role === "teacher"
              ? `${user?.department || "Faculty"} Teacher`
              : `${user?.className || "Student"}`}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{loading ? "..." : "--"}</Text>
              <Text style={styles.statLabel}>Attendance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{loading ? "..." : "--"}</Text>
              <Text style={styles.statLabel}>CGPA</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsSection}>
            {user?.role === "student" && (
              <DetailRow
                icon="🆔"
                label="Roll Number"
                value={user?.rollNo || "--"}
              />
            )}
            {user?.role === "student" && (
              <DetailRow
                icon="🎓"
                label="Class"
                value={user?.className || "--"}
              />
            )}
            {user?.role === "student" && (
              <DetailRow
                icon="📅"
                label="Semester"
                value={user?.semester || "--"}
              />
            )}
            {user?.role === "teacher" && (
              <DetailRow
                icon="🎓"
                label="Department"
                value={user?.department || "--"}
              />
            )}
            <DetailRow icon="📧" label="Email" value={user?.email || "--"} />
            <DetailRow icon="📞" label="Phone" value={user?.phone || "--"} />
          </View>

          <TouchableOpacity activeOpacity={0.8} style={styles.button}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          {/* --- LOGOUT BUTTON --- */}
          <TouchableOpacity 
            activeOpacity={0.8} 
            style={styles.logoutButton} 
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>

        </Animated.View>

        <Text style={styles.footerText}>© 2024 College App</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.primary },
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 120,
    flexGrow: 1,
  },
  headerBackground: {
    backgroundColor: COLORS.primary,
    width: "100%",
    height: 280,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 50 : 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTitle: { ...TYPOGRAPHY.h2, color: "#fff" },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
    fontWeight: "600",
  },

  // Card
  card: {
    backgroundColor: COLORS.surface,
    width: "100%",
    marginTop: -90,
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    alignItems: "center",
    ...SHADOW.card,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    marginTop: -70,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  lottieWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: "#fff",
    backgroundColor: "#ccc",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: { width: 120, height: 120 },
  statusDotContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 3,
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2ECC71",
  },
  name: { fontSize: 26, fontWeight: "800", color: COLORS.text, marginBottom: 5 },
  role: { fontSize: 16, color: COLORS.textMuted, fontWeight: "600", marginBottom: 20 },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  statBox: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 22, fontWeight: "bold", color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: "600" },
  statDivider: { width: 1, height: "100%", backgroundColor: COLORS.border },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 20,
  },
  detailsSection: { width: "100%" },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  icon: { fontSize: 22 },
  detailTextContainer: { flex: 1 },
  detailLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  detailValue: { fontSize: 15, color: COLORS.text, fontWeight: "600" },
  button: {
    marginTop: 10,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    width: "100%",
    borderRadius: 15,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  // Logout Button Styles
  logoutButton: {
    marginTop: 15,
    backgroundColor: "#FEE2E2",
    paddingVertical: 16,
    width: "100%",
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  logoutButtonText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  footerText: { marginTop: 10, color: COLORS.textMuted, fontSize: 12 },
});