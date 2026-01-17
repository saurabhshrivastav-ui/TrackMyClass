import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
  Alert, // Added Alert
} from "react-native";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native"; // Added Navigation Hook

const { width } = Dimensions.get("window");

export default function ProfileScreen() {
  const navigation = useNavigation(); // Hook for navigation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

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
          onPress: () => {
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
        overScrollMode="always"
      >
        <View style={styles.headerBackground}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <Text style={styles.headerSubtitle}>Student Portal</Text>
        </View>

        <Animated.View
          style={[
            styles.card,
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

          <Text style={styles.name}>Saurabh</Text>
          <Text style={styles.role}>B.Sc. IT Student</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>92%</Text>
              <Text style={styles.statLabel}>Attendance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>8.5</Text>
              <Text style={styles.statLabel}>CGPA</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailsSection}>
            <DetailRow icon="🆔" label="Roll Number" value="21" />
            <DetailRow icon="🎓" label="Class" value="TY BSc IT" />
            <DetailRow icon="📧" label="Email" value="saurabh@college.edu" />
            <DetailRow icon="📍" label="Location" value="Mumbai, India" />
            <DetailRow icon="📞" label="Phone" value="+91 98765 43210" />
            <DetailRow icon="📅" label="DOB" value="12 Aug 2003" />
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
  safeArea: { flex: 1, backgroundColor: "#4A90E2" },
  container: { flex: 1, backgroundColor: "#F4F7FC" },
  scrollContent: { alignItems: "center", paddingBottom: 150, flexGrow: 1 },
  headerBackground: {
    backgroundColor: "#4A90E2",
    width: "100%",
    height: 280,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 50 : 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
    fontWeight: "600",
  },

  // Card
  card: {
    backgroundColor: "#fff",
    width: width * 0.9,
    marginTop: -90,
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
    marginBottom: 20,
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
  name: { fontSize: 26, fontWeight: "800", color: "#333", marginBottom: 5 },
  role: { fontSize: 16, color: "#777", fontWeight: "600", marginBottom: 20 },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  statBox: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 22, fontWeight: "bold", color: "#4A90E2" },
  statLabel: { fontSize: 12, color: "#999", fontWeight: "600" },
  statDivider: { width: 1, height: "100%", backgroundColor: "#E0E0E0" },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 20,
  },
  detailsSection: { width: "100%" },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#F5F5F5",
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  icon: { fontSize: 22 },
  detailTextContainer: { flex: 1 },
  detailLabel: {
    fontSize: 11,
    color: "#AAA",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  detailValue: { fontSize: 15, color: "#333", fontWeight: "600" },
  button: {
    marginTop: 10,
    backgroundColor: "#4A90E2",
    paddingVertical: 16,
    width: "100%",
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
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
    backgroundColor: "#FFEBEE", // Light Red Background
    paddingVertical: 16,
    width: "100%",
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  logoutButtonText: {
    color: "#FF5252", // Red Text
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  footerText: { marginTop: 10, color: "#B0B0B0", fontSize: 12 },
});