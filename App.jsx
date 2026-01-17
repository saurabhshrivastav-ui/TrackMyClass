import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// --- AUTH IMPORTS ---
import LoginScreen from "./src/screens/LoginScreen";

// --- ADMIN IMPORTS ---
import AdminPanel from "./src/screens/Admin/AdminPanel";
import TimeTableGen from "./src/screens/Admin/TimeTableGenerator"; 
// ✅ Import the Day-to-Day View (Ensure file exists at this path)
import TimeTableView from "./src/screens/TimeTableView"; 

// --- STUDENT IMPORTS ---
import TabNavigator from "./src/navigation/TabNavigator"; 
import ProfileScreen from "./src/screens/Students/ProfileScreen";
import AiTeacherChat from "./src/screens/Students/AiTeacherChat";
import FullReport from "./src/screens/Students/FullReport";

// --- TEACHER IMPORTS ---
import TeacherDashboard from "./src/screens/Teachers/DashboardScreen";
import MarkAttendanceScreen from "./src/screens/Teachers/MarkAttendanceScreen";
import TeacherProfileScreen from "./src/screens/Teachers/TeachersProfile"; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {/* ==============================
            1. AUTHENTICATION
            ============================== */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* ==============================
            2. ADMIN PANEL FLOW
            ============================== */}
        <Stack.Screen 
          name="AdminPanel" 
          component={AdminPanel} 
        />
        
        {/* Generator Screen (Edit Mode) */}
        <Stack.Screen 
          name="TimeTableGen" 
          component={TimeTableGen} 
          options={{ 
            headerShown: false,
            animation: 'slide_from_right'
          }} 
        />

        {/* ✅ Day-to-Day View Screen (View Mode) */}
        <Stack.Screen 
          name="TimeTableView" 
          component={TimeTableView} 
          options={{ 
            headerShown: false,
            animation: 'slide_from_right'
          }} 
        />

        {/* ==============================
            3. STUDENT PANEL FLOW
            ============================== */}
        <Stack.Screen name="Main" component={TabNavigator} />

        <Stack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{
            headerShown: true,
            title: "Student Profile",
            headerStyle: { backgroundColor: "#F5F7FA" },
          }}
        />

        <Stack.Screen
          name="AiTeacherChat"
          component={AiTeacherChat}
          options={{
            headerShown: true,
            title: "AI Teacher",
            headerStyle: { backgroundColor: "#F5F7FA" },
          }}
        />

        <Stack.Screen
          name="FullReport"
          component={FullReport}
        />

        {/* ==============================
            4. TEACHER PANEL FLOW
            ============================== */}
        
        <Stack.Screen
          name="TeacherDashboard"
          component={TeacherDashboard}
          options={{
            headerShown: true,
            title: "Teacher Dashboard",
            headerStyle: { backgroundColor: "#6200EE" },
            headerTintColor: "#fff",
          }}
        />

        <Stack.Screen
          name="MarkAttendance"
          component={MarkAttendanceScreen}
          options={{
            headerShown: true,
            title: "Mark Attendance",
            headerStyle: { backgroundColor: "#6200EE" },
            headerTintColor: "#fff",
          }}
        />

        <Stack.Screen
          name="TeacherProfile"
          component={TeacherProfileScreen}
          options={{
            headerShown: true,
            title: "My Profile",
            headerStyle: { backgroundColor: "#6200EE" },
            headerTintColor: "#fff",
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}