import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [country, setCountry] = useState({
    code: "+91",
    digits: 10,
    name: "India",
  });

  const countries = [
    { name: "India", code: "+91", digits: 10 },
    { name: "USA", code: "+1", digits: 10 },
    { name: "UK", code: "+44", digits: 10 },
    { name: "Australia", code: "+61", digits: 9 },
  ];

  // ✅ UPDATED LOGIN LOGIC
  const handleLogin = () => {
    if (!phone) {
      Alert.alert("Error", "Phone number is required");
      return;
    }

    if (phone.length !== country.digits) {
      Alert.alert(
        "Invalid Number",
        `Enter ${country.digits}-digit phone number`
      );
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // ---------------------------------------------------------
      // 1. CHECK FOR ADMIN LOGIN (New Logic)
      // ---------------------------------------------------------
      if (phone === "0000000000") {
        navigation.replace("AdminPanel"); 
      }
      // ---------------------------------------------------------
      // 2. CHECK FOR TEACHER LOGIN
      // ---------------------------------------------------------
      else if (phone === "9594663759") {
        navigation.replace("TeacherDashboard");
      }
      // ---------------------------------------------------------
      // 3. CHECK FOR STUDENT LOGIN
      // ---------------------------------------------------------
      else if (phone === "9321656320") {
        navigation.replace("Main");
      }
      // ---------------------------------------------------------
      // 4. INVALID CREDENTIALS
      // ---------------------------------------------------------
      else {
        Alert.alert("Login Failed", "You have entered a wrong number");
      }

      setLoading(false);
    }, 800); 
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* LOGO */}
        <Ionicons name="school" size={60} color="#2F80ED" />
        <Text style={styles.appName}>TrackMyClass</Text>

        {/* CARD */}
        <View style={styles.card}>
          <Text style={styles.loginText}>Log In</Text>
          <View style={styles.underline} />

          <Text style={styles.subText}>
            Select country code and enter phone number
          </Text>

          {/* COUNTRY CODE DROPDOWN */}
          <View style={styles.dropdown}>
            <Picker
              selectedValue={country.code}
              onValueChange={(value) => {
                const selected = countries.find((c) => c.code === value);
                setCountry(selected);
                setPhone("");
              }}
            >
              {countries.map((item) => (
                <Picker.Item
                  key={item.code}
                  label={`${item.name} (${item.code})`}
                  value={item.code}
                />
              ))}
            </Picker>
          </View>

          {/* PHONE INPUT */}
          <View style={styles.inputContainer}>
            <Text style={styles.prefix}>{country.code}</Text>
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              maxLength={country.digits}
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
              style={styles.input}
            />
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            style={[
              styles.button,
              (phone.length !== country.digits || loading) &&
                styles.disabledBtn,
            ]}
            onPress={handleLogin}
            disabled={phone.length !== country.digits || loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2F80ED",
    marginVertical: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  loginText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  underline: {
    height: 2,
    width: 50,
    backgroundColor: "#2F80ED",
    marginBottom: 20,
  },
  subText: {
    fontSize: 14,
    color: "#777",
    marginBottom: 15,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  prefix: {
    fontSize: 16,
    marginRight: 10,
    color: "#555",
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2F80ED",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  disabledBtn: {
    backgroundColor: "#a5c4f1",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});