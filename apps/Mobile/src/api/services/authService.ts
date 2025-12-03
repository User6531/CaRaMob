import { API_CONFIG } from "../../config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface CheckAuthResponseDto {
  internalToken: string;
  meData: GetMeDto;
}

export interface GetMeDto {
  name: string;
  email?: string;
  updatedAt: string | null;
}

/**
 * Викликає /api/auth/session з Azure AD токеном
 * @param azureToken - Azure AD access token
 * @returns CheckAuthResponseDto з внутрішнім токеном та даними користувача
 */
export async function checkAuthSession(
  azureToken: string
): Promise<CheckAuthResponseDto> {
  const response = await fetch(`${API_BASE_URL}/auth/session`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${azureToken}`,
    },
  });

  if (!response.ok) {
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

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const responseText = await response.text();
    throw new Error(
      `Expected JSON response but got: ${contentType}. Response: ${responseText.substring(0, 200)}...`
    );
  }

  const data = await response.json();

  // Нормалізуємо відповідь (бекенд може повертати з великої літери)
  return {
    internalToken: data.internalToken || data.InternalToken,
    meData: {
      name: data.meData?.name || data.MeData?.name || "",
      email: data.meData?.email || data.MeData?.email,
      updatedAt: data.meData?.updatedAt || data.MeData?.updatedAt || null,
    },
  };
}






