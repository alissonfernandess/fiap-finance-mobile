import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { queryKeys } from '../../data/cache/queryKeys';
import {
  UploadReceiptUseCase,
  DeleteReceiptUseCase,
} from '../../domain/use-cases/receipts';
import { ReceiptRepositoryImpl } from '../../data/repositories/ReceiptRepositoryImpl';
import type { UploadReceiptDTO } from '../../domain/entities';

// Initialize use cases
const receiptRepository = new ReceiptRepositoryImpl();
const uploadReceiptUseCase = new UploadReceiptUseCase(receiptRepository);
const deleteReceiptUseCase = new DeleteReceiptUseCase(receiptRepository);

export function useReceipts(transactionId: string) {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: queryKeys.receipts.byTransaction(userId ?? '', transactionId),
    queryFn: () => receiptRepository.getReceiptsByTransaction(userId!, transactionId),
    enabled: !!userId && !!transactionId,
  });
}

export function useUploadReceipt() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (data: UploadReceiptDTO) => uploadReceiptUseCase.execute(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.receipts.all });
    },
  });
}

export function useDeleteReceipt() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: (receiptId: string) => deleteReceiptUseCase.execute(user!.id, receiptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.receipts.all });
    },
  });
}