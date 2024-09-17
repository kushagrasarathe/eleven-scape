'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';

import React from 'react';
import store from '@/redux/store';

function Provider({ children }: React.PropsWithChildren<{}>) {
  const [client] = React.useState(new QueryClient());

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </ReduxProvider>
  );
}
export default Provider;
