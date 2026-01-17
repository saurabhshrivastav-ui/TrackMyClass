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
import { getSession } from "../../utils/session";
import { COLORS, RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "../../utils/theme";
import { fetchStudentOverview } from "../../utils/attendanceApi";
import { useResponsiveLayout } from "../../utils/responsive";

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
  const { gutter, contentMaxWidth, isTablet, isDesktop } = useResponsiveLayout();
  const [userData, setUserData] = useState({
    name: "Saurabh Shrivastav",
    id: "CS2024001",
    semester: "6th Semester",
  });
  const [subjects, setSubjects] = useState([]);
  const [stats, setStats] = useState({ totalClasses: 0, attended: 0, overallPercent: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // SECURE SESSION LOADING
    const loadSession = async () => {
      try {
        const savedUser = await getSession();
        if (savedUser) setUserData(savedUser);

        const studentId = savedUser?.id || userData.id;
        const overview = await fetchStudentOverview(studentId);
        setUserData(overview.student);
        setSubjects(overview.subjects || []);
        setStats(overview.stats || { totalClasses: 0, attended: 0, overallPercent: 0 });
      } catch (error) {
        setError(error.message || "Failed to load data");
        console.error("Could not load secure session:", error);
      } finally {
        setLoading(false);
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
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: gutter }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.page,
            {
              maxWidth: contentMaxWidth,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
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
                <Text style={styles.overallPercent}>{stats.overallPercent}%</Text>
                <Text style={styles.overallLabel}>Overall</Text>
              </View>
            </View>
            <Text style={styles.academicYear}>Academic Year 2024-25</Text>

            <View style={styles.statusPill}>
              <Text style={styles.statusTitle}>
                Status: {stats.overallPercent >= 75 ? "Excellent" : "Low"}
              </Text>
              <Text style={styles.statusSubtitle}>
                {stats.overallPercent >= 75
                  ? "Your attendance is above the required threshold"
                  : "Your attendance is below the required threshold"}
              </Text>
            </View>
          </View>

          {/* Stats Cards Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📅</Text>
              <Text style={styles.statLabel}>Total Classes</Text>
              <Text style={styles.statCount}>{stats.totalClasses}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📈</Text>
              <Text style={styles.statLabel}>Classes Attended</Text>
              <Text style={styles.statCount}>{stats.attended}</Text>
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

          {loading && <Text style={styles.loadingText}>Loading attendance...</Text>}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {!loading && !error && subjects.length === 0 && (
            <Text style={styles.emptyText}>No attendance data available.</Text>
          )}

          <View style={styles.subjectGrid}>
            {subjects.map((subject, index) => (
              <View
                key={`${subject.name}-${index}`}
                style={[
                  styles.subjectCard,
                  (isTablet || isDesktop) && styles.subjectCardWide,
                ]}
              >
                <View style={styles.subjectHeader}>
                  <View style={styles.subjectHeaderLeft}>
                    <Text style={styles.subjectName} numberOfLines={1}>
                      {subject.name}
                    </Text>
                    <Text style={styles.subjectFraction}>
                      {subject.attended} / {subject.total} classes
                    </Text>
                  </View>
                  <Text style={[styles.subjectPercent, { color: subject.color }]}>
                    {subject.percent}%
                  </Text>
                </View>
                <AnimatedProgressBar percent={subject.percent} color={subject.color} />
                <View style={styles.cardFooter}>
                  <Text style={styles.presentText}>✔ {subject.attended} Present</Text>
                  <Text style={styles.absentText}>✖ {subject.absent} Absent</Text>
                </View>
              </View>
            ))}
          </View>

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
  mainContainer: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    alignItems: "center",
  },
  page: { width: "100%" },
  header: { marginBottom: 25 },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    fontSize: 26,
    marginBottom: SPACING.md,
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
  requiredLabel: { fontSize: 13, color: COLORS.textMuted, marginRight: 6 },
  requiredValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.text,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  chartContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SPACING.lg,
    alignItems: "center",
    marginBottom: 24,
    ...SHADOW.card,
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
    gap: 12,
    flexWrap: "wrap",
    marginBottom: SPACING.lg,
  },
  statCard: {
    backgroundColor: COLORS.surface,
    width: "48%",
    padding: 18,
    borderRadius: 20,
    ...SHADOW.soft,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    ...TYPOGRAPHY.h2,
    fontSize: 20,
    marginBottom: SPACING.md,
  },
  subjectGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  subjectCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    ...SHADOW.soft,
    width: "100%",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  subjectCardWide: {
    width: "48%",
  },
  subjectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  subjectHeaderLeft: { flex: 1, paddingRight: 12 },
  subjectName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#37474F",
    marginBottom: 6,
  },
  subjectFraction: { fontSize: 13, color: "#90A4AE", fontWeight: "500" },
  subjectPercent: { fontSize: 20, fontWeight: "800" },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 14,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 4 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between" },
  presentText: { fontSize: 13, color: "#4CAF50", fontWeight: "700" },
  absentText: { fontSize: 13, color: "#F44336", fontWeight: "700" },
  loadingText: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 12,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 13,
    color: COLORS.danger,
    marginBottom: 12,
    marginLeft: 4,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 12,
    marginLeft: 4,
  },
  noteContainer: {
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  noteTitle: {
    color: COLORS.info,
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 6,
  },
  noteText: { color: COLORS.info, fontSize: 13, lineHeight: 19 },
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
