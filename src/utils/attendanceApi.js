import { API_BASE_URL } from "./api";

export const fetchStudentOverview = async (studentId) => {
  const response = await fetch(`${API_BASE_URL}/api/students/${studentId}/overview`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Failed to load student overview");
  }
  return response.json();
};
