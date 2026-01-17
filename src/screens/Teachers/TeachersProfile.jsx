import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { clearSession, getSession } from "../../utils/session";
import { COLORS, SHADOW } from "../../utils/theme";
import { fetchUserById } from "../../utils/userApi";
import { useResponsiveLayout } from "../../utils/responsive";

export default function TeacherProfileScreen({ navigation }) {
  const { gutter, contentMaxWidth } = useResponsiveLayout();
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const loadTeacher = async () => {
      try {
        const session = await getSession();
        if (!session?.id) return;
        const userData = await fetchUserById(session.id);
        setTeacher(userData);
      } catch (error) {
        console.error("Teacher profile load error:", error);
      }
    };

    loadTeacher();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive", 
          onPress: async () => {
            await clearSession();
            navigation.replace("Login");
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
            {/* Placeholder Avatar Image */}
            <Image 
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6858/6858504.png' }} 
              style={styles.avatar} 
            />
            <View style={styles.editIconBadge}>
              <Ionicons name="pencil" size={14} color="#fff" />
            </View>
        </View>
        <Text style={styles.name}>{teacher?.name || "Teacher"}</Text>
        <Text style={styles.role}>
          Senior Faculty • {teacher?.department || "Department"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: gutter, alignItems: "center" }]}>
        
        {/* --- STATS CARD --- */}
        <View style={[styles.statsContainer, { width: "100%", maxWidth: contentMaxWidth }]}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{teacher?.stats?.classesAssigned || 0}</Text>
            <Text style={styles.statLabel}>Classes</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{teacher?.stats?.totalStudents || 0}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* --- DETAILS SECTION --- */}
        <View style={[styles.sectionCard, { width: "100%", maxWidth: contentMaxWidth }]}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
                <Ionicons name="id-card-outline" size={20} color="#6200EE" />
            </View>
            <View>
                <Text style={styles.infoLabel}>Employee ID</Text>
                <Text style={styles.infoValue}>{teacher?.id || "--"}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
                <Ionicons name="mail-outline" size={20} color="#6200EE" />
            </View>
            <View>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{teacher?.email || "--"}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
                <Ionicons name="call-outline" size={20} color="#6200EE" />
            </View>
            <View>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{teacher?.phone || "--"}</Text>
            </View>
          </View>
        </View>

        {/* --- SETTINGS SECTION --- */}
        <View style={[styles.sectionCard, { width: "100%", maxWidth: contentMaxWidth }]}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingRow}>
            <Text style={styles.settingText}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

           <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
            <Text style={[styles.settingText, { color: '#F44336' }]}>Log Out</Text>
            <Ionicons name="log-out-outline" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  
  // Header
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    borderWidth: 4, 
    borderColor: 'rgba(255,255,255,0.3)' 
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF9800',
    padding: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff'
  },
  name: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  role: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 5 },

  // Scroll Content
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  // Stats Card
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    ...SHADOW.soft,
  },
  statBox: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  divider: { width: 1, backgroundColor: COLORS.border, height: '100%' },

  // Details Section
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    ...SHADOW.soft,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconBox: {
    width: 40, height: 40,
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 15,
  },
  infoLabel: { fontSize: 12, color: COLORS.textMuted },
  infoValue: { fontSize: 15, fontWeight: '500', color: COLORS.text, marginTop: 2 },

  // Settings Section
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingText: { fontSize: 15, fontWeight: '500', color: COLORS.text },
});