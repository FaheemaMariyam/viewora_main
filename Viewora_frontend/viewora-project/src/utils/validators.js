
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isGmail = (email) =>
  /^[^\s@]+@gmail\.com$/.test(email);

export const isValidPhone = (phone) => {
  const cleaned = phone.replace(/\s+/g, "");

  // Accept +91XXXXXXXXXX (relaxed for test numbers)
  if (cleaned.startsWith("+91")) {
    return /^\+91[1-9]\d{9}$/.test(cleaned);
  }

  // Accept 10-digit Indian number (relaxed for test numbers)
  return /^[1-9]\d{9}$/.test(cleaned);
};

export const isValidOTP = (otp) =>
  /^\d{6}$/.test(otp);

export const isStrongPassword = (pwd) =>
  pwd.length >= 8;
