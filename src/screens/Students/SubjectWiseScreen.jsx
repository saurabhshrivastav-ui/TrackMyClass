import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  StatusBar,
  SafeAreaView,
} from "react-native";
// 1. Import Navigation Hook
import { useNavigation } from "@react-navigation/native";

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- MOCK DATA (Updated with stats for the Report Page) ---
const SUBJECT_DATA = [
  {
    id: 1,
    subject: "Mathematics",
    code: "MTH101",
    percentage: 92,
    totalClasses: 45,
    present: 41,
    absent: 4,
    history: [
      { date: "28 Dec", status: "Present", time: "10:00 AM" },
      { date: "27 Dec", status: "Present", time: "10:00 AM" },
      { date: "26 Dec", status: "Absent", time: "10:00 AM" },
      { date: "24 Dec", status: "Present", time: "09:00 AM" },
    ],
  },
  {
    id: 2,
    subject: "Data Structures",
    code: "CS201",
    percentage: 85,
    totalClasses: 40,
    present: 34,
    absent: 6,
    history: [
      { date: "28 Dec", status: "Present", time: "02:00 PM" },
      { date: "27 Dec", status: "Present", time: "02:00 PM" },
      { date: "25 Dec", status: "Present", time: "01:00 PM" },
    ],
  },
  {
    id: 3,
    subject: "Database Mgmt",
    code: "IT305",
    percentage: 65,
    totalClasses: 30,
    present: 19,
    absent: 11,
    history: [
      { date: "28 Dec", status: "Absent", time: "11:00 AM" },
      { date: "27 Dec", status: "Absent", time: "11:00 AM" },
      { date: "26 Dec", status: "Present", time: "12:00 PM" },
    ],
  },
  {
    id: 4,
    subject: "English Comm.",
    code: "ENG101",
    percentage: 88,
    totalClasses: 25,
    present: 22,
    absent: 3,
    history: [
      { date: "25 Dec", status: "Present", time: "09:00 AM" },
      { date: "24 Dec", status: "Present", time: "09:00 AM" },
    ],
  },
];

// --- COMPONENTS ---

// 1. The Expandable Card Component
const SubjectCard = ({ item, index }) => {
  const [expanded, setExpanded] = useState(false);
  // 2. Initialize Navigation
  const navigation = useNavigation();

  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const isSafe = item.percentage >= 75;
  const barColor = isSafe ? "#2ECC71" : "#E74C3C";
  const badgeColor = isSafe ? "#E8F8F5" : "#FDEDEC";

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={toggleExpand}
        style={styles.cardHeader}
      >
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: badgeColor }]}>
            <Text style={styles.iconText}>{item.subject.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.subjectName}>{item.subject}</Text>
            <Text style={styles.subjectCode}>{item.code}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Text style={[styles.percentageText, { color: barColor }]}>
            {item.percentage}%
          </Text>
          <Text style={styles.chevron}>{expanded ? "▲" : "▼"}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${item.percentage}%`, backgroundColor: barColor },
          ]}
        />
      </View>

      {expanded && (
        <View style={styles.dropdownBody}>
          <View style={styles.divider} />
          <Text style={styles.historyTitle}>Recent Activity</Text>

          {item.history.map((log, i) => (
            <View key={i} style={styles.historyRow}>
              <View style={styles.historyLeft}>
                <Text style={styles.dateText}>{log.date}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      log.status === "Present" ? "#E8F8F5" : "#FDEDEC",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: log.status === "Present" ? "#27AE60" : "#C0392B",
                    },
                  ]}
                >
                  {log.status === "Present" ? "● Present" : "● Absent"}
                </Text>
              </View>
            </View>
          ))}

          {/* 3. ADD NAVIGATION ON PRESS HERE */}
          <TouchableOpacity
            style={styles.viewMoreBtn}
            onPress={() =>
              navigation.navigate("FullReport", { subjectData: item })
            }
          >
            <Text style={styles.viewMoreText}>View Full Report →</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};

// 2. Main Screen
export default function SubjectWiseScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />

      <View style={styles.container}>
        <View style={styles.headerBackground}>
          <Text style={styles.headerTitle}>Attendance</Text>
          <Text style={styles.headerSubtitle}>Subject-wise Breakdown</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {SUBJECT_DATA.map((item, index) => (
            <SubjectCard key={item.id} item={item} index={index} />
          ))}

          <View style={{ height: 50 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4A90E2",
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F7FC",
  },
  headerBackground: {
    backgroundColor: "#4A90E2",
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },

  // Card Styles
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  iconText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
  },
  subjectName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subjectCode: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  percentageText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chevron: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 4,
  },

  // Progress Bar
  progressBarBg: {
    height: 4,
    backgroundColor: "#F0F0F0",
    width: "100%",
  },
  progressBarFill: {
    height: "100%",
  },

  // Dropdown Body
  dropdownBody: {
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginVertical: 15,
  },
  historyTitle: {
    fontSize: 12,
    color: "#AAA",
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  viewMoreBtn: {
    marginTop: 5,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#F0F4FF",
    borderRadius: 8,
  },
  viewMoreText: {
    color: "#4A90E2",
    fontSize: 13,
    fontWeight: "bold",
  },
});
