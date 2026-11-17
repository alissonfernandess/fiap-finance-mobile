import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  updatePassword,
} from 'firebase/auth';
import { getFirebaseAuth, getFirestoreInstance } from '@/infrastructure/firebase/config';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import type { User, AuthTokens, LoginCredentials, RegisterData } from '@/domain/entities';
import type { IAuthRepository } from '@/domain/repositories';
import { UserMapper } from '@/data/mappers/UserMapper';

interface FirestoreUser {
  name: string;
  email: string;
  phone?: string;
  createdAt: { toDate: () => Date } | Date | { seconds: number; nanoseconds: number };
  updatedAt: { toDate: () => Date } | Date | { seconds: number; nanoseconds: number };
}

export class FirebaseAuthDataSource implements IAuthRepository {
  private auth = getFirebaseAuth();

  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    const credential = await signInWithEmailAndPassword(
      this.auth,
      credentials.email.trim().toLowerCase(),
      credentials.password,
    );

    const user = await this.getOrCreateUserProfile(credential.user);
    const tokens = await this.getTokens(credential.user);

    return { user, tokens };
  }

  async register(data: RegisterData): Promise<{ user: User; tokens: AuthTokens }> {
    const formattedName = data.name.trim();
    const formattedEmail = data.email.trim().toLowerCase();
    const formattedPhone = data.phone?.trim();

    const credential = await createUserWithEmailAndPassword(
      this.auth,
      formattedEmail,
      data.password,
    );

    await updateProfile(credential.user, {
      displayName: formattedName,
    });

    await setDoc(
      doc(getFirestoreInstance(), 'users', credential.user.uid),
      {
        name: formattedName,
        phone: formattedPhone,
        email: formattedEmail,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
    );

    const user = UserMapper.fromFirebaseUser(credential.user);
    const tokens = await this.getTokens(credential.user);

    return { user, tokens };
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = this.auth.currentUser;
    if (!firebaseUser) return null;

    return this.getOrCreateUserProfile(firebaseUser);
  }

  async refreshToken(): Promise<AuthTokens> {
    const firebaseUser = this.auth.currentUser;
    if (!firebaseUser) {
      throw new Error('Nenhum usuário autenticado');
    }
    return this.getTokens(firebaseUser);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email.trim().toLowerCase());
  }

  async updatePassword(newPassword: string): Promise<void> {
    const firebaseUser = this.auth.currentUser;
    if (!firebaseUser) {
      throw new Error('Nenhum usuário autenticado');
    }
    await updatePassword(firebaseUser, newPassword);
  }

  subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = await this.getOrCreateUserProfile(firebaseUser);
        callback(user);
      } else {
        callback(null);
      }
    });
  }

  private async getOrCreateUserProfile(firebaseUser: FirebaseUser): Promise<User> {
    const docRef = doc(getFirestoreInstance(), 'users', firebaseUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return UserMapper.fromFirestore(docSnap.id, docSnap.data() as FirestoreUser);
    }

    return UserMapper.fromFirebaseUser(firebaseUser);
  }

  private async getTokens(firebaseUser: FirebaseUser): Promise<AuthTokens> {
    const token = await firebaseUser.getIdToken();
    const tokenResult = await firebaseUser.getIdTokenResult();
    
    return {
      accessToken: token,
      refreshToken: '',
      expiresIn: Math.floor((Number(tokenResult.expirationTime) - Date.now()) / 1000),
    };
  }
}