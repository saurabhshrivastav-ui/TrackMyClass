import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar
} from "react-native";
import { COLORS, SHADOW } from "../../utils/theme";
import { useResponsiveLayout } from "../../utils/responsive";

export default function FullReport({ route, navigation }) {
  const { gutter, contentMaxWidth } = useResponsiveLayout();
  // Get the data passed from the previous screen
  const { subjectData } = route.params;

  // Determine colors based on attendance percentage
  const isSafe = subjectData.percentage >= 75;
  const themeColor = isSafe ? "#2ECC71" : "#E74C3C"; // Green or Red

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      <View style={styles.container}>
        
        {/* Navigation Header */}
        <View style={[styles.reportHeader, { paddingHorizontal: gutter }]}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.reportTitle}>Report</Text>
          {/* Invisible View to balance the header title in center */}
          <View style={{ width: 50 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50, paddingHorizontal: gutter, alignItems: "center" }}
        >
          
          {/* 1. Big Circular Summary Card */}
          <View style={[styles.summaryCard, { maxWidth: contentMaxWidth }]}>
            <Text style={styles.summarySubject}>{subjectData.subject}</Text>
            <Text style={styles.summaryCode}>{subjectData.code}</Text>
            
            {/* Donut Chart Representation */}
            <View style={[styles.donutContainer, { borderColor: themeColor }]}>
               <View style={styles.innerCircle}>
                  <Text style={[styles.bigPercent, { color: themeColor }]}>
                    {subjectData.percentage}%
                  </Text>
                  <Text style={styles.statusLabel}>{isSafe ? "Safe" : "Low"}</Text>
               </View>
            </View>

            {/* Statistics Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{subjectData.totalClasses}</Text>
                <Text style={styles.statLabel}>Total Classes</Text>
              </View>
              <View style={styles.statBorder} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: "#2ECC71" }]}>
                  {subjectData.present}
                </Text>
                <Text style={styles.statLabel}>Present</Text>
              </View>
              <View style={styles.statBorder} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: "#E74C3C" }]}>
                  {subjectData.absent}
                </Text>
                <Text style={styles.statLabel}>Absent</Text>
              </View>
            </View>
          </View>

          {/* 2. Detailed History List */}
          <View style={[styles.logContainer, { maxWidth: contentMaxWidth }]}>
            <Text style={styles.sectionHeader}>Attendance Log</Text>
            
            {subjectData.history.map((log, index) => (
              <View key={index} style={styles.logRow}>
                {/* Date Box */}
                <View style={styles.logDateBox}>
                  <Text style={styles.logDateNum}>{log.date.split(" ")[0]}</Text>
                  <Text style={styles.logDateMonth}>{log.date.split(" ")[1]}</Text>
                </View>

                {/* Details */}
                <View style={styles.logDetails}>
                  <Text style={styles.logTime}>{log.time}</Text>
                  <Text style={styles.logType}>Regular Lecture</Text>
                </View>

                {/* Status Badge */}
                <View style={[
                  styles.logStatusBadge, 
                  { backgroundColor: log.status === "Present" ? "#E8F8F5" : "#FDEDEC" }
                ]}>
                  <Text style={[
                    styles.logStatusText, 
                    { color: log.status === "Present" ? "#27AE60" : "#C0392B" }
                  ]}>
                    {log.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Header Styles
  reportHeader: {
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === "android" ? 40 : 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
  },
  backText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  reportTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  // Summary Card Styles
  summaryCard: {
    backgroundColor: COLORS.surface,
    width: "100%",
    marginTop: 18,
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    ...SHADOW.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summarySubject: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  summaryCode: {
    fontSize: 14,
    color: "#888",
    marginBottom: 25,
  },
  donutContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderStyle: 'solid',
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
  },
  bigPercent: {
    fontSize: 36,
    fontWeight: "bold",
  },
  statusLabel: {
    fontSize: 14,
    color: "#999",
    textTransform: "uppercase",
    fontWeight: "600",
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#F9FAFB",
    padding: 15,
    borderRadius: 15,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  statBorder: {
    width: 1,
    height: "100%",
    backgroundColor: "#E0E0E0",
  },
  
  // Log List Styles
  logContainer: {
    width: "100%",
    marginTop: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    marginLeft: 5,
  },
  logRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    ...SHADOW.soft,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  logDateBox: {
    backgroundColor: "#F4F6F8",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 15,
    minWidth: 55,
  },
  logDateNum: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  logDateMonth: {
    fontSize: 10,
    color: "#777",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  logDetails: {
    flex: 1,
  },
  logTime: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  logType: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  logStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logStatusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});