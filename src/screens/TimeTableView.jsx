import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { useResponsiveLayout } from "../utils/responsive";

// --- Enable Animations ---
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Theme ---
const COLORS = {
  primary: "#4f46e5",
  secondary: "#ec4899",
  bg: "#111827", // Dark Background
  contentBg: "#f3f4f6", // Light Content
  textDark: "#111827",
  textLight: "#6b7280",
  success: "#10b981",
  warning: "#f59e0b",
  card: "#ffffff",
  inputBg: "#e5e7eb",
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// --- Mock Data (Connected Structure) ---
const SCHEDULE_DATA = {
  "Mon": [
    { id: 1, startTime: "09:00", endTime: "10:00", subject: "Mathematics", teacher: "Dr. Wilson", room: "Room 101", status: "completed" },
    { id: 2, startTime: "10:00", endTime: "11:00", subject: "Physics", teacher: "Mr. Carter", room: "Lab 2", status: "live" },
    { id: 3, startTime: "11:30", endTime: "12:30", subject: "Chemistry", teacher: "Ms. Davis", room: "Lab 1", status: "upcoming" },
    { id: 4, startTime: "01:30", endTime: "02:30", subject: "English", teacher: "Mrs. Green", room: "Room 104", status: "upcoming" },
  ],
  "Tue": [
    { id: 1, startTime: "09:00", endTime: "10:30", subject: "Computer Sci", teacher: "Mr. Tech", room: "Comp Lab", status: "upcoming" },
    { id: 2, startTime: "10:45", endTime: "12:00", subject: "History", teacher: "Mr. Oldman", room: "Room 202", status: "upcoming" },
  ],
  // Add other days as needed...
};

// --- Components ---

const DaySelector = ({ activeDay, onSelect, gutter }) => (
  <View style={styles.daySelectorContainer}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.dayScroll, { paddingHorizontal: gutter }]}
    >
      {DAYS.map((day) => {
        const isActive = activeDay === day;
        return (
          <TouchableOpacity
            key={day}
            onPress={() => onSelect(day)}
            style={[styles.dayTab, isActive && styles.dayTabActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.dayText, isActive && styles.dayTextActive]}>{day}</Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);

const TimelineCard = ({ data, isLast }) => {
  const isLive = data.status === "live";
  const isDone = data.status === "completed";

  return (
    <View style={styles.timelineRow}>
      {/* Left Time Column */}
      <View style={styles.timeCol}>
        <Text style={[styles.timeText, isLive && { color: COLORS.primary }]}>{data.startTime}</Text>
        <Text style={styles.meridiem}>AM</Text>
      </View>

      {/* Center Line Graphics */}
      <View style={styles.lineCol}>
        <View style={[
            styles.dot, 
            isLive ? styles.dotLive : isDone ? styles.dotDone : styles.dotUpcoming
        ]} />
        {!isLast && <View style={styles.line} />}
      </View>

      {/* Right Content Card */}
      <View style={styles.cardCol}>
        <View style={[
            styles.card, 
            isLive && styles.cardLive,
            isDone && styles.cardDone
        ]}>
          {isLive && (
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>HAPPENING NOW</Text>
            </View>
          )}
          
          <View style={styles.cardHeader}>
            <Text style={[styles.subject, isLive && {color: '#fff'}, isDone && {color: COLORS.textLight}]}>
                {data.subject}
            </Text>
            <View style={styles.roomBadge}>
                <FontAwesome5 name="map-marker-alt" size={10} color={isLive ? "#fff" : COLORS.textLight} />
                <Text style={[styles.roomText, isLive && {color: '#fff'}]}>{data.room}</Text>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.teacherRow}>
                <FontAwesome5 name="user-tie" size={12} color={isLive ? "rgba(255,255,255,0.8)" : COLORS.primary} />
                <Text style={[styles.teacher, isLive && {color: "rgba(255,255,255,0.9)"}, isDone && {color: COLORS.textLight}]}>
                    {data.teacher}
                </Text>
            </View>
            <Text style={[styles.duration, isLive && {color: "rgba(255,255,255,0.8)"}]}>
                {data.startTime} - {data.endTime}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// --- Main Screen ---

const TimeTableView = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { gutter, contentMaxWidth } = useResponsiveLayout();
  const [selectedDay, setSelectedDay] = useState("Mon");
  const [schedule, setSchedule] = useState(SCHEDULE_DATA["Mon"]);

  const handleDayChange = (day) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedDay(day);
    setSchedule(SCHEDULE_DATA[day] || []);
  };

  const todayDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Header */}
      <View style={[styles.header, { marginTop: insets.top, paddingHorizontal: gutter }]}>
        <View>
            <Text style={styles.headerDate}>{todayDate}</Text>
            <Text style={styles.headerTitle}>My Schedule</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.goBack()}>
            <FontAwesome5 name="times" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentBody}>
        
        {/* Day Selector */}
        <DaySelector activeDay={selectedDay} onSelect={handleDayChange} gutter={gutter} />

        {/* Timeline List */}
        <ScrollView 
            style={styles.scrollList} 
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal: gutter, maxWidth: contentMaxWidth, alignSelf: "center" }]}
            showsVerticalScrollIndicator={false}
        >
            {schedule.length > 0 ? (
                schedule.map((item, index) => (
                    <TimelineCard 
                        key={item.id} 
                        data={item} 
                        isLast={index === schedule.length - 1} 
                    />
                ))
            ) : (
                <View style={styles.emptyState}>
                    <FontAwesome5 name="mug-hot" size={40} color={COLORS.textLight} />
                    <Text style={styles.emptyText}>No classes scheduled for {selectedDay}</Text>
                    <Text style={styles.emptySub}>Enjoy your free time!</Text>
                </View>
            )}
        </ScrollView>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingHorizontal: 25,
    paddingBottom: 25,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerDate: {
    color: COLORS.secondary,
    fontWeight: "600",
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
  },
  profileBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentBody: {
    flex: 1,
    backgroundColor: COLORS.contentBg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  
  // Day Selector
  daySelectorContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  dayScroll: {
    paddingHorizontal: 0,
    gap: 15,
  },
  dayTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.inputBg,
  },
  dayTabActive: {
    backgroundColor: COLORS.bg,
    elevation: 5,
  },
  dayText: {
    fontWeight: "700",
    color: COLORS.textLight,
  },
  dayTextActive: {
    color: "#fff",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.secondary,
    marginTop: 4,
  },

  // Timeline
  scrollList: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 22,
    paddingBottom: 50,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 100,
  },
  timeCol: {
    width: 50,
    alignItems: 'flex-end',
    paddingTop: 10,
  },
  timeText: {
    fontWeight: "800",
    fontSize: 14,
    color: COLORS.textDark,
  },
  meridiem: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  lineCol: {
    width: 40,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
    marginTop: 14,
    zIndex: 10,
  },
  dotLive: {
    backgroundColor: COLORS.secondary,
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 12,
    shadowColor: COLORS.secondary,
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  dotDone: {
    backgroundColor: COLORS.textLight,
  },
  dotUpcoming: {
    backgroundColor: COLORS.primary,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 5,
  },
  cardCol: {
    flex: 1,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardLive: {
    backgroundColor: COLORS.primary,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  cardDone: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 0,
  },
  liveBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  liveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: "bold",
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingRight: 20, // space for badge
  },
  subject: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  roomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  roomText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teacher: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  duration: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "500",
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    opacity: 0.6,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  emptySub: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default TimeTableView;