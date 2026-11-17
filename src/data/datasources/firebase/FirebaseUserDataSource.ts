import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getFirestoreInstance } from '@/infrastructure/firebase/config';
import type { User, CreateUserDTO, UpdateUserDTO } from '@/domain/entities';
import type { IUserRepository } from '@/domain/repositories';
import { UserMapper } from '@/data/mappers/UserMapper';

interface FirestoreUser {
  name: string;
  email: string;
  phone?: string;
  createdAt: { toDate: () => Date } | Date | { seconds: number; nanoseconds: number };
  updatedAt: { toDate: () => Date } | Date | { seconds: number; nanoseconds: number };
}

export class FirebaseUserDataSource implements IUserRepository {
  private getUserRef(userId: string) {
    return doc(getFirestoreInstance(), 'users', userId);
  }

  async getUserById(userId: string): Promise<User | null> {
    const docRef = this.getUserRef(userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return UserMapper.fromFirestore(docSnap.id, docSnap.data() as FirestoreUser);
  }

  async updateUser(userId: string, data: UpdateUserDTO): Promise<User> {
    const docRef = this.getUserRef(userId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    const updatedDoc = await getDoc(docRef);
    return UserMapper.fromFirestore(updatedDoc.id, updatedDoc.data() as FirestoreUser);
  }

  async deleteUser(userId: string): Promise<void> {
    throw new Error('Delete user not implemented - requires Cloud Function');
  }
}