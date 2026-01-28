import axiosInstance from "../utils/axiosInstance";

export const signup = (data) => axiosInstance.post("/api/auth/register/", data);

export const login = (data) => axiosInstance.post("/api/auth/login/", data);

export const getProfile = () => axiosInstance.get("/api/auth/profile/");

export const logout = () => axiosInstance.post("/api/auth/logout/");

export const sendPhoneOtp = (phone_number) =>
  axiosInstance.post("/api/auth/otp/send/", { phone_number });

export const verifyPhoneOtp = (phone_number, otp) =>
  axiosInstance.post("/api/auth/otp/verify/", { phone_number, otp });

export const resetPasswordRequest = (data) =>
  axiosInstance.post("/api/auth/reset-password/request/", data);
export const confirmPasswordReset = (data) =>
  axiosInstance.post("/api/auth/reset-password/confirm/", data);
export const changePassword = (data) =>
  axiosInstance.post("/api/auth/change-password/", data);
// export const googleLogin = (token) =>
//   axiosInstance.post("/api/auth/google-login/", { token });
export const googleLogin = (credential) =>
  axiosInstance.post("/api/auth/google-login/", {
    token: credential,
  });
//  Admin OTP verify
export const verifyAdminOtp = (data) =>
  axiosInstance.post("/api/auth/admin/verify-otp/", data);

//  Admin user management
export const fetchAdminUsers = (params) =>
  axiosInstance.get("/api/auth/admin/users/", { params });

export const toggleUserStatus = (userId) =>
  axiosInstance.post(`/api/auth/admin/users/${userId}/toggle-status/`);

export const fetchAdminStats = () => 
  axiosInstance.get("/api/auth/admin/stats/");

export const fetchAdminProperties = (params) =>
  axiosInstance.get("/api/auth/admin/properties/", { params });

export const togglePropertyStatus = (propertyId) =>
  axiosInstance.post(`/api/auth/admin/properties/${propertyId}/toggle-status/`);
// pending seller signup requests
export const fetchPendingSellers = () =>
  axiosInstance.get("/api/auth/admin/pending/sellers/");

// Pending broker signup requests
export const fetchPendingBrokers = () =>
  axiosInstance.get("/api/auth/admin/pending/brokers/");

// Approve / Reject seller or broker
export const approveRejectUser = (userId, action) =>
  axiosInstance.post(`/api/auth/admin/approve-reject/${userId}/`, { action });

export const sendEmailOtp = (email) =>
  axiosInstance.post("/api/auth/email/send-otp/", { email });

export const verifyEmailOtp = (email, otp) =>
  axiosInstance.post("/api/auth/email/verify-otp/", { email, otp });