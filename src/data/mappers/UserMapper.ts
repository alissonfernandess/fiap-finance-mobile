import type { User } from '@/domain/entities';
import { User as FirebaseUser } from 'firebase/auth';

interface FirestoreUser {
  name: string;
  email: string;
  phone?: string;
  createdAt: { toDate: () => Date } | Date | { seconds: number; nanoseconds: number };
  updatedAt: { toDate: () => Date } | Date | { seconds: number; nanoseconds: number };
}

function toDate(value: { toDate: () => Date } | Date | { seconds: number; nanoseconds: number }): Date {
  if (value && typeof value === 'object' && 'toDate' in value) return value.toDate();
  if (value && typeof value === 'object' && 'seconds' in value) {
    return new Date(value.seconds * 1000 + value.nanoseconds / 1e6);
  }
  return new Date(value);
}

export class UserMapper {
  static fromFirestore(id: string, data: FirestoreUser): User {
    return {
      id,
      email: data.email,
      name: data.name,
      phone: data.phone,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
    };
  }

  static fromFirebaseUser(firebaseUser: FirebaseUser): User {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      name: firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'Usuário',
      photoUrl: firebaseUser.photoURL ?? undefined,
      createdAt: new Date(firebaseUser.metadata.creationTime ?? Date.now()),
      updatedAt: new Date(firebaseUser.metadata.lastSignInTime ?? Date.now()),
    };
  }
}