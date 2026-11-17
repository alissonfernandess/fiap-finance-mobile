import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/data/cache/queryClient';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}