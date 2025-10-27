import { DiscoveryDocument } from "expo-auth-session";

export const clientId = "10cce22d-e9f4-49dd-a39e-93bb13b447de";
export const apiClientId = "0200db18-ed94-4544-925a-d307b6de8603";
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
  `api://${apiClientId}/access_as_user`,
];

const msalConfig = {
  auth: {
    clientId,
    redirectUri: `msal${clientId}://auth`,
    authority: `https://login.microsoftonline.com/${tenantId}`,
  },
} as const;

export default msalConfig;
