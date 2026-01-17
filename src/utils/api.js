// Configure this when testing on a physical device:
//   EXPO_PUBLIC_API_URL=http://<YOUR_PC_LAN_IP>:4000
// Defaults:
//   Android emulator: http://10.0.2.2:4000
//   iOS simulator:    http://localhost:4000
import { Platform } from "react-native";

const DEFAULT_BASE_URL = Platform.OS === "android" ? "http://10.0.2.2:4000" : "http://localhost:4000";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL;
