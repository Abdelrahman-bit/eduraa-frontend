'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

type QueryProviderProps = {
   children: ReactNode;
};

const defaultOptions = {
   queries: {
      refetchOnWindowFocus: false,
      retry: 1,
   },
};

export function QueryProvider({ children }: QueryProviderProps) {
   const [client] = useState(() => new QueryClient({ defaultOptions }));

   return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
