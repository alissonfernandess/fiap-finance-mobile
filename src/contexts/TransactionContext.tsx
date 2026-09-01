import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import {
  firebaseAuth,
  firestore,
} from '@/services/firebase';

import type { Transaction } from '@/types/transaction';

type TransactionUpdate =
  Omit<
    Partial<Transaction>,
    'id' | 'receiptUrl'
  > & {
    receiptUrl?: string | null;
  };

interface TransactionContextValue {
  transactions: Transaction[];
  isLoadingTransactions: boolean;

  addTransaction: (
    transaction: Omit<Transaction, 'id'>,
  ) => Promise<void>;

  updateTransaction: (
    id: string,
    data: TransactionUpdate,
  ) => Promise<void>;

  deleteTransaction: (
    id: string,
  ) => Promise<void>;
}

const TransactionContext =
  createContext<TransactionContextValue | undefined>(
    undefined,
  );

function getTransactionsCollection(
  userId: string,
) {
  return collection(
    firestore,
    'users',
    userId,
    'transactions',
  );
}

export function TransactionProvider({
  children,
}: PropsWithChildren) {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [
    isLoadingTransactions,
    setIsLoadingTransactions,
  ] = useState(true);

  useEffect(() => {
    let unsubscribeTransactions:
      | (() => void)
      | undefined;

    const unsubscribeAuth =
      firebaseAuth.onAuthStateChanged((user) => {
        unsubscribeTransactions?.();

        if (!user) {
          setTransactions([]);
          setIsLoadingTransactions(false);
          return;
        }

        setIsLoadingTransactions(true);

        const transactionsQuery = query(
          getTransactionsCollection(user.uid),
          orderBy('createdAt', 'desc'),
        );

        unsubscribeTransactions = onSnapshot(
          transactionsQuery,
          (snapshot) => {
            const loadedTransactions =
              snapshot.docs.map(
                (transactionDocument) => ({
                  id: transactionDocument.id,
                  ...transactionDocument.data(),
                }),
              ) as Transaction[];

            setTransactions(loadedTransactions);
            setIsLoadingTransactions(false);
          },
          (error) => {
            console.error(
              'Erro ao carregar transações:',
              error,
            );

            setTransactions([]);
            setIsLoadingTransactions(false);
          },
        );
      });

    return () => {
      unsubscribeAuth();
      unsubscribeTransactions?.();
    };
  }, []);

  const value = useMemo<TransactionContextValue>(
    () => ({
      transactions,
      isLoadingTransactions,

      async addTransaction(transaction) {
        const currentUser =
          firebaseAuth.currentUser;

        if (!currentUser) {
          throw new Error(
            'Nenhum usuário autenticado.',
          );
        }

        await addDoc(
          getTransactionsCollection(
            currentUser.uid,
          ),
          {
            ...transaction,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
        );
      },

      async updateTransaction(id, data) {
        const currentUser =
          firebaseAuth.currentUser;

        if (!currentUser) {
          throw new Error(
            'Nenhum usuário autenticado.',
          );
        }

        const transactionReference = doc(
          firestore,
          'users',
          currentUser.uid,
          'transactions',
          id,
        );

        const firestoreData: Record<
          string,
          unknown
        > = {
          ...data,
          updatedAt: serverTimestamp(),
        };

        if (data.receiptUrl === null) {
          firestoreData.receiptUrl =
            deleteField();
        }

        await updateDoc(
          transactionReference,
          firestoreData,
        );
  
      },

      async deleteTransaction(id) {
        const currentUser =
          firebaseAuth.currentUser;

        if (!currentUser) {
          throw new Error(
            'Nenhum usuário autenticado.',
          );
        }

        const transactionReference = doc(
          firestore,
          'users',
          currentUser.uid,
          'transactions',
          id,
        );

        await deleteDoc(transactionReference);
      },
    }),
    [transactions, isLoadingTransactions],
  );

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);

  if (!context) {
    throw new Error(
      'useTransactions deve ser usado dentro de TransactionProvider',
    );
  }

  return context;
}