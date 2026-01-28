import axiosInstance from "../utils/axiosInstance";

export const fetchProperties = (params = {}) =>
  axiosInstance.get("/api/properties/view/", { params });
export const fetchPropertyDetail = (id) =>
  axiosInstance.get(`/api/properties/view/${id}/`);

export const createInterest = (propertyId) =>
  axiosInstance.post(`/api/interests/property/${propertyId}/interest/`);
