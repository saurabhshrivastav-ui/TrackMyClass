import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import OverallScreen from "../screens/Students/OverallScreen";
import SubjectWiseScreen from "../screens/Students/SubjectWiseScreen";
import ProfileScreen from "../screens/Students/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../utils/theme";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "700" },
        tabBarStyle: {
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          backgroundColor: COLORS.surface,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Overall") iconName = "stats-chart";
          if (route.name === "Subjectwise") iconName = "book";
          if (route.name === "Profile") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Overall" component={OverallScreen} />
      <Tab.Screen name="Subjectwise" component={SubjectWiseScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
