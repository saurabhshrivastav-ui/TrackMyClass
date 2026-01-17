import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  Share,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { clearSession } from "../../utils/session";
import { useResponsiveLayout } from "../../utils/responsive";

// --- Enable Layout Animations ---
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Colors & Theme ---
const COLORS = {
  primary: "#4f46e5", // Indigo 600
  secondary: "#ec4899", // Pink 500
  bg: "#111827",
  contentBg: "#f3f4f6",
  textDark: "#111827",
  textLight: "#6b7280",
  success: "#10b981",
  danger: "#ef4444",
  warning: "#f59e0b",
  inputBg: "#e5e7eb",
};

// --- Constants ---
const CLASSES_LIST = ["Class 10-A", "Class 10-B", "Class 11-A", "Class 12-B"];
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// --- Sub-Components ---

// 1. Sidebar Menu Item
const MenuItem = ({ icon, label, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.menuItem, isActive && styles.menuItemActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View
      style={[
        styles.menuIconBox,
        isActive && { backgroundColor: "rgba(255,255,255,0.2)" },
      ]}
    >
      <FontAwesome5
        name={icon}
        size={18}
        color={isActive ? "#fff" : "#94a3b8"}
      />
    </View>
    <Text
      style={[
        styles.menuText,
        isActive && { color: "#fff", fontWeight: "700" },
      ]}
    >
      {label}
    </Text>
    {isActive && <View style={styles.activeIndicator} />}
  </TouchableOpacity>
);

// 2. Stat Card
const StatCard = ({ title, count, icon, bgColor, iconColor, onPress }) => {
  const scaleVal = useRef(new Animated.Value(1)).current;
  const onPressIn = () =>
    Animated.spring(scaleVal, { toValue: 0.95, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scaleVal, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
    }).start();

  return (
    <Animated.View
      style={[styles.statCard, { transform: [{ scale: scaleVal }] }]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statCount}>{count}</Text>
        </View>
        <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
          <FontAwesome5 name={icon} size={22} color={iconColor} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// 3. Generic List Item
const ListItem = ({ name, subtitle, status, onEdit, onDelete }) => (
  <View style={styles.listItem}>
    <View style={styles.listIconContainer}>
      <Text style={styles.listInitials}>{name.charAt(0)}</Text>
    </View>
    <View style={styles.listInfo}>
      <Text style={styles.listName}>{name}</Text>
      <Text style={styles.listSubtitle}>{subtitle}</Text>
    </View>
    <View style={{ alignItems: "flex-end", gap: 5 }}>
      <View
        style={[
          styles.statusBadge,
          status === "Active" ? styles.statusActive : styles.statusInactive,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            status === "Active" ? { color: "#065f46" } : { color: "#991b1b" },
          ]}
        >
          {status}
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#e0e7ff" }]}
          onPress={onEdit}
        >
          <FontAwesome5 name="pen" size={12} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: "#fee2e2" }]}
          onDelete={onDelete}
        >
          <FontAwesome5 name="trash" size={12} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// 4. Accordion
const GroupAccordion = ({ title, count, children, onToggle }) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => {
    onToggle();
    setExpanded(!expanded);
  };

  return (
    <View
      style={[styles.groupContainer, expanded && styles.groupContainerExpanded]}
    >
      <TouchableOpacity
        style={styles.groupHeader}
        onPress={toggleExpand}
        activeOpacity={0.8}
      >
        <View style={styles.groupHeaderLeft}>
          <View
            style={[
              styles.chevronBox,
              expanded && { backgroundColor: COLORS.primary },
            ]}
          >
            <FontAwesome5
              name={expanded ? "chevron-down" : "chevron-right"}
              size={12}
              color={expanded ? "#fff" : COLORS.primary}
            />
          </View>
          <Text style={styles.groupTitle}>{title}</Text>
        </View>
        <View style={styles.groupBadge}>
          <Text style={styles.groupBadgeText}>{count} Items</Text>
        </View>
      </TouchableOpacity>
      {expanded && <View style={styles.groupContent}>{children}</View>}
    </View>
  );
};

// 5. Time Slot Card
const TimeSlotCard = ({ data, onEdit, onDelete }) => {
  return (
    <View style={styles.slotCardInner}>
      <View style={styles.timeColumn}>
        <Text style={styles.timeText}>{data.startTime}</Text>
        <View style={styles.timeLine} />
        <Text style={styles.timeText}>{data.endTime}</Text>
      </View>
      <View style={styles.slotContent}>
        <Text style={styles.subjectText}>{data.subject}</Text>
        <View style={styles.teacherRow}>
          <FontAwesome5
            name="chalkboard-teacher"
            size={12}
            color={COLORS.textLight}
          />
          <Text style={styles.teacherText}>{data.teacher}</Text>
        </View>
      </View>
      <View style={styles.slotActions}>
        <TouchableOpacity
          onPress={onEdit}
          style={[
            styles.actionBtn,
            { backgroundColor: "#e0e7ff", marginBottom: 5 },
          ]}
        >
          <FontAwesome5 name="pen" size={12} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
          style={[styles.actionBtn, { backgroundColor: "#fee2e2" }]}
        >
          <FontAwesome5 name="trash" size={12} color={COLORS.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 6. Timetable Modal
const TimetableModal = ({ visible, onClose, onSave, initialData }) => {
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (initialData) {
      setSubject(initialData.subject);
      setTeacher(initialData.teacher);
      setStartTime(initialData.startTime);
      setEndTime(initialData.endTime);
    } else {
      setSubject("");
      setTeacher("");
      setStartTime("");
      setEndTime("");
    }
  }, [initialData, visible]);

  const handleSave = () => {
    if (!subject || !teacher || !startTime || !endTime) {
      Alert.alert("Missing Fields", "Please fill in all details.");
      return;
    }
    onSave({ id: initialData?.id, subject, teacher, startTime, endTime });
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
              {initialData ? "Edit Slot" : "Add Time Slot"}
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
                placeholder="09:00 AM"
                value={startTime}
                onChangeText={setStartTime}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>End Time</Text>
              <TextInput
                style={styles.input}
                placeholder="10:00 AM"
                value={endTime}
                onChangeText={setEndTime}
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Maths"
              value={subject}
              onChangeText={setSubject}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teacher</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Mr. Smith"
              value={teacher}
              onChangeText={setTeacher}
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Slot</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// 7. Generic Form Modal
const FormModal = ({ visible, onClose, onSave, initialData, type }) => {
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");
  const [status, setStatus] = useState("Active");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDetail(
        initialData.subject || initialData.grade || initialData.location
      );
      setStatus(initialData.status);
    } else {
      setName("");
      setDetail("");
      setStatus("Active");
    }
  }, [initialData, visible]);

  const handleSave = () => {
    if (!name || !detail) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    onSave({ id: initialData?.id, name, detail, status });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {initialData ? "Edit Details" : `Add New ${type}`}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome5 name="times" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {type === "Class" ? "Class Name" : "Full Name"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {type === "Teacher"
                ? "Subject"
                : type === "Student"
                ? "Grade"
                : "Location"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Detail"
              value={detail}
              onChangeText={setDetail}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusToggle}>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  status === "Active" && styles.statusOptionActive,
                ]}
                onPress={() => setStatus("Active")}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    status === "Active" && { color: "#fff" },
                  ]}
                >
                  Active
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusOption,
                  status === "Inactive" && styles.statusOptionActive,
                ]}
                onPress={() => setStatus("Inactive")}
              >
                <Text
                  style={[
                    styles.statusOptionText,
                    status === "Inactive" && { color: "#fff" },
                  ]}
                >
                  Inactive
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Entry</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// --- Main Component ---
const AdminPanelContent = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { gutter, contentMaxWidth } = useResponsiveLayout();

  // -- State --
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Animations
  const sidebarAnim = useRef(new Animated.Value(-280)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // CRUD State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [currentListType, setCurrentListType] = useState("Teacher");

  // Timetable State
  const [timetableModalVisible, setTimetableModalVisible] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [activeClass, setActiveClass] = useState(CLASSES_LIST[0]);
  const [activeDay, setActiveDay] = useState(DAYS[0]);

  // Data
  const [teachers, setTeachers] = useState([
    { id: 1, name: "Dr. Sarah Wilson", subject: "Maths", status: "Active" },
    { id: 2, name: "Mr. James Carter", subject: "Physics", status: "Active" },
    { id: 3, name: "Ms. Emily Davis", subject: "Chem", status: "Inactive" },
  ]);
  const [students, setStudents] = useState([
    { id: 1, name: "John Doe", grade: "10th", status: "Active" },
    { id: 2, name: "Jane Smith", grade: "12th", status: "Active" },
  ]);
  const [classes, setClasses] = useState([
    { id: 1, name: "Class 10-A", location: "1st Floor", status: "Active" },
    { id: 2, name: "Class 12-B", location: "2nd Floor", status: "Active" },
    { id: 3, name: "Lab 1", location: "Ground Floor", status: "Active" },
  ]);
  const [schedule, setSchedule] = useState({
    "Class 10-A": {
      Monday: [
        {
          id: 1,
          startTime: "09:00 AM",
          endTime: "10:00 AM",
          subject: "Mathematics",
          teacher: "Dr. Wilson",
        },
        {
          id: 2,
          startTime: "10:00 AM",
          endTime: "11:00 AM",
          subject: "Physics",
          teacher: "Mr. Carter",
        },
      ],
      Tuesday: [
        {
          id: 3,
          startTime: "09:00 AM",
          endTime: "10:00 AM",
          subject: "English",
          teacher: "Mrs. Green",
        },
      ],
    },
  });

  // -- Logic --
  const animateLayout = () => {
    if (
      Platform.OS !== "ios" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    } else if (Platform.OS === "ios") {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  };

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? -280 : 0;
    const scaleValue = isSidebarOpen ? 1 : 0.95;
    Animated.parallel([
      Animated.spring(sidebarAnim, {
        toValue,
        useNativeDriver: true,
        bounciness: 8,
      }),
      Animated.timing(scaleAnim, {
        toValue: scaleValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await clearSession();
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  };

  const navigateToTab = (tabName) => {
    animateLayout();
    setActiveTab(tabName);
  };

  // Generic CRUD
  const handleDelete = (id, type) => {
    Alert.alert("Delete Item", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          animateLayout();
          if (type === "teacher")
            setTeachers((prev) => prev.filter((t) => t.id !== id));
          if (type === "student")
            setStudents((prev) => prev.filter((s) => s.id !== id));
          if (type === "class")
            setClasses((prev) => prev.filter((c) => c.id !== id));
        },
      },
    ]);
  };
  const handleAddNew = (type) => {
    setCurrentListType(type);
    setEditingItem(null);
    setModalVisible(true);
  };
  const handleEdit = (item, type) => {
    setCurrentListType(type);
    setEditingItem(item);
    setModalVisible(true);
  };
  const handleSaveForm = ({ id, name, detail, status }) => {
    animateLayout();
    let setList, detailKey;
    if (currentListType === "Teacher") {
      setList = setTeachers;
      detailKey = "subject";
    } else if (currentListType === "Student") {
      setList = setStudents;
      detailKey = "grade";
    } else {
      setList = setClasses;
      detailKey = "location";
    }

    if (id) {
      setList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, name, [detailKey]: detail, status } : item
        )
      );
    } else {
      setList((prev) => [
        { id: Date.now(), name, [detailKey]: detail, status },
        ...prev,
      ]);
    }
  };

  // Timetable Handlers
  const handleTimetableShare = async () => {
    const currentSlots = schedule[activeClass]?.[activeDay] || [];
    if (currentSlots.length === 0) {
      Alert.alert("Empty", "No schedule to share.");
      return;
    }

    let message = `📅 *Timetable for ${activeClass}*\n🗓️ *${activeDay}*\n\n`;
    currentSlots.forEach((slot) => {
      message += `⏰ ${slot.startTime} - ${slot.endTime}\n📚 ${slot.subject}\n👨‍🏫 ${slot.teacher}\n\n`;
    });
    message += `generated via EduCore`;

    try {
      await Share.share({ message });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleSaveSlot = (data) => {
    animateLayout();
    setSchedule((prev) => {
      const classData = prev[activeClass] || {};
      const dayData = classData[activeDay] || [];
      let newDayData;
      if (data.id) {
        newDayData = dayData.map((slot) => (slot.id === data.id ? data : slot));
      } else {
        newDayData = [...dayData, { ...data, id: Date.now() }].sort((a, b) =>
          a.startTime.localeCompare(b.startTime)
        );
      }
      return {
        ...prev,
        [activeClass]: { ...classData, [activeDay]: newDayData },
      };
    });
  };

  const handleDeleteSlot = (id) => {
    animateLayout();
    setSchedule((prev) => {
      const classData = prev[activeClass] || {};
      const dayData = classData[activeDay] || [];
      return {
        ...prev,
        [activeClass]: {
          ...classData,
          [activeDay]: dayData.filter((s) => s.id !== id),
        },
      };
    });
  };

  // --- Views ---

  const DashboardView = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>Dashboard Overview</Text>
      <View style={styles.statsGrid}>
        <StatCard
          title="Teachers"
          count={teachers.length}
          icon="user-tie"
          bgColor="#e0e7ff"
          iconColor={COLORS.primary}
          onPress={() => navigateToTab("teachers")}
        />
        <StatCard
          title="Students"
          count={students.length}
          icon="user-graduate"
          bgColor="#fce7f3"
          iconColor={COLORS.secondary}
          onPress={() => navigateToTab("students")}
        />
        <StatCard
          title="Classes"
          count={classes.length}
          icon="chalkboard"
          bgColor="#fff7ed"
          iconColor="#ea580c"
          onPress={() => navigateToTab("classes")}
        />

        {/* ✅ CHANGED: Timetable Stat Card -> Navigates to TimeTableView */}
        <StatCard
          title="Timetable"
          count="View"
          icon="calendar-alt"
          bgColor="#d1fae5"
          iconColor={COLORS.success}
          onPress={() => navigation.navigate("TimeTableView")}
        />

        {/* ✅ CHANGED: TT Generator Stat Card -> Navigates to TimeTableGen */}
        <StatCard
          title="TT Generator"
          count="Open"
          icon="magic"
          bgColor="#fef3c7"
          iconColor={COLORS.warning}
          onPress={() => navigation.navigate("TimeTableGen")}
        />
      </View>
    </ScrollView>
  );

  const GenericListView = ({ data, type, groupKey }) => {
    const [viewMode, setViewMode] = useState("list");
    const groupedData = data.reduce((acc, item) => {
      (acc[item[groupKey]] = acc[item[groupKey]] || []).push(item);
      return acc;
    }, {});

    return (
      <View style={styles.listContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>{type}s Management</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddNew(type)}
          >
            <FontAwesome5 name="plus" size={12} color="#fff" />
            <Text style={styles.addButtonText}>Add New</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {viewMode === "list"
            ? data.map((item) => (
                <ListItem
                  key={item.id}
                  name={item.name}
                  subtitle={item[groupKey]}
                  status={item.status}
                  onEdit={() => handleEdit(item, type)}
                  onDelete={() => handleDelete(item.id, type.toLowerCase())}
                />
              ))
            : Object.keys(groupedData).map((key, index) => (
                <GroupAccordion
                  key={index}
                  title={key}
                  count={groupedData[key].length}
                  onToggle={animateLayout}
                >
                  {groupedData[key].map((item) => (
                    <ListItem
                      key={item.id}
                      name={item.name}
                      subtitle={item[groupKey]}
                      status={item.status}
                      onEdit={() => handleEdit(item, type)}
                      onDelete={() => handleDelete(item.id, type.toLowerCase())}
                    />
                  ))}
                </GroupAccordion>
              ))}
        </ScrollView>
      </View>
    );
  };

  const TimetableView = () => {
    const currentSlots = schedule[activeClass]?.[activeDay] || [];
    return (
      <View style={styles.listContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Timetable View</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: COLORS.secondary }]}
            onPress={handleTimetableShare}
          >
            <FontAwesome5 name="share-alt" size={12} color="#fff" />
            <Text style={styles.addButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 15 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CLASSES_LIST.map((cls) => (
              <TouchableOpacity
                key={cls}
                onPress={() => {
                  animateLayout();
                  setActiveClass(cls);
                }}
                style={[
                  styles.tabButton,
                  activeClass === cls && styles.tabButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeClass === cls && styles.tabTextActive,
                  ]}
                >
                  {cls}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ marginBottom: 15 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {DAYS.map((day) => (
              <TouchableOpacity
                key={day}
                onPress={() => {
                  animateLayout();
                  setActiveDay(day);
                }}
                style={[
                  styles.dayTab,
                  activeDay === day && styles.dayTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.dayTabText,
                    activeDay === day && { color: "#fff" },
                  ]}
                >
                  {day.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>{activeDay}</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => {
              setEditingSlot(null);
              setTimetableModalVisible(true);
            }}
          >
            <FontAwesome5 name="plus" size={12} color="#fff" />
            <Text style={styles.addBtnText}>Add Slot</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {currentSlots.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome5 name="calendar-plus" size={40} color="#d1d5db" />
              <Text style={styles.emptyText}>No classes scheduled</Text>
            </View>
          ) : (
            currentSlots.map((slot) => (
              <TimeSlotCard
                key={slot.id}
                data={slot}
                onEdit={() => {
                  setEditingSlot(slot);
                  setTimetableModalVisible(true);
                }}
                onDelete={() => handleDeleteSlot(slot.id)}
              />
            ))
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* --- Sidebar --- */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: sidebarAnim }],
            paddingTop: insets.top + 20,
          },
        ]}
      >
        <View style={styles.brand}>
          <View style={styles.brandIcon}>
            <FontAwesome5 name="layer-group" size={24} color="#fff" />
          </View>
          <Text style={styles.brandText}>
            <Text style={{ color: COLORS.secondary }}>Edu</Text>Core
          </Text>
        </View>
        <View style={styles.menu}>
          <MenuItem
            icon="chart-pie"
            label="Dashboard"
            isActive={activeTab === "dashboard"}
            onPress={() => {
              navigateToTab("dashboard");
              toggleSidebar();
            }}
          />
          <MenuItem
            icon="user-tie"
            label="Teachers"
            isActive={activeTab === "teachers"}
            onPress={() => {
              navigateToTab("teachers");
              toggleSidebar();
            }}
          />
          <MenuItem
            icon="user-graduate"
            label="Students"
            isActive={activeTab === "students"}
            onPress={() => {
              navigateToTab("students");
              toggleSidebar();
            }}
          />
          <MenuItem
            icon="chalkboard"
            label="Classes"
            isActive={activeTab === "classes"}
            onPress={() => {
              navigateToTab("classes");
              toggleSidebar();
            }}
          />

          {/* ✅ CHANGED: Timetable Sidebar Item -> Navigates to TimeTableView */}
          <MenuItem
            icon="calendar-alt"
            label="Timetable"
            isActive={false} // No longer internal
            onPress={() => {
              if (navigation) {
                navigation.navigate("TimeTableView");
              }
            }}
          />

          {/* ✅ CHANGED: Generator Sidebar Item -> Navigates to TimeTableGen */}
          <MenuItem
            icon="magic"
            label="Generator"
            isActive={false}
            onPress={() => {
              if (navigation) {
                navigation.navigate("TimeTableGen");
              }
            }}
          />
        </View>
      </Animated.View>

      {/* --- Main Content --- */}
      <Animated.View
        style={[
          styles.contentArea,
          {
            transform: [
              { scale: scaleAnim },
              { translateX: isSidebarOpen ? 200 : 0 },
            ],
            marginTop: insets.top,
          },
        ]}
      >
        <View style={styles.headerContainer}>
          <View style={[styles.header, { paddingHorizontal: gutter }]}>
            <TouchableOpacity
              onPress={toggleSidebar}
              style={styles.menuTrigger}
            >
              <FontAwesome5
                name={isSidebarOpen ? "times" : "bars"}
                size={20}
                color={COLORS.textDark}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Admin Panel</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <FontAwesome5 name="sign-out-alt" size={14} color="#fff" />
              </TouchableOpacity>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>A</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.mainContent, { paddingHorizontal: gutter, alignItems: "center" }]}>
          <View style={{ width: "100%", maxWidth: contentMaxWidth }}>
            {activeTab === "dashboard" && <DashboardView />}
            {activeTab === "teachers" && (
              <GenericListView
                data={teachers}
                type="Teacher"
                groupKey="subject"
              />
            )}
            {activeTab === "students" && (
              <GenericListView
                data={students}
                type="Student"
                groupKey="grade"
              />
            )}
            {activeTab === "classes" && (
              <GenericListView
                data={classes}
                type="Class"
                groupKey="location"
              />
            )}
            {/* Internal Timetable View is removed from here since we navigate away now */}
          </View>
        </View>
      </Animated.View>

      {isSidebarOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleSidebar}
        />
      )}

      {/* --- Modals --- */}
      <FormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveForm}
        initialData={editingItem}
        type={currentListType}
      />
      <TimetableModal
        visible={timetableModalVisible}
        onClose={() => setTimetableModalVisible(false)}
        onSave={handleSaveSlot}
        initialData={editingSlot}
      />
    </View>
  );
};

// --- Wrap with Navigation Prop Handling ---
const AdminPanel = ({ navigation }) => {
  // ✅ Receive Prop
  return (
    <SafeAreaProvider>
      <AdminPanelContent navigation={navigation} /> // ✅ Pass Prop
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  contentArea: {
    flex: 1,
    backgroundColor: COLORS.contentBg,
    borderRadius: 30,
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 280,
    zIndex: 40,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    zIndex: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: COLORS.textDark },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  logoutButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  menuTrigger: { padding: 5 },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    zIndex: 50,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 25,
  },
  brand: { flexDirection: "row", alignItems: "center", marginBottom: 50 },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  brandText: { fontSize: 26, fontWeight: "900", color: "#fff" },
  menu: { flex: 1 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  menuItemActive: { backgroundColor: COLORS.primary },
  menuIconBox: { width: 30, alignItems: "center" },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: "600",
  },
  mainContent: { flex: 1 },
  sectionTitle: { fontSize: 24, fontWeight: "800", color: COLORS.textDark },
  scrollContent: { paddingBottom: 100, paddingTop: 10 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    justifyContent: "space-between",
  },
  statCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 5,
    elevation: 4,
    minHeight: 120,
  },
  statTitle: {
    color: "#9ca3af",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  statCount: { color: COLORS.textDark, fontSize: 32, fontWeight: "bold" },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  addButton: {
    backgroundColor: COLORS.textDark,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 12,
  },
  listItem: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  listIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  listInitials: { fontSize: 18, fontWeight: "bold", color: COLORS.primary },
  listInfo: { flex: 1 },
  listName: { fontSize: 16, fontWeight: "bold", color: COLORS.textDark },
  listSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  statusActive: { backgroundColor: "#d1fae5" },
  statusInactive: { backgroundColor: "#fee2e2" },
  statusText: { fontSize: 10, fontWeight: "800", textTransform: "uppercase" },
  actionBtn: { padding: 8, borderRadius: 8 },
  toggleWrapper: { alignItems: "center", marginBottom: 20 },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#e5e7eb",
    borderRadius: 50,
    padding: 4,
    width: "100%",
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 40,
  },
  toggleBtnActive: { backgroundColor: "#fff", elevation: 2 },
  toggleText: { fontSize: 14, fontWeight: "600", color: "#6b7280" },
  toggleTextActive: { color: COLORS.primary, fontWeight: "800" },
  groupContainer: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f3f4f6",
    elevation: 2,
  },
  groupContainerExpanded: { borderColor: COLORS.primary, borderWidth: 1.5 },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#fff",
  },
  groupHeaderLeft: { flexDirection: "row", alignItems: "center" },
  chevronBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  groupTitle: { fontSize: 16, fontWeight: "800", color: COLORS.textDark },
  groupBadge: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  groupBadgeText: { color: COLORS.primary, fontWeight: "700", fontSize: 11 },
  groupContent: {
    padding: 10,
    backgroundColor: "#f8fafc",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 25,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "800", color: COLORS.textDark },
  inputGroup: { marginBottom: 15 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f3f4f6",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    color: COLORS.textDark,
  },
  statusToggle: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 4,
  },
  statusOption: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  statusOptionActive: { backgroundColor: COLORS.primary },
  statusOptionText: { fontWeight: "600", color: COLORS.textLight },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  row: { flexDirection: "row" },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
  },
  tabButtonActive: { backgroundColor: COLORS.primary },
  tabText: { fontWeight: "600", color: COLORS.textLight },
  tabTextActive: { color: "#fff" },
  dayTab: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  dayTabActive: { backgroundColor: COLORS.secondary },
  dayTabText: { fontWeight: "bold", color: COLORS.textLight },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    marginBottom: 10,
  },
  listTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.textDark },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.textDark,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 30,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 5,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    opacity: 0.7,
  },
  emptyText: { marginTop: 10, fontSize: 14, color: COLORS.textLight },
  slotCardInner: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  timeColumn: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 15,
    borderRightWidth: 1,
    borderRightColor: "#f3f4f6",
    width: 80,
  },
  timeText: { fontSize: 12, fontWeight: "700", color: COLORS.textDark },
  timeLine: {
    height: 15,
    width: 2,
    backgroundColor: COLORS.secondary,
    marginVertical: 4,
    borderRadius: 2,
  },
  slotContent: { flex: 1, paddingLeft: 15, justifyContent: "center" },
  subjectText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  teacherRow: { flexDirection: "row", alignItems: "center" },
  teacherText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginLeft: 6,
    fontWeight: "500",
  },
  slotActions: { justifyContent: "center", paddingLeft: 10 },
});

export default AdminPanel;
