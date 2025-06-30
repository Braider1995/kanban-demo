// src/firebase.js

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Deine Firebase-Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyBy2QOHUrSUGdZXrUfNwsKbXH3lOqtsXns",
  authDomain: "kanban-qr-6039d.firebaseapp.com",
  databaseURL: "https://kanban-qr-6039d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kanban-qr-6039d",
  storageBucket: "kanban-qr-6039d.appspot.com",
  messagingSenderId: "91304321412",
  appId: "1:91304321412:web:204298aebd47d8540dbdd1"
};

// Firebase initialisieren
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
