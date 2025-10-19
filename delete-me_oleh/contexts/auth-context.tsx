import { clientId, discovery, scopes } from "@/constants/msalConfig";
import {
  AuthRequestPromptOptions,
  AuthSessionResult,
  exchangeCodeAsync,
  makeRedirectUri,
  refreshAsync,
  ResponseType,
  revokeAsync,
  TokenResponse,
  useAuthRequest,
} from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  tokenResponse: TokenResponse | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  promptAsync:
    | ((options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>)
    | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "auth_token_response";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenResponse, setTokenResponse] = useState<TokenResponse | null>(
    null
  );
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes,
      responseType: ResponseType.Code,
      usePKCE: true,
      redirectUri: makeRedirectUri({
        // Use native scheme for production, Expo Go scheme for development
        native: `msal${clientId}://auth`,
      }),
      extraParams: {
        // Always show account picker - allows user to choose account
        prompt: "select_account",
      },
    },
    discovery
  );

  // Check if user is already authenticated on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const exchangeCodeForToken = useCallback(
    async (code: string) => {
      try {
        const token = await exchangeCodeAsync(
          {
            clientId,
            code,
            redirectUri: makeRedirectUri({
              // Use native scheme for production, Expo Go scheme for development
              native: `msal${clientId}://auth`,
            }),
            extraParams: {
              code_verifier: request?.codeVerifier || "",
            },
          },
          discovery
        );

        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, JSON.stringify(token));
        setTokenResponse(token);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error exchanging code for token:", error);
        throw error;
      }
    },
    [request]
  );

  // Handle OAuth response
  useEffect(() => {
    if (response?.type === "success" && request) {
      exchangeCodeForToken(response.params.code);
    }
  }, [response, request, exchangeCodeForToken]);

  const checkAuthStatus = async () => {
    try {
      const storedTokenJson = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      if (storedTokenJson) {
        const storedToken = JSON.parse(storedTokenJson);
        const token = new TokenResponse(storedToken);

        // Check if token is expired and try to refresh
        if (token.shouldRefresh()) {
          try {
            const refreshedToken = await refreshAsync(
              {
                clientId,
                refreshToken: token.refreshToken!,
              },
              discovery
            );
            await SecureStore.setItemAsync(
              AUTH_TOKEN_KEY,
              JSON.stringify(refreshedToken)
            );
            setTokenResponse(refreshedToken);
            setIsAuthenticated(true);
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            // Refresh failed, user needs to login again
            await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
            setIsAuthenticated(false);
          }
        } else {
          // Token is still valid
          setTokenResponse(token);
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      if (!promptAsync) {
        throw new Error("Auth request not ready");
      }
      await promptAsync();
      // Token exchange happens in useEffect
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (tokenResponse?.accessToken) {
        // Revoke the token
        await revokeAsync(
          {
            clientId,
            token: tokenResponse.accessToken,
          },
          discovery
        );
      }
    } catch (error) {
      console.error("Error revoking token:", error);
      // Continue with logout even if revoke fails
    } finally {
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      setTokenResponse(null);
      setIsAuthenticated(false);
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!tokenResponse) return null;

    // If token is still valid, return it
    if (!tokenResponse.shouldRefresh()) {
      return tokenResponse.accessToken;
    }

    // Token is expired or about to expire, refresh it
    if (tokenResponse.refreshToken) {
      try {
        const refreshedToken = await refreshAsync(
          {
            clientId,
            refreshToken: tokenResponse.refreshToken,
          },
          discovery
        );
        await SecureStore.setItemAsync(
          AUTH_TOKEN_KEY,
          JSON.stringify(refreshedToken)
        );
        setTokenResponse(refreshedToken);
        return refreshedToken.accessToken;
      } catch (error) {
        console.error("Error refreshing token:", error);
        await logout();
        return null;
      }
    }

    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        tokenResponse,
        login,
        logout,
        getAccessToken,
        promptAsync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
