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

interface UserProfile {
  id: string;
  displayName: string;
  givenName: string;
  surname: string;
  mail: string;
  userPrincipalName: string;
  mobilePhone: string;
  birthday: string;
  photo: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  tokenResponse: TokenResponse | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
  getUserProfile: () => Promise<UserProfile | null>;
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
        setIsAuthenticated(true);
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
            setIsAuthenticated(true);
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
            await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
            setIsAuthenticated(false);
          }
        } else {
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
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      setTokenResponse(null);
      setIsAuthenticated(false);
    }
  };

  const getAccessToken = async (): Promise<string | null> => {
    if (!tokenResponse) return null;

    if (!tokenResponse.shouldRefresh()) {
      return tokenResponse.accessToken;
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
        return refreshedToken.accessToken;
      } catch (error) {
        console.error("Error refreshing token:", error);
        await logout();
        return null;
      }
    }

    return null;
  };

  const getUserProfile = async (): Promise<UserProfile | null> => {
    try {
      console.log("🔍 Starting getUserProfile...");
      const accessToken = await getAccessToken();
      console.log("🔑 Access token:", accessToken ? "Present" : "Missing");

      if (!accessToken) {
        console.log("❌ No access token available");
        return null;
      }

      console.log("📡 Fetching profile from Microsoft Graph...");
      // Get basic profile info
      const profileResponse = await fetch(
        "https://graph.microsoft.com/v1.0/me",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📊 Profile response status:", profileResponse.status);

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error("❌ Profile fetch failed:", errorText);
        throw new Error(
          `Failed to fetch user profile: ${profileResponse.status} - ${errorText}`
        );
      }

      const profile = await profileResponse.json();
      console.log("✅ Profile data received:", {
        id: profile.id,
        displayName: profile.displayName,
        mail: profile.mail,
      });

      // Try to get profile photo
      let photoUrl = null;
      try {
        const photoResponse = await fetch(
          "https://graph.microsoft.com/v1.0/me/photo/$value",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (photoResponse.ok) {
          const photoBlob = await photoResponse.blob();
          photoUrl = URL.createObjectURL(photoBlob);
        }
      } catch (photoError) {
        console.log("Photo not available or error fetching photo:", photoError);
      }

      return {
        id: profile.id,
        displayName: profile.displayName || "",
        givenName: profile.givenName || "",
        surname: profile.surname || "",
        mail: profile.mail || profile.userPrincipalName || "",
        userPrincipalName: profile.userPrincipalName || "",
        mobilePhone: profile.mobilePhone || "",
        birthday: profile.birthday || "",
        photo: photoUrl,
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
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
        getUserProfile,
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
