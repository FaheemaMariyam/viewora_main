// import { initializeApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyBk-8WAR1Xpg6Wdz7tywqP8Mw-PDerztnM",
//   authDomain: "viewora-notification.firebaseapp.com",
//   projectId: "viewora-notification",
//   storageBucket: "viewora-notification.firebasestorage.app",
//   messagingSenderId: "439946140444",
//   appId: "1:439946140444:web:cb659395952469092338d9",
// };

// const app = initializeApp(firebaseConfig);
// export const messaging = getMessaging(app);
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { 
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// 🔔 Existing
export const messaging = getMessaging(app);

// 🔐 NEW (Phone Auth)
export const auth = getAuth(app);
export { RecaptchaVerifier, signInWithPhoneNumber };
