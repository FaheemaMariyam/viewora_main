import os

import firebase_admin
from django.conf import settings
from firebase_admin import credentials, messaging

if not firebase_admin._apps:
    # Use environment variable for the path, fallback to the default relative path
    firebase_cred_path = os.getenv(
        "FIREBASE_CREDENTIALS",
        os.path.join(settings.BASE_DIR, "firebase/firebase.json")
    )
    
    try:
        cred = credentials.Certificate(firebase_cred_path)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Error initializing Firebase with {firebase_cred_path}: {e}")


def send_push_notification(token, title, body, data=None):
    if not token:
        return

    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        token=token,
        data=data or {},
    )

    messaging.send(message)
