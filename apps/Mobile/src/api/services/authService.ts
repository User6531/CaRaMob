import { API_CONFIG, getNgrokHeaders } from "../../config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface GetMeDto {
  name: string;
  email?: string;
  updatedAt: string | null;
  phone?: string | null;
  pictureUrl?: string | null;
}

export interface RefreshTokenResponseDto {
  accessToken: string;
  refreshToken: string;
}

function normalizeMeData(data: Record<string, unknown>): GetMeDto {
  const me = (data.meData ?? data.MeData ?? data) as Record<string, unknown>;
  return {
    name: String(me.name ?? me.Name ?? ""),
    email: (me.email ?? me.Email) as string | undefined,
    updatedAt: (me.updatedAt ?? me.UpdatedAt ?? null) as string | null,
    phone: (me.phone ?? me.Phone ?? null) as string | null,
    pictureUrl: (me.pictureUrl ?? me.PictureUrl ?? null) as string | null,
  };
}

export async function fetchMe(accessToken: string): Promise<GetMeDto> {
  const response = await fetch(`${API_BASE_URL}/user/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...getNgrokHeaders(),
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return normalizeMeData(data);
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<RefreshTokenResponseDto> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getNgrokHeaders(),
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return {
    accessToken: data.accessToken || data.AccessToken,
    refreshToken: data.refreshToken || data.RefreshToken,
  };
}
