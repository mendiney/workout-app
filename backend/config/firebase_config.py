import firebase_admin
from firebase_admin import credentials

cred = credentials.Certificate("config/firebase-admin-key.json")
firebase_admin.initialize_app(cred) 