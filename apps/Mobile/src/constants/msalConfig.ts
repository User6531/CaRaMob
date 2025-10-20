import { DiscoveryDocument } from "expo-auth-session";

export const clientId = "9b06a155-e9bc-42d4-a47a-cf9f135e1048";
export const tenantId = "common";

export const discovery: DiscoveryDocument = {
  authorizationEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
  tokenEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
  revocationEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout`,
};

export const scopes = [
  "openid",
  "profile",
  "email",
  "offline_access",
];

const msalConfig = {
  auth: {
    clientId,
    redirectUri: `msal${clientId}://auth`,
    authority: `https://login.microsoftonline.com/${tenantId}`,
  },
} as const;

export default msalConfig;


