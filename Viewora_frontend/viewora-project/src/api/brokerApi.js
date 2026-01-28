import axiosInstance from "../utils/axiosInstance";

// Interests visible to ALL brokers
export const getAvailableInterests = () =>
  axiosInstance.get("/api/interests/broker/available-interests/");

// Interests already accepted by THIS broker
export const getAssignedInterests = () =>
  axiosInstance.get("/api/interests/broker/interests/");

// Broker accepts an interest
export const acceptInterest = (id) =>
  axiosInstance.post(`/api/interests/interest/${id}/accept/`);

// Close deal
export const closeInterest = (id) =>
  axiosInstance.post(`/api/interests/interest/${id}/close/`);

export const startInterest = (interestId) =>
  axiosInstance.post(`/api/interests/interest/${interestId}/start/`);
