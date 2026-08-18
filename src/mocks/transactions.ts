import type { Transaction } from '@/types/transaction';

export const transactions: Transaction[] = [
  {
    id: '1',
    description: 'Transferência DOC para Nubank',
    date: '03/02/2026',
    value: 300,
    operation: 'expense',
    type: 'doc',
  },
  {
    id: '2',
    description: 'Transferência Pix de João',
    date: '02/02/2026',
    value: 250,
    operation: 'income',
    type: 'pix',
  },
  {
    id: '3',
    description: 'Pagamento via boleto',
    date: '10/01/2026',
    value: 300,
    operation: 'expense',
    type: 'boleto',
  },
  {
    id: '4',
    description: 'Depósito em conta',
    date: '08/01/2026',
    value: 500,
    operation: 'income',
    type: 'deposito',
  },
  {
    id: '5',
    description: 'Saque em caixa eletrônico',
    date: '05/01/2026',
    value: 100,
    operation: 'expense',
    type: 'saque',
  },
  {
    id: '6',
    description: 'Transferência TED',
    date: '02/01/2026',
    value: 200,
    operation: 'expense',
    type: 'ted',
  },
];