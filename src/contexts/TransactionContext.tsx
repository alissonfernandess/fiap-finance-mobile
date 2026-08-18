import {
    createContext,
    useContext,
    useMemo,
    useReducer,
    type PropsWithChildren,
} from 'react';

import { transactions as initialTransactions } from '@/mocks/transactions';
import type { Transaction } from '@/types/transaction';

interface TransactionState {
  transactions: Transaction[];
}

type TransactionAction =
  | {
      type: 'ADD_TRANSACTION';
      payload: Transaction;
    }
  | {
      type: 'UPDATE_TRANSACTION';
      payload: {
        id: string;
        data: Partial<Transaction>;
      };
    }
  | {
      type: 'DELETE_TRANSACTION';
      payload: string;
    };

interface TransactionContextValue {
  transactions: Transaction[];
  addTransaction: (
    transaction: Omit<Transaction, 'id'>,
  ) => void;
  updateTransaction: (
    id: string,
    data: Partial<Transaction>,
  ) => void;
  deleteTransaction: (id: string) => void;
}

const TransactionContext =
  createContext<TransactionContextValue | undefined>(
    undefined,
  );

function transactionReducer(
  state: TransactionState,
  action: TransactionAction,
): TransactionState {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [
          action.payload,
          ...state.transactions,
        ],
      };

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(
          (transaction) =>
            transaction.id === action.payload.id
              ? {
                  ...transaction,
                  ...action.payload.data,
                }
              : transaction,
        ),
      };

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) =>
            transaction.id !== action.payload,
        ),
      };

    default:
      return state;
  }
}

export function TransactionProvider({
  children,
}: PropsWithChildren) {
  const [state, dispatch] = useReducer(
    transactionReducer,
    {
      transactions: initialTransactions,
    },
  );

  const value = useMemo<TransactionContextValue>(
    () => ({
      transactions: state.transactions,

      addTransaction(transaction) {
        dispatch({
          type: 'ADD_TRANSACTION',
          payload: {
            ...transaction,
            id: `${Date.now()}-${Math.random()}`,
          },
        });
      },

      updateTransaction(id, data) {
        dispatch({
          type: 'UPDATE_TRANSACTION',
          payload: {
            id,
            data,
          },
        });
      },

      deleteTransaction(id) {
        dispatch({
          type: 'DELETE_TRANSACTION',
          payload: id,
        });
      },
    }),
    [state.transactions],
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