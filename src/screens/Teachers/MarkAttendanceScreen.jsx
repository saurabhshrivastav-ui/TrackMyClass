// MarkAttendanceScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Switch, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo vector icons
import { COLORS, SHADOW } from "../../utils/theme";
import { useResponsiveLayout } from "../../utils/responsive";

export default function MarkAttendanceScreen({ route, navigation }) {
  const { gutter, contentMaxWidth } = useResponsiveLayout();
  const { classData } = route.params;
  const [attendance, setAttendance] = useState({});
  const [students, setStudents] = useState([]);

  // Default all students to 'Present' (true)
  useEffect(() => {
    const currentStudents = classData?.students || [];
    setStudents(currentStudents);

    const initialStatus = {};
    currentStudents.forEach((s) => {
      const key = s.studentId || s.id;
      if (key) initialStatus[key] = true;
    });
    setAttendance(initialStatus);
  }, [classData]);

  // --- BULK ACTION LOGIC ---
  const markAll = (status) => {
    const newStatus = {};
    students.forEach((s) => {
      const key = s.studentId || s.id;
      if (key) newStatus[key] = status;
    });
    setAttendance(newStatus);
  };

  // Check current state for Radio Button UI
  const allPresent = students.length > 0 && students.every((s) => attendance[s.studentId || s.id] === true);
  const allAbsent = students.length > 0 && students.every((s) => attendance[s.studentId || s.id] === false);

  // --- INDIVIDUAL TOGGLE ---
  const toggleSwitch = (id) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = () => {
    const presentCount = Object.values(attendance).filter((status) => status).length;
    const absentCount = students.length - presentCount;

    Alert.alert(
      "Confirm Submission",
      `Present: ${presentCount}\nAbsent: ${absentCount}`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Submit", 
          onPress: () => navigation.navigate('SuccessSummary', { 
            className: classData.name, 
            present: presentCount, 
            total: students.length 
          }) 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.page, { paddingHorizontal: gutter, maxWidth: contentMaxWidth }]}>
        <View style={styles.headerBar}>
          <Text style={styles.headerBarText}>{classData.name}</Text>
          <Text style={styles.dateText}>{new Date().toDateString()}</Text>
        </View>

        {/* --- BULK ACTION RADIO BUTTONS --- */}
        <View style={styles.bulkActionContainer}>
          <Text style={styles.bulkTitle}>Quick Actions:</Text>
          <View style={styles.radioGroup}>
            {/* Mark All Present Radio */}
            <TouchableOpacity 
              style={[styles.radioButton, allPresent && styles.radioSelectedPresent]} 
              onPress={() => markAll(true)}
            >
              <Ionicons 
                name={allPresent ? "radio-button-on" : "radio-button-off"} 
                size={20} 
                color={allPresent ? "#4CAF50" : "#666"} 
              />
              <Text style={[styles.radioText, allPresent && { color: '#4CAF50' }]}>All Present</Text>
            </TouchableOpacity>

            {/* Mark All Absent Radio */}
            <TouchableOpacity 
              style={[styles.radioButton, allAbsent && styles.radioSelectedAbsent]} 
              onPress={() => markAll(false)}
            >
              <Ionicons 
                name={allAbsent ? "radio-button-on" : "radio-button-off"} 
                size={20} 
                color={allAbsent ? "#F44336" : "#666"} 
              />
              <Text style={[styles.radioText, allAbsent && { color: '#F44336' }]}>All Absent</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.studentId || item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingHorizontal: gutter, alignItems: "center" },
        ]}
        renderItem={({ item }) => (
          <View style={[styles.studentRow, { maxWidth: contentMaxWidth }]}>
            <View>
              <Text style={styles.studentName}>{item.name}</Text>
              <Text style={styles.rollNo}>Roll No: {item.rollNo || "--"}</Text>
            </View>
            <View style={styles.statusContainer}>
              <Text style={[
                styles.statusText, 
                { color: attendance[item.studentId || item.id] ? '#4CAF50' : '#F44336' }
              ]}>
                {attendance[item.studentId || item.id] ? 'Present' : 'Absent'}
              </Text>
              <Switch
                trackColor={{ false: "#ffcccb", true: "#d1e7dd" }}
                thumbColor={attendance[item.studentId || item.id] ? "#4CAF50" : "#F44336"}
                onValueChange={() => toggleSwitch(item.studentId || item.id)}
                value={attendance[item.studentId || item.id]}
              />
            </View>
          </View>
        )}
      />

      <View style={{ paddingHorizontal: gutter, paddingBottom: 12 }}>
        <TouchableOpacity
          style={[styles.submitButton, { maxWidth: contentMaxWidth, alignSelf: "center" }]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit Attendance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  page: { width: "100%" },
  headerBar: { paddingVertical: 16, backgroundColor: COLORS.surface, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerBarText: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  dateText: { color: COLORS.textMuted, marginTop: 4 },

  // --- NEW BULK ACTION STYLES ---
  bulkActionContainer: {
    backgroundColor: COLORS.surface,
    padding: 15,
    marginTop: 10,
    borderRadius: 12,
    ...SHADOW.soft,
  },
  bulkTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMuted, marginBottom: 10 },
  radioGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  radioButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: COLORS.border,
    width: '48%',
    justifyContent: 'center'
  },
  radioSelectedPresent: { borderColor: '#4CAF50', backgroundColor: '#e8f5e9' },
  radioSelectedAbsent: { borderColor: '#F44336', backgroundColor: '#ffebee' },
  radioText: { marginLeft: 8, fontWeight: '600', color: '#555' },

  // List Styles
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    marginTop: 10,
    borderRadius: 8,
    ...SHADOW.soft,
  },
  listContent: { paddingBottom: 120 },
  studentName: { fontSize: 16, fontWeight: '500', color: COLORS.text },
  rollNo: { fontSize: 12, color: COLORS.textMuted },
  statusContainer: { alignItems: 'flex-end' },
  statusText: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});