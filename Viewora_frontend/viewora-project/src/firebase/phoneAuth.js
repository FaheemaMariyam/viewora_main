// import { auth } from "./firebase";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// // Clear existing reCAPTCHA verifier
// export const clearRecaptcha = () => {
//   if (window.recaptchaVerifier) {
//     try {
//       window.recaptchaVerifier.clear();
//     } catch (error) {
//       console.warn("Error clearing reCAPTCHA:", error);
//     }
//     window.recaptchaVerifier = null;
//   }
// };

// // Setup reCAPTCHA verifier
// export const setupRecaptcha = () => {
//   // Clear any existing verifier first
//   clearRecaptcha();
  
//   try {
//     // Firebase v9+ modular syntax: RecaptchaVerifier(auth, container, parameters)
//     // window.recaptchaVerifier = new RecaptchaVerifier(
//     //   auth,
//     //   "recaptcha-container",
//     //   {
//     //     size: "invisible", // Invisible for production UX
//     //     callback: (response) => {
//     //       console.log("reCAPTCHA solved:", response);
//     //     },
//     //     "expired-callback": () => {
//     //       console.warn("reCAPTCHA expired");
//     //       clearRecaptcha();
//     //     }
//     //   }
//     // );
//     window.recaptchaVerifier = new RecaptchaVerifier(
//   "recaptcha-container",
//   {
//     size: "invisible",
//     callback: (response) => {
//       console.log("reCAPTCHA solved:", response);
//     },
//     "expired-callback": () => {
//       console.warn("reCAPTCHA expired");
//       clearRecaptcha();
//     },
//   },
//   auth
// );

    
//     console.log("reCAPTCHA verifier created successfully");
//   } catch (error) {
//     console.error("Error creating reCAPTCHA verifier:", error);
//     throw error;
//   }
// };

// export const sendFirebaseOtp = async (phoneNumber) => {
//   try {
//     // Setup fresh reCAPTCHA
//     setupRecaptcha();
    
//     console.log("Sending OTP to:", phoneNumber);
    
//     const confirmationResult = await signInWithPhoneNumber(
//       auth,
//       phoneNumber,
//       window.recaptchaVerifier
//     );
    
//     console.log("OTP sent successfully");
//     window.confirmationResult = confirmationResult;
    
//   } catch (error) {
//     console.error("Error in sendFirebaseOtp:", error);
//     clearRecaptcha(); // Clean up on error
//     throw error;
//   }
// };

// export const verifyFirebaseOtp = async (otp) => {
//   if (!window.confirmationResult) {
//     throw new Error("OTP not requested");
//   }

//   try {
//     const result = await window.confirmationResult.confirm(otp);
//     const user = result.user;

//     // 🔥 Firebase ID token
//     const token = await user.getIdToken();
    
//     // Clean up after successful verification
//     clearRecaptcha();
//     window.confirmationResult = null;
    
//     return token;
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     throw error;
//   }
// };
import { auth } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export const clearRecaptcha = () => {
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch {}
    window.recaptchaVerifier = null;
  }
};

export const setupRecaptcha = (force = false) => {
  if (window.recaptchaVerifier && !force) {
    return window.recaptchaVerifier;
  }
  
  clearRecaptcha();

  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
      size: "invisible", // Switched to invisible to avoid DOM style conflicts
      callback: (response) => {
        console.log("✅ reCAPTCHA solved", !!response);
      },
      "expired-callback": () => {
        console.warn("⚠️ reCAPTCHA expired");
        clearRecaptcha();
      },
    }
  );
  return window.recaptchaVerifier;
};

export const sendFirebaseOtp = async (phoneNumber) => {
  try {
    console.log("🚀 Starting OTP flow for:", phoneNumber);
    
    // Only setup if needed
    const verifier = setupRecaptcha();
    
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      verifier
    );

    console.log("✅ SMS sent successfully");
    window.confirmationResult = confirmationResult;
  } catch (error) {
    console.error("❌ Firebase Auth Error Details:", {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    clearRecaptcha();
    throw error;
  }
};

export const verifyFirebaseOtp = async (otp) => {
  if (!window.confirmationResult) {
    throw new Error("OTP not requested");
  }

  try {
    const result = await window.confirmationResult.confirm(otp);
    const token = await result.user.getIdToken();

    clearRecaptcha();
    window.confirmationResult = null;

    return token;
  } catch (error) {
    console.error("❌ Verification Error:", error);
    throw error;
  }
};
