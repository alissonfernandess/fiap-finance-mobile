import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { queryKeys } from '@/data/cache/queryKeys';
import {
  GetTransactionsUseCase,
  CreateTransactionUseCase,
  UpdateTransactionUseCase,
  DeleteTransactionUseCase,
} from '@/domain/use-cases/transactions';
import { TransactionRepositoryImpl } from '@/data/repositories/TransactionRepositoryImpl';
import type { Transaction, CreateTransactionDTO, UpdateTransactionDTO, TransactionFilters } from '@/domain/entities';

const transactionRepository = new TransactionRepositoryImpl();
const getTransactionsUseCase = new GetTransactionsUseCase(transactionRepository);
const createTransactionUseCase = new CreateTransactionUseCase(transactionRepository);
const updateTransactionUseCase = new UpdateTransactionUseCase(transactionRepository);
const deleteTransactionUseCase = new DeleteTransactionUseCase(transactionRepository);

function filtersToRecord(filters?: TransactionFilters): Record<string, unknown> | undefined {
  if (!filters) return undefined;
  return {
    search: filters.search,
    operation: filters.operation,
    category: filters.category,
    startDate: filters.startDate,
    endDate: filters.endDate,
    page: filters.page,
    pageSize: filters.pageSize,
  };
}

export function useTransactions(filters?: TransactionFilters) {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: queryKeys.transactions.list(userId ?? '', filtersToRecord(filters)),
    queryFn: () => getTransactionsUseCase.execute(userId!, filters),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useTransaction(transactionId: string) {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: queryKeys.transactions.detail(userId ?? '', transactionId),
    queryFn: () => transactionRepository.getTransactionById(userId!, transactionId),
    enabled: !!userId && !!transactionId,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (data: CreateTransactionDTO) => createTransactionUseCase.execute(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionDTO }) =>
      updateTransactionUseCase.execute(user!.id, id, data),
    onSuccess: (updatedTransaction) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
      queryClient.setQueryData(
        queryKeys.transactions.detail(user!.id, updatedTransaction.id),
        updatedTransaction,
      );
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (transactionId: string) => deleteTransactionUseCase.execute(user!.id, transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions.all });
    },
  });
}