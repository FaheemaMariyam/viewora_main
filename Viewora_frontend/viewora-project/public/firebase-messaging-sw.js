/* global self */
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBk-8WAR1Xpg6Wdz7tywqP8Mw-PDerztnM",
  authDomain: "viewora-notification.firebaseapp.com",
  projectId: "viewora-notification",
  messagingSenderId: "439946140444",
  appId: "1:439946140444:web:cb659395952469092338d9",
});

const messaging = firebase.messaging();

// 🔔 Background notifications (tab closed)
messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
    }
  );
});
