import { API_BASE_URL } from "./api";

export const fetchUserByPhone = async (phone) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/users/phone/${encodeURIComponent(phone)}`
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "User not found");
    }

    return response.json();
  } catch (err) {
    // Typical React Native network failure:
    // "TypeError: Network request failed"
    const message =
      err?.message?.includes("Network request failed")
        ? `Cannot reach server at ${API_BASE_URL}. Check that the server is running and your phone/emulator can access it.`
        : err?.message || "Login failed";

    throw new Error(message);
  }
};

export const fetchUserById = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "User not found");
  }
  return response.json();
};

export const fetchTeacherSubjects = async (teacherId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/users/teachers/${teacherId}/subjects`
  );
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to load subjects");
  }
  return response.json();
};