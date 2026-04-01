const API_BASE_URL = "http://localhost:8080/api";

// ── Auth ──
export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");
  return data;
};

export const signupUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Signup failed");
  return data;
};

// ── Matching ──
export const getMatchSuggestions = async (volunteerId) => {
  const response = await fetch(`${API_BASE_URL}/matching/volunteer/${volunteerId}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to load match suggestions");
  return response.json();
};

// ── Messaging ──
export const getConversations = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/messages/conversations/${userId}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to load conversations");
  return response.json();
};

export const getMessages = async (userId, otherUserId) => {
  const response = await fetch(`${API_BASE_URL}/messages/${userId}/${otherUserId}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to load messages");
  return response.json();
};

export const sendMessage = async (senderId, receiverId, content) => {
  const response = await fetch(`${API_BASE_URL}/messages/send`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senderId, receiverId, content }),
  });
  if (!response.ok) throw new Error("Failed to send message");
  return response.json();
};

export const markMessagesAsRead = async (senderId, receiverId) => {
  await fetch(`${API_BASE_URL}/messages/read/${senderId}/${receiverId}`, {
    method: "PUT",
    credentials: "include",
  });
};

export const getUnreadMessageCount = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/messages/unread-count/${userId}`, {
    credentials: "include",
  });
  if (!response.ok) return { count: 0 };
  return response.json();
};

// ── Notifications ──
export const getNotifications = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/notifications/${userId}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to load notifications");
  return response.json();
};

export const getUnreadNotificationCount = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/notifications/unread-count/${userId}`, {
    credentials: "include",
  });
  if (!response.ok) return { count: 0 };
  return response.json();
};

export const markNotificationAsRead = async (notificationId) => {
  await fetch(`${API_BASE_URL}/notifications/read/${notificationId}`, {
    method: "PUT",
    credentials: "include",
  });
};

export const markAllNotificationsAsRead = async (userId) => {
  await fetch(`${API_BASE_URL}/notifications/read-all/${userId}`, {
    method: "PUT",
    credentials: "include",
  });
};

// ── Applications (enhanced) ──
export const updateApplicationStatus = async (applicationId, status) => {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}?status=${status}`, {
    method: "PUT",
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to update application status");
  return response.json();
};
