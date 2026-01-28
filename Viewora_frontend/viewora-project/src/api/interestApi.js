import axiosInstance from "../utils/axiosInstance";

export const createInterest = (propertyId) =>
  axiosInstance.post(`/api/interests/property/${propertyId}/interest/`);
