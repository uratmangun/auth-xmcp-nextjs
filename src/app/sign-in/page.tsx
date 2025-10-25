"use client";

import { ParaModal, useModal, OAuthMethod, useAccount, useLogout } from "@getpara/react-sdk";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage() {
  const { openModal, closeModal, isOpen } = useModal();
  const { data: account } = useAccount();
  const { logoutAsync } = useLogout();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOAuthFlow, setIsOAuthFlow] = useState(false);

  // Check if this is an OAuth authorization flow
  useEffect(() => {
    const responseType = searchParams.get("response_type");
    const clientId = searchParams.get("client_id");
    const redirectUri = searchParams.get("redirect_uri");
    
    if (responseType && clientId && redirectUri) {
      setIsOAuthFlow(true);
      console.log("OAuth flow detected:", {
        responseType,
        clientId,
        redirectUri: decodeURIComponent(redirectUri),
      });
    }
  }, [searchParams]);

  // Hide Para modal overlay elements when modal is closed
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const cpslModals = document.querySelectorAll('cpsl-auth-modal');
      
      if (!isOpen) {
        // Hide all cpsl-auth-modal elements that may be blocking the UI
        cpslModals.forEach(modal => {
          (modal as HTMLElement).style.display = 'none';
        });
        console.log('Para modal overlays hidden, isOpen:', isOpen);
      } else {
        // Show them when modal is open - use block to override Para's display: none
        cpslModals.forEach(modal => {
          (modal as HTMLElement).style.display = 'block';
        });
        console.log('Para modal overlays shown, isOpen:', isOpen);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Don't auto-open modal - let user click the button instead
  // This prevents the overlay from blocking the UI on page load
  
  // Initial cleanup - hide any existing modal overlays on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const cpslModals = document.querySelectorAll('cpsl-auth-modal');
      cpslModals.forEach(modal => {
        (modal as HTMLElement).style.display = 'none';
      });
      console.log('Initial cleanup: Para modal overlays hidden');
    }, 200);

    return () => clearTimeout(timer);
  }, []); // Run only once on mount

  // Handle redirect after successful connection
  useEffect(() => {
    if (account?.isConnected && account.email) {
      const createBetterAuthSession = async () => {
        try {
          console.log("Creating Better Auth session for Para user:", account.email);
          
          // Close the Para modal immediately after connection
          closeModal();
          
          // Call our API to create a Better Auth session
          const response = await fetch("/api/auth/para-login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: account.email,
              walletAddress: account.address,
              walletId: account.walletId,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            console.error("Failed to create Better Auth session:", error);
            return;
          }

          const data = await response.json();
          console.log("Better Auth session created:", data);

          if (isOAuthFlow) {
            // For OAuth flow, redirect back to the authorize endpoint
            // to complete the authorization and get the code
            const currentUrl = new URL(window.location.href);
            const authorizeUrl = new URL("/api/auth/oauth2/authorize", window.location.origin);
            
            // Preserve all OAuth parameters
            currentUrl.searchParams.forEach((value, key) => {
              authorizeUrl.searchParams.set(key, value);
            });

            console.log("Redirecting to authorize endpoint:", authorizeUrl.toString());
            window.location.href = authorizeUrl.toString();
          } else {
            // Normal sign-in flow, redirect to home
            setTimeout(() => {
              router.push("/");
            }, 1000);
          }
        } catch (error) {
          console.error("Error creating Better Auth session:", error);
        }
      };

      createBetterAuthSession();
    }
  }, [account?.isConnected, account?.email, account?.address, account?.walletId, router, isOAuthFlow, closeModal]);

  const handleClick = () => {
    if (account?.isConnected) {
      logoutAsync();
    } else {
      console.log("Opening Para modal...");
      openModal();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {account?.isConnected ? "Welcome!" : "Sign in or Sign up"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isOAuthFlow 
              ? "OAuth Authorization Flow" 
              : "Authenticate with Para Wallet"}
          </p>
        </div>

        {account?.isConnected && (
          <div className="text-center space-y-4">
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-green-800 font-medium">✓ Connected</p>
              <p className="text-green-600 text-sm mt-1">
                {account.address?.slice(0, 6)}...{account.address?.slice(-4)}
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              {isOAuthFlow 
                ? "Completing authorization..." 
                : "Redirecting to dashboard..."}
            </p>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={handleClick}
            className={`w-full px-4 py-3 rounded-md font-medium transition-colors ${
              account?.isConnected
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {account?.isConnected ? "Sign out" : "Sign in with Para"}
          </button>
        </div>

        <ParaModal
          appName="Auth XMCP"
          logo="https://via.placeholder.com/100"
          onClose={() => {
            console.log("Para modal closed");
          }}
        />

        {isOAuthFlow && (
          <div className="text-center text-xs text-gray-500 mt-4">
            <p>You are being redirected from an external application.</p>
            <p className="mt-1">Client ID: {searchParams.get("client_id")?.slice(0, 8)}...</p>
          </div>
        )}
      </div>
    </div>
  );
}
