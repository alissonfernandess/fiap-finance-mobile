export const queryKeys = {
  auth: {
    currentUser: ['auth', 'currentUser'] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    list: (userId: string, filters?: Record<string, unknown>) =>
      ['transactions', 'list', userId, filters] as const,
    detail: (userId: string, transactionId: string) =>
      ['transactions', 'detail', userId, transactionId] as const,
  },
  receipts: {
    all: ['receipts'] as const,
    byTransaction: (userId: string, transactionId: string) =>
      ['receipts', 'byTransaction', userId, transactionId] as const,
  },
  user: {
    profile: (userId: string) => ['user', 'profile', userId] as const,
  },
} as const;