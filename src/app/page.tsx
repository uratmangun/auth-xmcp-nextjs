"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [endpoint, setEndpoint] = useState("http://localhost:3000/mcp");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const origin = window.location.origin;
    setEndpoint(`${origin}/mcp`);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(endpoint);
      setCopied(true);
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    } catch (error) {
      console.error("Failed to copy MCP endpoint", error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-50 dark:bg-gray-900">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div className="flex flex-col items-center sm:items-start w-full">
          <span className="text-sm font-medium text-foreground/70 mb-2">
            MCP endpoint
          </span>
          <div className="flex w-full max-w-xl items-stretch gap-2">
            <code className="flex-1 rounded-lg border border-black/[.08] dark:border-white/[.145] bg-black/[.05] dark:bg-white/[.07] px-4 py-3 text-sm sm:text-base font-[family-name:var(--font-geist-mono)]">
              {endpoint}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg border border-solid border-black/[.08] dark:border-white/[.145] bg-white/80 dark:bg-white/[.08] px-4 py-2 text-sm font-medium transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
