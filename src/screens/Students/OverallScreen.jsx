import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

// Mock Data
const subjectsData = [
  {
    id: 1,
    name: "Data Structures & Algorithms",
    attended: 42,
    total: 48,
    percent: 88,
    color: "#4CAF50",
    absent: 6,
  },
  {
    id: 2,
    name: "Database Management Systems",
    attended: 38,
    total: 45,
    percent: 84,
    color: "#4CAF50",
    absent: 7,
  },
  {
    id: 3,
    name: "Operating Systems",
    attended: 35,
    total: 50,
    percent: 70,
    color: "#FFA726",
    absent: 15,
  },
  {
    id: 4,
    name: "Computer Networks",
    attended: 44,
    total: 47,
    percent: 94,
    color: "#9C27B0",
    absent: 3,
  },
  {
    id: 5,
    name: "Software Engineering",
    attended: 30,
    total: 46,
    percent: 65,
    color: "#F44336",
    absent: 16,
  },
  {
    id: 6,
    name: "Web Technologies",
    attended: 40,
    total: 44,
    percent: 91,
    color: "#E91E63",
    absent: 4,
  },
];

const AnimatedProgressBar = ({ percent, color }) => {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: percent,
      duration: 1000,
      delay: 300,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [percent]);

  const widthInterpolated = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.progressBarBackground}>
      <Animated.View
        style={[
          styles.progressBarFill,
          { width: widthInterpolated, backgroundColor: color },
        ]}
      />
    </View>
  );
};

export default function OverallScreen() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    name: "Saurabh Shrivastav",
    id: "CS2024001",
    semester: "6th Semester",
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // SECURE SESSION LOADING
    const loadSession = async () => {
      try {
        const savedUser = await SecureStore.getItemAsync("user_session");
        if (savedUser) {
          setUserData(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Could not load secure session:", error);
      }
    };

    loadSession();

    // ENTRANCE ANIMATIONS
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Attendance Dashboard</Text>

            <View style={styles.studentInfoRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ProfileScreen")}
                style={[
                  styles.badge,
                  { backgroundColor: "#E3F2FD", borderColor: "#BBDEFB" },
                ]}
              >
                <Text style={[styles.badgeText, { color: "#1976D2" }]}>
                  👤 {userData.name}
                </Text>
              </TouchableOpacity>

              <View
                style={[
                  styles.badge,
                  { backgroundColor: "#F3E5F5", borderColor: "#E1BEE7" },
                ]}
              >
                <Text style={[styles.badgeText, { color: "#7B1FA2" }]}>
                  🆔 {userData.id}
                </Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: "#FFF3E0", borderColor: "#FFE0B2" },
                ]}
              >
                <Text style={[styles.badgeText, { color: "#E65100" }]}>
                  📅 {userData.semester}
                </Text>
              </View>
            </View>

            <View style={styles.requiredContainer}>
              <Text style={styles.requiredLabel}>Required Attendance</Text>
              <Text style={styles.requiredValue}>75%</Text>
            </View>
          </View>

          {/* Chart Section */}
          <View style={styles.chartContainer}>
            <View style={styles.circleOuter}>
              <View style={styles.circleInner}>
                <Text style={styles.overallPercent}>82%</Text>
                <Text style={styles.overallLabel}>Overall</Text>
              </View>
            </View>
            <Text style={styles.academicYear}>Academic Year 2024-25</Text>

            <View style={styles.statusPill}>
              <Text style={styles.statusTitle}>Status: Excellent</Text>
              <Text style={styles.statusSubtitle}>
                Your attendance is above the required threshold
              </Text>
            </View>
          </View>

          {/* Stats Cards Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📅</Text>
              <Text style={styles.statLabel}>Total Classes</Text>
              <Text style={styles.statCount}>280</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📈</Text>
              <Text style={styles.statLabel}>Classes Attended</Text>
              <Text style={styles.statCount}>229</Text>
            </View>
          </View>

          {/* TIMETABLE BANNER */}
          <TouchableOpacity
            style={styles.timeTableBanner}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("TimeTableView")}
          >
            <View style={styles.bannerLeft}>
              <View style={styles.bannerIconBox}>
                <FontAwesome5 name="calendar-alt" size={24} color="#fff" />
              </View>
              <View>
                <Text style={styles.bannerTitle}>My Timetable</Text>
                <Text style={styles.bannerSub}>
                  View today's schedule & rooms
                </Text>
              </View>
            </View>
            <View style={styles.arrowCircle}>
              <FontAwesome5 name="chevron-right" size={12} color="#1A237E" />
            </View>
          </TouchableOpacity>

          {/* Subject Wise List */}
          <Text style={styles.sectionTitle}>Subject-wise Attendance</Text>

          {subjectsData.map((subject) => (
            <View key={subject.id} style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <View>
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <Text style={styles.subjectFraction}>
                    {subject.attended} / {subject.total} classes
                  </Text>
                </View>
                <Text style={[styles.subjectPercent, { color: subject.color }]}>
                  {subject.percent}%
                </Text>
              </View>
              <AnimatedProgressBar
                percent={subject.percent}
                color={subject.color}
              />
              <View style={styles.cardFooter}>
                <Text style={styles.presentText}>
                  ✔ {subject.attended} Present
                </Text>
                <Text style={styles.absentText}>✖ {subject.absent} Absent</Text>
              </View>
            </View>
          ))}

          {/* Disclaimer Note */}
          <View style={styles.noteContainer}>
            <Text style={styles.noteTitle}>Important Note</Text>
            <Text style={styles.noteText}>
              A minimum of 75% attendance is required in each subject to be
              eligible for the final examination.
            </Text>
          </View>

          <View style={{ height: 80 }} />
        </Animated.View>
      </ScrollView>

      {/* FLOATING AI TEACHER BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AiTeacherChat")}
        activeOpacity={0.8}
      >
        <Image
          source={require("../../../assets/teacher.png")}
          style={styles.fabImage}
        />
        <Text style={styles.fabText}>Ask AI</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F5F7FA" },
  scrollContent: { padding: 20, paddingTop: 50 },
  header: { marginBottom: 25 },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1A237E",
    marginBottom: 15,
  },
  studentInfoRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  badgeText: { fontSize: 12, fontWeight: "700" },
  requiredContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  requiredLabel: { fontSize: 13, color: "#546E7A", marginRight: 6 },
  requiredValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#263238",
    backgroundColor: "#ECEFF1",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  circleOuter: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 12,
    borderColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#F1F8E9",
  },
  circleInner: { justifyContent: "center", alignItems: "center" },
  overallPercent: { fontSize: 42, fontWeight: "bold", color: "#2E7D32" },
  overallLabel: {
    fontSize: 14,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  academicYear: { fontSize: 14, color: "#78909C", marginBottom: 15 },
  statusPill: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 16,
    width: "100%",
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },
  statusTitle: {
    color: "#1B5E20",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 4,
  },
  statusSubtitle: { color: "#2E7D32", fontSize: 13 },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 18,
    borderRadius: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  statIcon: { fontSize: 24, marginBottom: 12 },
  statLabel: {
    fontSize: 12,
    color: "#90A4AE",
    fontWeight: "600",
    marginBottom: 4,
  },
  statCount: { fontSize: 24, fontWeight: "bold", color: "#37474F" },
  timeTableBanner: {
    backgroundColor: "#1A237E",
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    elevation: 5,
    shadowColor: "#1A237E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bannerLeft: { flexDirection: "row", alignItems: "center" },
  bannerIconBox: {
    width: 45,
    height: 45,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  bannerTitle: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  bannerSub: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 },
  arrowCircle: {
    width: 28,
    height: 28,
    backgroundColor: "#fff",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#263238",
    marginBottom: 16,
    marginLeft: 4,
  },
  subjectCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#37474F",
    marginBottom: 6,
    width: "80%",
  },
  subjectFraction: { fontSize: 13, color: "#90A4AE", fontWeight: "500" },
  subjectPercent: { fontSize: 20, fontWeight: "800" },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#EFF0F6",
    borderRadius: 4,
    marginBottom: 14,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 4 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between" },
  presentText: { fontSize: 13, color: "#4CAF50", fontWeight: "700" },
  absentText: { fontSize: 13, color: "#F44336", fontWeight: "700" },
  noteContainer: {
    backgroundColor: "#E1F5FE",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#039BE5",
  },
  noteTitle: {
    color: "#0277BD",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 6,
  },
  noteText: { color: "#0288D1", fontSize: 13, lineHeight: 19 },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#6200EA",
    width: 65,
    height: 65,
    borderRadius: 32.5,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
  fabImage: { width: 32, height: 32, resizeMode: "contain", marginBottom: 2 },
  fabText: { color: "white", fontSize: 8, fontWeight: "bold" },
});
