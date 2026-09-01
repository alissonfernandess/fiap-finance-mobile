import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    getApp,
    getApps,
    initializeApp,
} from 'firebase/app';
import * as FirebaseAuthModule from 'firebase/auth';
import {
    getAuth,
    initializeAuth,
    type Auth,
    type Persistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId:
    process.env
      .EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const firebaseApp = getApps().length
  ? getApp()
  : initializeApp(firebaseConfig);

interface ReactNativeAuthModule {
  getReactNativePersistence: (
    storage: typeof AsyncStorage,
  ) => Persistence;
}

function createFirebaseAuth(): Auth {
  if (Platform.OS === 'web') {
    return getAuth(firebaseApp);
  }

  const reactNativeAuth =
    FirebaseAuthModule as typeof FirebaseAuthModule &
      ReactNativeAuthModule;

  if (
    typeof reactNativeAuth
      .getReactNativePersistence !== 'function'
  ) {
    return getAuth(firebaseApp);
  }

  try {
    return initializeAuth(firebaseApp, {
      persistence:
        reactNativeAuth.getReactNativePersistence(
          AsyncStorage,
        ),
    });
  } catch {
    return getAuth(firebaseApp);
  }
}

export const firebaseAuth =
  createFirebaseAuth();

export const firestore =
  getFirestore(firebaseApp);

export const firebaseStorage =
  getStorage(firebaseApp);