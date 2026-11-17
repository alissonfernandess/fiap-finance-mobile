import {
  initializeApp,
  getApps,
  getApp,
  type FirebaseApp,
} from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  type Auth,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: FirebaseApp;
let firebaseAuth: Auth;
let firestore: Firestore;
let firebaseStorage: FirebaseStorage;

let authInitialized = false;

export function initializeFirebase(): void {
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }

  if (!authInitialized) {
    firebaseAuth = createFirebaseAuth();
    authInitialized = true;
  }
  
  firestore = getFirestore(firebaseApp);
  firebaseStorage = getStorage(firebaseApp);
}

function createFirebaseAuth(): Auth {
  if (Platform.OS === 'web') {
    return getAuth(firebaseApp);
  }

  try {
    // Dynamic import to avoid TypeScript issues
    const { getReactNativePersistence } = require('firebase/auth');
    return initializeAuth(firebaseApp, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(firebaseApp);
  }
}

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    initializeFirebase();
  }
  return firebaseApp;
}

export function getFirebaseAuth(): Auth {
  if (!firebaseAuth) {
    initializeFirebase();
  }
  return firebaseAuth;
}

export function getFirestoreInstance(): Firestore {
  if (!firestore) {
    initializeFirebase();
  }
  return firestore;
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!firebaseStorage) {
    initializeFirebase();
  }
  return firebaseStorage;
}