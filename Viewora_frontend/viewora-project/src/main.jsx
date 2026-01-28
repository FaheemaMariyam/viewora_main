// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { BrowserRouter } from "react-router-dom";
// import { AuthProvider } from "./auth/AuthContext";

// createRoot(document.getElementById('root')).render(
//   // <StrictMode>
//     <BrowserRouter>
//     <AuthProvider>
//     <App />
//      </AuthProvider>
//   </BrowserRouter>
//   // </StrictMode>,
// )
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
console.log("🔍 DIAGNOSTICS:");
console.log("- Google Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
console.log("- Firebase Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log("- Firebase API Key Initial:", import.meta.env.VITE_FIREBASE_API_KEY?.substring(0, 10) + "...");

// 🔔 REGISTER FIREBASE SERVICE WORKER (REQUIRED)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("✅ Firebase Service Worker registered:", registration);
      })
      .catch((error) => {
        console.error("❌ Service Worker registration failed:", error);
      });
  });
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <App />
    </AuthProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
