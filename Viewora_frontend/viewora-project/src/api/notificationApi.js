import axiosInstance from "../utils/axiosInstance";

export const getNotifications = () =>
  axiosInstance.get("/api/notifications/");

export const getUnreadNotificationCount = () =>
  axiosInstance.get("/api/notifications/unread-count/");

export const markNotificationsRead = () =>
  axiosInstance.post("/api/notifications/mark-read/");
