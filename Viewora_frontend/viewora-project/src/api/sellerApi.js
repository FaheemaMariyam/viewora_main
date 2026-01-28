import axiosInstance from "../utils/axiosInstance";

export const getMyProperties = () =>
  axiosInstance.get("/api/properties/seller/my-properties/");

export const toggleArchiveProperty = (id) =>
  axiosInstance.patch(`/api/properties/seller/property/${id}/toggle-archive/`);

export const createProperty = (formData) =>
  axiosInstance.post("/api/properties/create/", formData);

export const updateProperty = (id, formData) =>
  axiosInstance.patch(`/api/properties/seller/property/${id}/update/`, formData);
export const getVideoPresignedUrl = (propertyId, payload) =>
  axiosInstance.post(
    `/api/properties/seller/property/${propertyId}/video/presign/`,
    payload
  );

export const attachVideoToProperty = (propertyId, payload) =>
  axiosInstance.post(
    `/api/properties/seller/property/${propertyId}/video/attach/`,
    payload
  );
