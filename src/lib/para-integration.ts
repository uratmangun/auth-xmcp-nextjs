/**
 * Para Integration Bridge
 * 
 * This module bridges Better Auth OIDC authentication with Para wallet creation.
 * After a user authenticates via Better Auth (using email/password or social OAuth),
 * we use their email to create or link a Para wallet.
 * 
 * Flow:
 * 1. User signs in via Better Auth (OIDC provider)
 * 2. We get the user's email from the session
 * 3. Use Para SDK to create/login wallet based on email
 * 4. Store Para wallet info in Better Auth user record
 */

export interface ParaWalletInfo {
  walletId: string;
  email: string;
  recoverySecret?: string;
}

/**
 * Client-side Para wallet integration
 * This should be called from the client after Better Auth authentication
 */
export const paraClientIntegration = {
  /**
   * Initialize Para wallet for authenticated user
   * This is a client-side helper that uses Para's SDK
   * 
   * @param email - User's email from Better Auth session
   * @returns Para wallet information
   */
  async initializeWallet(email: string): Promise<ParaWalletInfo | null> {
    try {
      // Note: Para SDK should be imported and initialized on client
      // This is a placeholder for the actual implementation
      
      // Check if Para is available (should be loaded via script tag or import)
      if (typeof window === 'undefined') {
        throw new Error('Para wallet initialization must be called from client');
      }

      // The actual Para integration would look like:
      // 1. Check if user exists in Para
      // const para = new Para(process.env.NEXT_PUBLIC_PARA_API_KEY);
      // const userExists = await para.checkIfUserExists({ email });
      
      // 2. If user exists, initiate login
      // if (userExists) {
      //   const authUrl = await para.initiateUserLogin({ email, useShortUrl: false });
      //   const popup = window.open(authUrl, "loginPopup", "popup=true");
      //   await para.waitForLoginAndSetup({ popupWindow: popup });
      // } else {
      //   // 3. If new user, create wallet
      //   const setupUrl = await para.getSetUpBiometricsURL({ 
      //     authType: "email", 
      //     isForNewDevice: false 
      //   });
      //   const popup = window.open(setupUrl, "signUpPopup", "popup=true");
      //   const res = await para.waitForPasskeyAndCreateWallet();
      //   if ("needsWallet" in res && res.needsWallet) {
      //     await para.createWallet({ skipDistribute: false });
      //   }
      //   if ("recoverySecret" in res) {
      //     return { walletId: "...", email, recoverySecret: res.recoverySecret };
      //   }
      // }

      console.log('Para wallet initialization for:', email);
      return null;
    } catch (error) {
      console.error('Para wallet initialization failed:', error);
      return null;
    }
  },

  /**
   * Link existing Para wallet to Better Auth session
   */
  async linkWallet(email: string, walletId: string): Promise<boolean> {
    try {
      // Call your API endpoint to update user record with Para wallet info
      const response = await fetch('/api/auth/link-para-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, walletId }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to link Para wallet:', error);
      return false;
    }
  },
};

/**
 * Server-side Para wallet helpers
 */
export const paraServerIntegration = {
  /**
   * Update user record with Para wallet information
   * This should be called from a server action or API route
   */
  async updateUserWithParaWallet(
    userId: string,
    walletInfo: ParaWalletInfo
  ): Promise<boolean> {
    try {
      // This would update the Better Auth user record
      // with Para wallet information using the auth instance
      
      // Example:
      // await auth.api.updateUser({
      //   userId,
      //   data: {
      //     paraWalletId: walletInfo.walletId,
      //     paraEmail: walletInfo.email,
      //   },
      // });

      return true;
    } catch (error) {
      console.error('Failed to update user with Para wallet:', error);
      return false;
    }
  },
};

/**
 * Para OAuth configuration for Better Auth Generic OAuth plugin
 * This can be used if Para provides direct OAuth endpoints
 */
export const paraOAuthConfig = {
  // If Para has OAuth endpoints, configure them here
  // This would be used with Better Auth's Generic OAuth plugin
  providerId: "para",
  clientId: process.env.PARA_CLIENT_ID || "",
  clientSecret: process.env.PARA_CLIENT_SECRET || "",
  // authorizationUrl: "https://para-oauth-url/authorize",
  // tokenUrl: "https://para-oauth-url/token",
  // userInfoUrl: "https://para-oauth-url/userinfo",
};
