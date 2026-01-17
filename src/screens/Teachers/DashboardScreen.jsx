import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Animated,
  StatusBar,
} from "react-native";
// ✅ Added FontAwesome5 for the Calendar Icon
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SHADOW } from "../../utils/theme";
import { getSession } from "../../utils/session";
import { fetchTeacherSubjects } from "../../utils/userApi";
import { useResponsiveLayout } from "../../utils/responsive";

// --- MOCK DATA ---
const TEACHER_CLASSES = [
  {
    id: "1",
    name: "Mathematics 101",
    time: "09:00 AM",
    totalStudents: 30,
    color: "#4facfe",
  },
  {
    id: "2",
    name: "Physics 202",
    time: "11:00 AM",
    totalStudents: 28,
    color: "#43e97b",
  },
  {
    id: "3",
    name: "Computer Science A",
    time: "01:00 PM",
    totalStudents: 35,
    color: "#fa709a",
  },
  {
    id: "4",
    name: "History 301",
    time: "03:00 PM",
    totalStudents: 22,
    color: "#fbc2eb",
  },
];

// --- COMPONENT: ANIMATED PRESSABLE CARD ---
const AnimatedCard = ({ item, index, onPress, containerStyle }) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={[styles.card, containerStyle]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.9}
      >
        <View style={styles.cardLeft}>
          {/* Gradient Icon Background */}
          <LinearGradient
            colors={[item.color, "#fff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <Ionicons name="book" size={24} color="#fff" />
          </LinearGradient>

          <View>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={12} color="#888" />
              <Text style={styles.cardSubtitle}> {item.time}</Text>
            </View>
          </View>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.totalStudents}</Text>
          <Ionicons
            name="people"
            size={12}
            color="#6200EE"
            style={{ marginLeft: 4 }}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function DashboardScreen({ navigation }) {
  const { gutter, contentMaxWidth } = useResponsiveLayout();
  const [classes, setClasses] = useState(TEACHER_CLASSES);
  const handleNavigateToAttendance = (classItem) => {
    navigation.navigate("MarkAttendance", { classData: classItem });
  };

  const handleNavigateToProfile = () => {
    navigation.navigate("TeacherProfile");
  };

  // ✅ New Handler for Timetable
  const handleNavigateToTimetable = () => {
    navigation.navigate("TimeTableView"); // Ensure this route exists in App.jsx
  };

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const session = await getSession();
        if (!session?.id) return;
        const result = await fetchTeacherSubjects(session.id);
        const mapped = (result.subjects || []).map((subject, index) => ({
          id: subject.subjectId || String(index + 1),
          name: subject.name,
          time: subject.time || "",
          totalStudents: subject.totalStudents || subject.students?.length || 0,
          color: ["#4facfe", "#43e97b", "#fa709a", "#fbc2eb"][index % 4],
          students: subject.students || [],
        }));

        if (mapped.length) setClasses(mapped);
      } catch (error) {
        console.error("Failed to load teacher classes:", error);
      } finally {
        // no-op
      }
    };

    loadClasses();
  }, []);

  // ✅ List Header Component (Contains Timetable Banner + Section Title)
  const renderHeader = () => (
    <View>
      {/* --- NEW TIMETABLE BANNER --- */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleNavigateToTimetable}
        style={styles.timetableBanner}
      >
        <LinearGradient
          colors={["#111827", "#1f2937"]} // Dark gradient matching your Timetable theme
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.timetableGradient}
        >
          <View style={styles.bannerContent}>
            <View style={styles.bannerIconBox}>
              <FontAwesome5 name="calendar-alt" size={22} color="#fff" />
            </View>
            <View>
              <Text style={styles.bannerTitle}>My Timetable</Text>
              <Text style={styles.bannerSub}>View full weekly schedule</Text>
            </View>
          </View>
          <View style={styles.arrowCircle}>
            <Ionicons name="chevron-forward" size={18} color="#111827" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Your Scheduled Classes</Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" />

      {/* --- HEADER WITH GRADIENT --- */}
      <LinearGradient
        colors={["#6200EE", "#8E2DE2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerContainer, { paddingHorizontal: gutter }]}
      >
        <SafeAreaView style={{ width: "100%" }}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerGreeting}>Good Morning,</Text>
              <Text style={styles.headerTitle}>Teacher 👋</Text>
            </View>

            <TouchableOpacity
              style={styles.profileButton}
              onPress={handleNavigateToProfile}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#FF9966", "#FF5E62"]}
                style={styles.profileGradient}
              >
                <Ionicons name="person" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* --- MAIN CONTENT --- */}
      <View style={[styles.bodyContainer, { paddingHorizontal: gutter }]}
      >
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          // ✅ Use ListHeaderComponent to scroll the banner with the list
          ListHeaderComponent={renderHeader}
          renderItem={({ item, index }) => (
            <AnimatedCard
              item={item}
              index={index}
              onPress={() => handleNavigateToAttendance(item)}
              containerStyle={{ width: "100%", maxWidth: contentMaxWidth }}
            />
          )}
          contentContainerStyle={[styles.listContent, { alignItems: "center" }]}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* --- FLOATING BOTTOM NAVBAR --- */}
      <View style={styles.floatingNavContainer}>
        <View style={styles.bottomNav}>
          {/* Home */}
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={24} color="#6200EE" />
            <Text style={[styles.navText, { color: "#6200EE" }]}>Home</Text>
          </TouchableOpacity>

          {/* Mark Attendance (Middle) */}
          <TouchableOpacity
            style={styles.fabContainer}
            onPress={() => handleNavigateToAttendance(classes[0] || TEACHER_CLASSES[0])}
            activeOpacity={0.8}
          >
            <LinearGradient colors={["#6200EE", "#B721FF"]} style={styles.fab}>
              <Ionicons name="checkmark-done" size={30} color="#fff" />
            </LinearGradient>
            <Text style={styles.fabText}>Mark Attendance</Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity
            style={styles.navItem}
            onPress={handleNavigateToProfile}
          >
            <Ionicons name="person" size={24} color="#6200EE" />
            <Text style={[styles.navText, { color: "#6200EE" }]}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F8F9FD" },

  // Header
  headerContainer: {
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 10,
    shadowColor: "#6200EE",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  headerGreeting: { color: "#E0E0E0", fontSize: 16, fontWeight: "500" },
  headerTitle: { color: "#fff", fontSize: 28, fontWeight: "800" },

  // Profile Button Styles
  profileButton: {
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  profileGradient: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
  },

  // Body
  bodyContainer: { flex: 1 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  listContent: {
    paddingTop: 20, // Add padding at top of list
    paddingBottom: 120,
  },

  // --- NEW TIMETABLE BANNER STYLES ---
  timetableBanner: {
    marginBottom: 25,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  timetableGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 20,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  bannerIconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  bannerSub: {
    color: "#9ca3af",
    fontSize: 12,
    marginTop: 2,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  // Modern Card
  card: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...SHADOW.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardLeft: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  timeContainer: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  cardSubtitle: { color: COLORS.textMuted, fontSize: 13, fontWeight: "500" },

  badge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  badgeText: { color: COLORS.primary, fontSize: 14, fontWeight: "700" },

  // Floating Bottom Nav Dock
  floatingNavContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 35,
    ...SHADOW.card,
  },
  navItem: { alignItems: "center", justifyContent: "center" },
  navText: { fontSize: 10, fontWeight: "600", marginTop: 4, color: COLORS.textMuted },

  // FAB (Floating Action Button) in Middle
  fabContainer: {
    top: -30,
    alignItems: "center",
    shadowColor: "#6200EE",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6200EE",
    marginTop: 6,
    textAlign: "center",
    width: 100,
  },
});
