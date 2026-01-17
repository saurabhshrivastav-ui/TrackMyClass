import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// --- MOCK TEACHER DATA ---
const TEACHER_PROFILE = {
  name: "Sarah Williams",
  id: "T-9594",
  department: "Computer Science",
  email: "sarah.williams@trackmyclass.edu",
  phone: "+91 9594663759",
  classesAssigned: 3,
  totalStudents: 93,
};

export default function TeacherProfileScreen({ navigation }) {

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive", 
          onPress: () => navigation.replace("Login") // Navigate back to Login
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
        <Text style={styles.name}>{TEACHER_PROFILE.name}</Text>
        <Text style={styles.role}>Senior Faculty • {TEACHER_PROFILE.department}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* --- STATS CARD --- */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{TEACHER_PROFILE.classesAssigned}</Text>
            <Text style={styles.statLabel}>Classes</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{TEACHER_PROFILE.totalStudents}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* --- DETAILS SECTION --- */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
                <Ionicons name="id-card-outline" size={20} color="#6200EE" />
            </View>
            <View>
                <Text style={styles.infoLabel}>Employee ID</Text>
                <Text style={styles.infoValue}>{TEACHER_PROFILE.id}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
                <Ionicons name="mail-outline" size={20} color="#6200EE" />
            </View>
            <View>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{TEACHER_PROFILE.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
                <Ionicons name="call-outline" size={20} color="#6200EE" />
            </View>
            <View>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{TEACHER_PROFILE.phone}</Text>
            </View>
          </View>
        </View>

        {/* --- SETTINGS SECTION --- */}
        <View style={styles.sectionCard}>
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
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  
  // Header
  header: {
    backgroundColor: '#6200EE',
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
  role: { fontSize: 14, color: '#E0E0E0', marginTop: 5 },

  // Scroll Content
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  // Stats Card
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  statBox: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  divider: { width: 1, backgroundColor: '#eee', height: '100%' },

  // Details Section
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  iconBox: {
    width: 40, height: 40,
    backgroundColor: '#F3E5F5',
    borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 15,
  },
  infoLabel: { fontSize: 12, color: '#888' },
  infoValue: { fontSize: 15, fontWeight: '500', color: '#333', marginTop: 2 },

  // Settings Section
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: { fontSize: 15, fontWeight: '500', color: '#333' },
});