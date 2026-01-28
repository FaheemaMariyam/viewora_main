import axiosInstance from "../utils/axiosInstance";

export const getChatHistory = (interestId) =>
  axiosInstance.get(`/api/chat/interest/${interestId}/history/`);
export const markMessagesRead = (interestId) =>
  axiosInstance.post(`/api/chat/interest/${interestId}/read/`);

export const getClientChats = () =>
  axiosInstance.get("/api/interests/client/interests/");

export const getBrokerChats = () =>
  axiosInstance.get("/api/interests/broker/interests/");
