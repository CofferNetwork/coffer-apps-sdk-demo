"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { CofferAppProvider } from "@coffer-network/apps-react-sdk";

import { getQueryClient } from "@/get-query-client";
import type * as React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <CofferAppProvider opts={{ sdk: { origin: "https://localhost:5173" } }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </CofferAppProvider>
  );
}
