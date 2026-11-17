export const routes = {
  auth: {
    login: '/(auth)/login',
    register: '/(auth)/cadastro',
    welcome: '/(auth)/boas-vindas',
  },
  private: {
    dashboard: '/(private)/dashboard',
    transactions: '/(private)/extrato',
    analysis: '/(private)/analise',
    transactionDetail: (id: string) => `/(private)/transacao/${id}`,
    newTransaction: '/(private)/transacao/nova',
  },
} as const;

export type AuthRoute = (typeof routes.auth)[keyof typeof routes.auth];
export type PrivateRoute = (typeof routes.private)[keyof typeof routes.private];