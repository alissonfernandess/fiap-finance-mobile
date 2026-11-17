import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  Timestamp,
  serverTimestamp,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  onSnapshot,
  QueryConstraint,
} from 'firebase/firestore';
import { getFirestoreInstance } from '@/infrastructure/firebase/config';
import type { Transaction, CreateTransactionDTO, UpdateTransactionDTO, TransactionFilters, PaginatedTransactions } from '@/domain/entities';
import type { ITransactionRepository } from '@/domain/repositories';
import { TransactionMapper } from '@/data/mappers/TransactionMapper';

interface FirestoreTransaction {
  description: string;
  date: string;
  value: number;
  operation: 'income' | 'expense';
  type: 'pix' | 'boleto' | 'saque' | 'deposito' | 'ted' | 'doc';
  category: string;
  receiptUrl?: string;
  createdAt: { toDate: () => Date } | Date | { seconds: number; nanoseconds: number };
  updatedAt: { toDate: () => Date } | Date | { seconds: number; nanoseconds: number };
}

export class FirebaseTransactionDataSource implements ITransactionRepository {
  private getCollection(userId: string) {
    return collection(getFirestoreInstance(), 'users', userId, 'transactions');
  }

  async getTransactions(
    userId: string,
    filters?: TransactionFilters,
  ): Promise<PaginatedTransactions> {
    const constraints: QueryConstraint[] = [
      orderBy('createdAt', 'desc'),
    ];

    if (filters?.operation && filters.operation !== 'all') {
      constraints.push(where('operation', '==', filters.operation));
    }

    if (filters?.category && filters.category !== 'all') {
      constraints.push(where('category', '==', filters.category));
    }

    if (filters?.startDate) {
      constraints.push(where('date', '>=', filters.startDate));
    }

    if (filters?.endDate) {
      constraints.push(where('date', '<=', filters.endDate));
    }

    const pageSize = filters?.pageSize ?? 20;
    constraints.push(limit(pageSize + 1));

    const transactionsQuery = query(this.getCollection(userId), ...constraints);
    const snapshot = await getDocs(transactionsQuery);

    const transactions = snapshot.docs
      .slice(0, pageSize)
      .map((docSnap) => TransactionMapper.fromFirestore(docSnap.id, docSnap.data() as FirestoreTransaction));

    let filtered = transactions;
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = transactions.filter(
        (t) => t.description.toLowerCase().includes(searchLower),
      );
    }

    const hasMore = snapshot.docs.length > pageSize;

    return {
      transactions: filtered,
      total: filtered.length,
      page: filters?.page ?? 1,
      pageSize,
      hasMore,
    };
  }

  async getTransactionById(
    userId: string,
    transactionId: string,
  ): Promise<Transaction | null> {
    const docRef = doc(getFirestoreInstance(), 'users', userId, 'transactions', transactionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return TransactionMapper.fromFirestore(docSnap.id, docSnap.data() as FirestoreTransaction);
  }

  async createTransaction(
    userId: string,
    data: CreateTransactionDTO,
  ): Promise<Transaction> {
    const collectionRef = this.getCollection(userId);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    const newDoc = await getDoc(docRef);
    return TransactionMapper.fromFirestore(newDoc.id, newDoc.data() as FirestoreTransaction);
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    data: UpdateTransactionDTO,
  ): Promise<Transaction> {
    const docRef = doc(getFirestoreInstance(), 'users', userId, 'transactions', transactionId);
    
    const updateData: Record<string, unknown> = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    if (data.receiptUrl === null) {
      updateData.receiptUrl = deleteField();
    }

    await updateDoc(docRef, updateData);
    
    const updatedDoc = await getDoc(docRef);
    return TransactionMapper.fromFirestore(updatedDoc.id, updatedDoc.data() as FirestoreTransaction);
  }

  async deleteTransaction(
    userId: string,
    transactionId: string,
  ): Promise<void> {
    const docRef = doc(getFirestoreInstance(), 'users', userId, 'transactions', transactionId);
    await deleteDoc(docRef);
  }

  subscribeToTransactions(
    userId: string,
    callback: (transactions: Transaction[]) => void,
  ): () => void {
    const transactionsQuery = query(
      this.getCollection(userId),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(
      transactionsQuery,
      (snapshot) => {
        const transactions = snapshot.docs.map((docSnap) =>
          TransactionMapper.fromFirestore(docSnap.id, docSnap.data() as FirestoreTransaction),
        );
        callback(transactions);
      },
      (error) => {
        console.error('Erro ao ouvir transações:', error);
      },
    );

    return unsubscribe;
  }
}