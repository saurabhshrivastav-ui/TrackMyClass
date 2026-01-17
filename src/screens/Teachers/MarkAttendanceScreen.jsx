// MarkAttendanceScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Switch, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo vector icons

const MOCK_STUDENTS = [
  { id: 's1', name: 'Alice Johnson', rollNo: '101' },
  { id: 's2', name: 'Bob Smith', rollNo: '102' },
  { id: 's3', name: 'Charlie Davis', rollNo: '103' },
  { id: 's4', name: 'Diana Evans', rollNo: '104' },
  { id: 's5', name: 'Ethan Hunt', rollNo: '105' },
];

export default function MarkAttendanceScreen({ route, navigation }) {
  const { classData } = route.params;
  const [attendance, setAttendance] = useState({});

  // Default all students to 'Present' (true)
  useEffect(() => {
    const initialStatus = {};
    MOCK_STUDENTS.forEach(s => initialStatus[s.id] = true);
    setAttendance(initialStatus);
  }, []);

  // --- BULK ACTION LOGIC ---
  const markAll = (status) => {
    const newStatus = {};
    MOCK_STUDENTS.forEach(s => newStatus[s.id] = status);
    setAttendance(newStatus);
  };

  // Check current state for Radio Button UI
  const allPresent = MOCK_STUDENTS.every(s => attendance[s.id] === true);
  const allAbsent = MOCK_STUDENTS.every(s => attendance[s.id] === false);

  // --- INDIVIDUAL TOGGLE ---
  const toggleSwitch = (id) => {
    setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = () => {
    const presentCount = Object.values(attendance).filter(status => status).length;
    const absentCount = MOCK_STUDENTS.length - presentCount;

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
            total: MOCK_STUDENTS.length 
          }) 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.headerBarText}>{classData.name}</Text>
        <Text style={styles.dateText}>{new Date().toDateString()}</Text>
      </View>

      {/* --- NEW: BULK ACTION RADIO BUTTONS --- */}
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

      <FlatList
        data={MOCK_STUDENTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.studentRow}>
            <View>
              <Text style={styles.studentName}>{item.name}</Text>
              <Text style={styles.rollNo}>Roll No: {item.rollNo}</Text>
            </View>
            <View style={styles.statusContainer}>
              <Text style={[
                styles.statusText, 
                { color: attendance[item.id] ? '#4CAF50' : '#F44336' }
              ]}>
                {attendance[item.id] ? 'Present' : 'Absent'}
              </Text>
              <Switch
                trackColor={{ false: "#ffcccb", true: "#d1e7dd" }}
                thumbColor={attendance[item.id] ? "#4CAF50" : "#F44336"}
                onValueChange={() => toggleSwitch(item.id)}
                value={attendance[item.id]}
              />
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Attendance</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  headerBar: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerBarText: { fontSize: 20, fontWeight: 'bold', color: '#6200EE' },
  dateText: { color: '#666', marginTop: 4 },

  // --- NEW BULK ACTION STYLES ---
  bulkActionContainer: {
    backgroundColor: 'white',
    padding: 15,
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
  },
  bulkTitle: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 10 },
  radioGroup: { flexDirection: 'row', justifyContent: 'space-between' },
  radioButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#ddd',
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
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 8,
    elevation: 1,
  },
  studentName: { fontSize: 16, fontWeight: '500', color: '#333' },
  rollNo: { fontSize: 12, color: '#888' },
  statusContainer: { alignItems: 'flex-end' },
  statusText: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  submitButton: {
    backgroundColor: '#6200EE',
    margin: 16,
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});