import axiosInstance from "../utils/axiosInstance";

export const getAreaInsights = (question) => {
  return axiosInstance.post("/api/ai/area-insights/", {
    question,
  });
};
