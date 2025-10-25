"use client";

import { ParaProvider as ParaSDKProvider } from "@getpara/react-sdk";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import "@getpara/react-sdk/styles.css";

export function ParaProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ParaSDKProvider
        paraClientConfig={{
          apiKey: process.env.NEXT_PUBLIC_PARA_API_KEY || "",
        }}
        config={{
          appName: "Auth XMCP Next.js",
          disableAutoSessionKeepAlive: false,
        }}
      >
        {children}
      </ParaSDKProvider>
    </QueryClientProvider>
  );
}
