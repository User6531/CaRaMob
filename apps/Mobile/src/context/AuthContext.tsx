import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { API_CONFIG } from "../config/api";
import { AUTH_REDIRECT_URI } from "../constants/authConfig";
import {
  fetchMe,
  GetMeDto,
  refreshAccessToken,
} from "../api/services/authService";
import { queryClient } from "../lib/queryClient";
import { registerRefreshAccessToken } from "../api/authTokenBridge";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  meData: GetMeDto | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INTERNAL_TOKEN_KEY = "internal_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ME_DATA_KEY = "me_data";

if (WebBrowser.maybeCompleteAuthSession) {
  WebBrowser.maybeCompleteAuthSession();
}

function parseAuthRedirect(url: string): {
  internalToken: string | null;
  refreshToken: string | null;
  error: string | null;
} {
  const params = new URL(url).searchParams;
  return {
    internalToken: params.get("internalToken"),
    refreshToken: params.get("refreshToken"),
    error: params.get("error"),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [meData, setMeData] = useState<GetMeDto | null>(null);

  const persistSession = useCallback(
    async (
      internalToken: string,
      refreshToken: string,
      me: GetMeDto
    ): Promise<void> => {
      await SecureStore.setItemAsync(INTERNAL_TOKEN_KEY, internalToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      await SecureStore.setItemAsync(ME_DATA_KEY, JSON.stringify(me));
      setMeData(me);
      setIsAuthenticated(true);
    },
    []
  );

  const clearSession = useCallback(async (): Promise<void> => {
    queryClient.clear();
    await SecureStore.deleteItemAsync(INTERNAL_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(ME_DATA_KEY);
    setMeData(null);
    setIsAuthenticated(false);
  }, []);

  const refreshSession = useCallback(async (): Promise<string | null> => {
    const storedRefreshToken =
      await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!storedRefreshToken) {
      return null;
    }

    try {
      const tokens = await refreshAccessToken(storedRefreshToken);
      await SecureStore.setItemAsync(INTERNAL_TOKEN_KEY, tokens.accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);

      try {
        const me = await fetchMe(tokens.accessToken);
        await SecureStore.setItemAsync(ME_DATA_KEY, JSON.stringify(me));
        setMeData(me);
      } catch {
        // Keep existing me data if refresh of profile fails.
      }

      setIsAuthenticated(true);
      return tokens.accessToken;
    } catch {
      await clearSession();
      return null;
    }
  }, [clearSession]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const storedInternalToken =
        await SecureStore.getItemAsync(INTERNAL_TOKEN_KEY);
      const storedMeDataJson = await SecureStore.getItemAsync(ME_DATA_KEY);

      if (!storedInternalToken) {
        setIsAuthenticated(false);
        return;
      }

      if (storedMeDataJson) {
        try {
          setMeData(JSON.parse(storedMeDataJson));
        } catch {
          setMeData(null);
        }
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  useEffect(() => {
    registerRefreshAccessToken(refreshSession);
  }, [refreshSession]);

  const login = async () => {
    const result = await WebBrowser.openAuthSessionAsync(
      `${API_CONFIG.BASE_URL}/auth/login`,
      AUTH_REDIRECT_URI
    );

    if (result.type === "cancel" || result.type === "dismiss") {
      return;
    }

    if (result.type !== "success") {
      throw new Error("Telegram login failed");
    }

    const { internalToken, refreshToken, error } = parseAuthRedirect(
      result.url
    );

    if (error) {
      throw new Error(error);
    }

    if (!internalToken || !refreshToken) {
      throw new Error("Missing authentication tokens");
    }

    const me = await fetchMe(internalToken);
    await persistSession(internalToken, refreshToken, me);
  };

  const logout = async () => {
    await clearSession();
  };

  const getAccessToken = async (): Promise<string | null> => {
    const internalToken = await SecureStore.getItemAsync(INTERNAL_TOKEN_KEY);
    if (internalToken) {
      return internalToken;
    }

    return refreshSession();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        meData,
        login,
        logout,
        getAccessToken,
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
