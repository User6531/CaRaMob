import { API_CONFIG, getNgrokHeaders } from "../config/api";
import { tryRefreshAccessToken } from "./authTokenBridge";

const API_BASE_URL = API_CONFIG.BASE_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export class ApiClient {
  private baseURL: string;
  private getAccessToken: () => Promise<string | null>;

  constructor(
    baseURL: string = API_BASE_URL,
    getAccessToken: () => Promise<string | null>
  ) {
    this.baseURL = baseURL;
    this.getAccessToken = getAccessToken;
  }

  private async getHeaders(token?: string | null): Promise<HeadersInit> {
    const accessToken = token ?? (await this.getAccessToken());

    return {
      "Content-Type": "application/json",
      ...getNgrokHeaders(),
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    };
  }

  private async readErrorMessage(response: Response): Promise<string> {
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
      const errorText = await response.text();
      if (errorText) {
        errorMessage = errorText;
      }
    } catch {
      // Ignore body read errors.
    }
    return errorMessage;
  }

  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    body?: unknown,
    hasRetried = false
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: await this.getHeaders(),
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    if (response.status === 401 && !hasRetried) {
      const refreshedToken = await tryRefreshAccessToken();
      if (refreshedToken) {
        return this.request<T>(method, endpoint, body, true);
      }
    }

    if (!response.ok) {
      throw new Error(await this.readErrorMessage(response));
    }

    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get("content-type");
    const responseText = await response.text();

    if (!responseText) {
      return {} as T;
    }

    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(
        `Expected JSON response but got: ${contentType}. Response: ${responseText.substring(0, 200)}...`
      );
    }

    return JSON.parse(responseText) as T;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>("GET", endpoint);
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>("POST", endpoint, data);
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>("PUT", endpoint, data);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>("DELETE", endpoint);
  }
}

export const createApiClient = (
  getAccessToken: () => Promise<string | null>
) => {
  return new ApiClient(API_BASE_URL, getAccessToken);
};
