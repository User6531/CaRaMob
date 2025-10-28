import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

export class ApiClient {
  private baseURL: string;
  private getAccessToken: () => Promise<string | null>;

  constructor(baseURL: string = API_BASE_URL, getAccessToken: () => Promise<string | null>) {
    this.baseURL = baseURL;
    this.getAccessToken = getAccessToken;
  }

  private async getHeaders(): Promise<HeadersInit> {
    const token = await this.getAccessToken();
    
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      // Спробуємо отримати текст помилки
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch (e) {
        // Ігноруємо помилки парсингу тексту
      }
      throw new Error(errorMessage);
    }

    // Перевіряємо чи відповідь є JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      throw new Error(`Expected JSON response but got: ${contentType}. Response: ${responseText.substring(0, 200)}...`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Спробуємо отримати текст помилки
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch (e) {
        // Ігноруємо помилки парсингу тексту
      }
      throw new Error(errorMessage);
    }

    // Перевіряємо чи є контент для парсингу
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    // Якщо немає контенту або content-length = 0, повертаємо порожній об'єкт
    if (!contentLength || contentLength === '0') {
      return {} as T;
    }

    // Перевіряємо чи відповідь є JSON
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      throw new Error(`Expected JSON response but got: ${contentType}. Response: ${responseText.substring(0, 200)}...`);
    }

    return response.json();
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: await this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Спробуємо отримати текст помилки
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch (e) {
        // Ігноруємо помилки парсингу тексту
      }
      throw new Error(errorMessage);
    }

    // Перевіряємо чи є контент для парсингу
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    // Якщо немає контенту або content-length = 0, повертаємо порожній об'єкт
    if (!contentLength || contentLength === '0') {
      return {} as T;
    }

    // Перевіряємо чи відповідь є JSON
    if (!contentType || !contentType.includes('application/json')) {
      const responseText = await response.text();
      throw new Error(`Expected JSON response but got: ${contentType}. Response: ${responseText.substring(0, 200)}...`);
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: await this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// Функція для створення API клієнта з токеном
export const createApiClient = (getAccessToken: () => Promise<string | null>) => {
  return new ApiClient(API_BASE_URL, getAccessToken);
};
