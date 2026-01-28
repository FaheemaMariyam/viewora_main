// import { getToken, onMessage } from "firebase/messaging";
// import { messaging } from "./firebase";
// import axiosInstance from "../utils/axiosInstance";

// // 🔑 PUBLIC VAPID KEY (from Firebase → Cloud Messaging)
// const VAPID_KEY =
//   "BKXF08nk1Mdsg6wxM9QGox7fhd6F2jDBAkPvQ5IohcxdFoWoj5a2LAdRhz1yhmf7r6RirzjrWkFSxgCTSargQlA";

// // Prevent duplicate setup in same session
// let isNotificationSetupDone = false;

// export async function setupNotifications() {
//   // Ensure setup runs only once per session
//   if (isNotificationSetupDone) return;
//   isNotificationSetupDone = true;

//   try {
//     // 1️⃣ Ask browser permission
//     const permission = await Notification.requestPermission();

//     if (permission !== "granted") {
//       console.log("🔕 Notification permission denied");
//       return;
//     }

//     // 2️⃣ Get FCM token (this is LIVE notification address)
//     const token = await getToken(messaging, {
//       vapidKey: VAPID_KEY,
//     });

//     if (!token) {
//       console.log("❌ Failed to get FCM token");
//       return;
//     }

//     console.log("✅ FCM TOKEN:", token);

//     // 3️⃣ Save token to backend (mapped to logged-in user)
//     await axiosInstance.post("/api/auth/save-fcm-token/", {
//       token,
//     });

//     console.log("✅ FCM token saved to backend");

//     // 4️⃣ Handle FOREGROUND notifications (when tab is open)
//     onMessage(messaging, (payload) => {
//       console.log("🔔 Foreground notification received:", payload);

//       const { title, body } = payload.notification || {};

//       if (title && body) {
//         new Notification(title, { body });
//       }
//     });
//   } catch (error) {
//     console.error("❌ Notification setup failed:", error);
//   }
// }
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

// 🔑 VAPID KEY
const VAPID_KEY =
  "BKXF08nk1Mdsg6wxM9QGox7fhd6F2jDBAkPvQ5IohcxdFoWoj5a2LAdRhz1yhmf7r6RirzjrWkFSxgCTSargQlA";

// prevent duplicate setup
let initialized = false;

export async function setupNotifications({ onUnreadIncrement } = {}) {

  if (initialized) return;
  initialized = true;

  try {
    // 1️⃣ permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("🔕 Notification permission denied");
      return;
    }

    // 2️⃣ token
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });

    if (!token) {
      console.log("❌ No FCM token");
      return;
    }

    console.log("✅ FCM TOKEN:", token);

    // 3️⃣ save token
    await axiosInstance.post("/api/auth/save-fcm-token/", { token });
    console.log("✅ FCM token saved");

    // 4️⃣ foreground handling
    onMessage(messaging, (payload) => {
      console.log("🔔 Foreground notification:", payload);

      const { title, body } = payload.notification || {};

      // 🔥 TOAST
      if (title) {
        toast.info(title, {
          position: "top-right",
          autoClose: 4000,
        });
      }

      // 🔔 browser notification
      if (title && body) {
        new Notification(title, { body });
      }

      // 🔢 badge increment
      if (onUnreadIncrement) {
        onUnreadIncrement();
      }
    });
  } catch (err) {
    if (err.response?.status === 403) {
      console.log("🔒 Notification setup skipped: Unauthenticated");
      return;
    }
    console.error("❌ Notification setup error:", err);
  }
}
