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
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";

// --- Enable Layout Animations ---
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Theme ---
const COLORS = {
  primary: "#4f46e5", // Indigo
  secondary: "#ec4899", // Pink
  bg: "#111827", // Dark BG
  contentBg: "#f3f4f6", // Light Content
  textDark: "#1f2937",
  textLight: "#6b7280",
  white: "#ffffff",
  inputBg: "#e5e7eb",
  danger: "#ef4444",
};

const CLASSES = ["Class 10-A", "Class 10-B", "Class 11-A", "Class 12-B"];
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// --- Mock Data Structure ---
const INITIAL_DATA = {
  "Class 10-A": {
    Monday: [
      {
        id: 1,
        start: "09:00",
        end: "10:00",
        subject: "Maths",
        teacher: "Dr. Wilson",
        room: "101",
      },
      {
        id: 2,
        start: "10:00",
        end: "11:00",
        subject: "Physics",
        teacher: "Mr. Carter",
        room: "Lab 2",
      },
    ],
    Tuesday: [],
  },
  // ... other classes would be here
};

// --- Sub-Components ---

const SelectorPill = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.pill, isActive && styles.pillActive]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const SlotCard = ({ data, onEdit, onDelete }) => (
  <View style={styles.card}>
    <View style={styles.cardLeft}>
      <Text style={styles.timeText}>{data.start}</Text>
      <View style={styles.timeConnector} />
      <Text style={styles.timeText}>{data.end}</Text>
    </View>

    <View style={styles.cardCenter}>
      <Text style={styles.subjectText}>{data.subject}</Text>
      <View style={styles.metaRow}>
        <FontAwesome5 name="user-tie" size={12} color={COLORS.textLight} />
        <Text style={styles.metaText}>{data.teacher}</Text>
      </View>
      <View style={styles.metaRow}>
        <FontAwesome5
          name="map-marker-alt"
          size={12}
          color={COLORS.textLight}
        />
        <Text style={styles.metaText}>Room {data.room}</Text>
      </View>
    </View>

    <View style={styles.cardRight}>
      <TouchableOpacity
        onPress={onEdit}
        style={[styles.actionBtn, { backgroundColor: "#e0e7ff" }]}
      >
        <FontAwesome5 name="pen" size={14} color={COLORS.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onDelete}
        style={[styles.actionBtn, { backgroundColor: "#fee2e2" }]}
      >
        <FontAwesome5 name="trash" size={14} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  </View>
);

const EditModal = ({ visible, onClose, onSave, initialData }) => {
  const [form, setForm] = useState({
    start: "",
    end: "",
    subject: "",
    teacher: "",
    room: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ start: "", end: "", subject: "", teacher: "", room: "" });
  }, [initialData, visible]);

  const handleSave = () => {
    if (!form.subject || !form.start)
      return Alert.alert("Error", "Subject and Start Time are required.");
    onSave({ ...form, id: initialData?.id || Date.now() });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {initialData ? "Edit Slot" : "Add New Slot"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome5 name="times" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Start Time</Text>
              <TextInput
                style={styles.input}
                placeholder="09:00"
                value={form.start}
                onChangeText={(t) => setForm({ ...form, start: t })}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>End Time</Text>
              <TextInput
                style={styles.input}
                placeholder="10:00"
                value={form.end}
                onChangeText={(t) => setForm({ ...form, end: t })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mathematics"
              value={form.subject}
              onChangeText={(t) => setForm({ ...form, subject: t })}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 2, marginRight: 10 }]}>
              <Text style={styles.label}>Teacher</Text>
              <TextInput
                style={styles.input}
                placeholder="Mr. Name"
                value={form.teacher}
                onChangeText={(t) => setForm({ ...form, teacher: t })}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Room</Text>
              <TextInput
                style={styles.input}
                placeholder="101"
                value={form.room}
                onChangeText={(t) => setForm({ ...form, room: t })}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Save Slot</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// --- Main Screen ---

const TimeTableGenerator = ({ navigation }) => {
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [schedule, setSchedule] = useState(INITIAL_DATA);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const animate = () =>
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

  // Get current list based on selection, safe access
  const currentList = schedule[selectedClass]?.[selectedDay] || [];

  const handleSaveSlot = (slotData) => {
    animate();
    setSchedule((prev) => {
      const classData = prev[selectedClass] || {};
      const dayData = classData[selectedDay] || [];

      let newDayData;
      if (editingItem) {
        newDayData = dayData.map((item) =>
          item.id === slotData.id ? slotData : item
        );
      } else {
        newDayData = [...dayData, slotData].sort((a, b) =>
          a.start.localeCompare(b.start)
        );
      }

      return {
        ...prev,
        [selectedClass]: {
          ...classData,
          [selectedDay]: newDayData,
        },
      };
    });
  };

  const handleDeleteSlot = (id) => {
    Alert.alert("Confirm Delete", "Remove this slot?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          animate();
          setSchedule((prev) => {
            const classData = prev[selectedClass] || {};
            const dayData = classData[selectedDay] || [];
            return {
              ...prev,
              [selectedClass]: {
                ...classData,
                [selectedDay]: dayData.filter((item) => item.id !== id),
              },
            };
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Timetable Gen</Text>
          <Text style={styles.headerSub}>Create & Manage Schedules</Text>
        </View>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="times" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Class Selector */}
        <View style={styles.selectorSection}>
          <Text style={styles.sectionLabel}>Select Class</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollRow}
          >
            {CLASSES.map((cls) => (
              <SelectorPill
                key={cls}
                label={cls}
                isActive={selectedClass === cls}
                onPress={() => {
                  animate();
                  setSelectedClass(cls);
                }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Day Selector */}
        <View style={styles.selectorSection}>
          <Text style={styles.sectionLabel}>Select Day</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollRow}
          >
            {DAYS.map((day) => (
              <SelectorPill
                key={day}
                label={day.slice(0, 3)}
                isActive={selectedDay === day}
                onPress={() => {
                  animate();
                  setSelectedDay(day);
                }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Schedule List */}
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>{selectedDay}'s Schedule</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                setEditingItem(null);
                setModalVisible(true);
              }}
            >
              <FontAwesome5 name="plus" size={12} color={COLORS.white} />
              <Text style={styles.addBtnText}>Add Slot</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.listContent}>
            {currentList.length === 0 ? (
              <View style={styles.emptyState}>
                <FontAwesome5 name="calendar-plus" size={40} color="#d1d5db" />
                <Text style={styles.emptyText}>No classes scheduled.</Text>
                <Text style={styles.emptySub}>Tap 'Add Slot' to begin.</Text>
              </View>
            ) : (
              currentList.map((slot) => (
                <SlotCard
                  key={slot.id}
                  data={slot}
                  onEdit={() => {
                    setEditingItem(slot);
                    setModalVisible(true);
                  }}
                  onDelete={() => handleDeleteSlot(slot.id)}
                />
              ))
            )}
          </ScrollView>
        </View>
      </View>

      <EditModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveSlot}
        initialData={editingItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  headerTitle: { fontSize: 24, fontWeight: "800", color: COLORS.white },
  headerSub: { color: COLORS.secondary, fontWeight: "600" },
  closeBtn: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
  },

  content: {
    flex: 1,
    backgroundColor: COLORS.contentBg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    overflow: "hidden",
  },

  // Selectors
  selectorSection: { marginBottom: 15 },
  sectionLabel: {
    marginLeft: 20,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textLight,
    textTransform: "uppercase",
  },
  scrollRow: { paddingHorizontal: 20, paddingBottom: 10 },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
  },
  pillActive: { backgroundColor: COLORS.primary, elevation: 5 },
  pillText: { fontWeight: "600", color: COLORS.textLight },
  pillTextActive: { color: COLORS.white, fontWeight: "bold" },

  // List
  listContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    elevation: 5,
    overflow: "hidden",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inputBg,
  },
  listTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textDark },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.textDark,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addBtnText: {
    color: COLORS.white,
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 12,
  },
  listContent: { padding: 20, paddingBottom: 50 },

  // Card
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    marginBottom: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.inputBg,
    padding: 15,
    elevation: 2,
  },
  cardLeft: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 15,
    borderRightWidth: 1,
    borderRightColor: COLORS.inputBg,
    minWidth: 70,
  },
  timeText: { fontSize: 12, fontWeight: "700", color: COLORS.textDark },
  timeConnector: {
    height: 15,
    width: 2,
    backgroundColor: COLORS.secondary,
    marginVertical: 4,
  },
  cardCenter: { flex: 1, paddingLeft: 15, justifyContent: "center" },
  subjectText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  metaText: {
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: 6,
    fontWeight: "500",
  },
  cardRight: { justifyContent: "space-between", paddingLeft: 10 },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },

  // Empty
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    opacity: 0.6,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  emptySub: { fontSize: 13, color: COLORS.textLight },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textDark },
  row: { flexDirection: "row" },
  inputGroup: { marginBottom: 15 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textLight,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: COLORS.inputBg,
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: "500",
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  saveBtnText: { color: COLORS.white, fontWeight: "bold", fontSize: 16 },
});

export default TimeTableGenerator;
