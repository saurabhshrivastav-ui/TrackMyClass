import * as SecureStore from "expo-secure-store";

const SESSION_KEY = "user_session";

export const saveSession = async (session) => {
  if (!session) return;
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
};

export const getSession = async () => {
  const saved = await SecureStore.getItemAsync(SESSION_KEY);
  return saved ? JSON.parse(saved) : null;
};

export const clearSession = async () => {
  await SecureStore.deleteItemAsync(SESSION_KEY);
};