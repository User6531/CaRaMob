import { clientId, discovery, scopes } from "../constants/msalConfig";
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
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { queryClient } from "../lib/queryClient";
import { checkAuthSession, GetMeDto } from "../api/services/authService";


interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  tokenResponse: TokenResponse | null;
  meData: GetMeDto | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  promptAsync:
    | ((options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>)
    | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = "auth_token_response";
const INTERNAL_TOKEN_KEY = "internal_token";
const ME_DATA_KEY = "me_data";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenResponse, setTokenResponse] = useState<TokenResponse | null>(
    null
  );
  const [meData, setMeData] = useState<GetMeDto | null>(null);
  const isExpoGo = Constants.appOwnership === "expo";
  // Ensure auth session completes on iOS when returning to the app
  if (WebBrowser.maybeCompleteAuthSession) {
    WebBrowser.maybeCompleteAuthSession();
  }

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes,
      responseType: ResponseType.Code,
      usePKCE: true,
      redirectUri: makeRedirectUri(
        isExpoGo ? { scheme: "exp" } : { native: `msal${clientId}://auth` }
      ),
      extraParams: {
        prompt: "select_account",
      },
    },
    discovery
  );

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
            redirectUri: makeRedirectUri(
              isExpoGo
                ? { scheme: "exp" }
                : { native: `msal${clientId}://auth` }
            ),
            extraParams: {
              code_verifier: request?.codeVerifier || "",
            },
          },
          discovery
        );

        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, JSON.stringify(token));
        setTokenResponse(token);

        // Викликаємо бекенд для отримання внутрішнього токену та даних користувача
        if (token.accessToken) {
          try {
            const authResponse = await checkAuthSession(token.accessToken);
            await SecureStore.setItemAsync(INTERNAL_TOKEN_KEY, authResponse.internalToken);
            await SecureStore.setItemAsync(ME_DATA_KEY, JSON.stringify(authResponse.meData));
            setMeData(authResponse.meData);
            setIsAuthenticated(true);
          } catch (error) {
            console.error("Error checking auth session:", error);
            // Якщо не вдалося отримати внутрішній токен, все одно вважаємо користувача авторизованим
            // (Azure AD токен є)
            setIsAuthenticated(true);
          }
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error exchanging code for token:", error);
        throw error;
      }
    },
    [request]
  );

  useEffect(() => {
    if (response?.type === "success" && request) {
      exchangeCodeForToken(response.params.code);
    }
  }, [response, request, exchangeCodeForToken]);

  const checkAuthStatus = async () => {
    try {
      const storedTokenJson = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      const storedInternalToken = await SecureStore.getItemAsync(INTERNAL_TOKEN_KEY);
      const storedMeDataJson = await SecureStore.getItemAsync(ME_DATA_KEY);

      if (storedTokenJson) {
        const storedToken = JSON.parse(storedTokenJson);
        const token = new TokenResponse(storedToken);

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

            // Оновлюємо внутрішній токен після оновлення Azure AD токену
            if (refreshedToken.accessToken) {
              try {
                const authResponse = await checkAuthSession(refreshedToken.accessToken);
                await SecureStore.setItemAsync(INTERNAL_TOKEN_KEY, authResponse.internalToken);
                await SecureStore.setItemAsync(ME_DATA_KEY, JSON.stringify(authResponse.meData));
                setMeData(authResponse.meData);
              } catch (error) {
                console.error("Error refreshing auth session:", error);
              }
            }

            setIsAuthenticated(true);
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
            await SecureStore.deleteItemAsync(INTERNAL_TOKEN_KEY);
            await SecureStore.deleteItemAsync(ME_DATA_KEY);
            setTokenResponse(null);
            setMeData(null);
            setIsAuthenticated(false);
          }
        } else {
          setTokenResponse(token);
          
          // Відновлюємо збережені дані
          if (storedInternalToken) {
            // Внутрішній токен вже збережений
          }
          if (storedMeDataJson) {
            try {
              const meData = JSON.parse(storedMeDataJson);
              setMeData(meData);
            } catch (error) {
              console.error("Error parsing stored me data:", error);
            }
          }

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
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  console.log("ACCESS TOKEN", tokenResponse?.accessToken);

  const logout = async () => {
    try {
      if (tokenResponse?.accessToken) {
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
    } finally {
      // Очистити кеш React Query при логауті
      queryClient.clear();
      
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(INTERNAL_TOKEN_KEY);
      await SecureStore.deleteItemAsync(ME_DATA_KEY);
      setTokenResponse(null);
      setMeData(null);
      setIsAuthenticated(false);
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    // Повертаємо внутрішній токен для API запитів
    const internalToken = await SecureStore.getItemAsync(INTERNAL_TOKEN_KEY);
    if (internalToken) {
      return internalToken;
    }

    // Якщо внутрішнього токену немає, але є Azure AD токен, спробуємо отримати внутрішній
    if (!tokenResponse) return null;

    if (!tokenResponse.shouldRefresh() && tokenResponse.accessToken) {
      try {
        const authResponse = await checkAuthSession(tokenResponse.accessToken);
        await SecureStore.setItemAsync(INTERNAL_TOKEN_KEY, authResponse.internalToken);
        await SecureStore.setItemAsync(ME_DATA_KEY, JSON.stringify(authResponse.meData));
        setMeData(authResponse.meData);
        return authResponse.internalToken;
      } catch (error) {
        console.error("Error getting internal token:", error);
        return null;
      }
    }

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

        // Отримуємо внутрішній токен після оновлення Azure AD токену
        if (refreshedToken.accessToken) {
          try {
            const authResponse = await checkAuthSession(refreshedToken.accessToken);
            await SecureStore.setItemAsync(INTERNAL_TOKEN_KEY, authResponse.internalToken);
            await SecureStore.setItemAsync(ME_DATA_KEY, JSON.stringify(authResponse.meData));
            setMeData(authResponse.meData);
            return authResponse.internalToken;
          } catch (error) {
            console.error("Error getting internal token after refresh:", error);
            return null;
          }
        }
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
        meData,
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
