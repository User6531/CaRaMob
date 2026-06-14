import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createApiClient } from "../api/client";
import { queryKeys } from "./queryKeys";
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UpdateUserRequest,
  MeResponse,
} from "../types/api";
import { useAuth } from "../context/AuthContext";

const normalizeMeResponse = (raw: unknown): MeResponse => {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid me response");
  }

  const me = raw as Record<string, unknown>;

  return {
    name: String(me.name ?? me.Name ?? ""),
    email: (me.email ?? me.Email ?? null) as string | null | undefined,
    updatedAt: (me.updatedAt ?? me.UpdatedAt ?? null) as string | null,
    phone: (me.phone ?? me.Phone ?? null) as string | null,
    pictureUrl: (me.pictureUrl ?? me.PictureUrl ?? null) as string | null,
  };
};

// Query hooks
export const useMe = () => {
  const { getAccessToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => {
      try {
        const apiClient = createApiClient(getAccessToken);
        const response = await apiClient.get<unknown>("/user/me");
        return normalizeMeResponse(response);
      } catch (error) {
        console.error("Error in useMe query:", error);
        throw error;
      }
    },
    enabled: true, // Включити тільки коли користувач авторизований
    retry: (failureCount, error) => {
      // Не повторюємо запит якщо помилка 401 (неавторизований) або 404 (користувач не знайдений)
      if (
        error instanceof Error &&
        (error.message.includes("401") || error.message.includes("404"))
      ) {
        return false;
      }
      // Повторюємо максимум 2 рази для інших помилок
      return failureCount < 2;
    },
    retryDelay: 1000, // 1 секунда між спробами
  });
};

export const useUser = (id: string) => {
  const { getAccessToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.get<User>(`/users/${id}`);
    },
    enabled: !!id,
  });
};

export const useUsers = () => {
  const { getAccessToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.get<User[]>("/users");
    },
  });
};

// Mutation hooks
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { getAccessToken } = useAuth();

  return useMutation({
    mutationFn: async (userData: CreateUserDto) => {
      try {
        console.log("Creating user with data:", userData);
        const apiClient = createApiClient(getAccessToken);
        const result = await apiClient.post<User>("/users", userData);
        console.log("User created successfully:", result);
        return result;
      } catch (error) {
        console.error("Error in useCreateUser mutation:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("User creation successful, invalidating queries");
      // Інвалідувати список користувачів після створення
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      // Також інвалідуємо запит me
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
    onError: (error) => {
      console.error("User creation failed:", error);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { getAccessToken } = useAuth();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.put<User>(`/users/${id}`, data);
    },
    onSuccess: (updatedUser) => {
      // Оновити кеш для конкретного користувача
      queryClient.setQueryData(queryKeys.user(updatedUser.id), updatedUser);
      // Інвалідувати список користувачів
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
};

// Новий hook для оновлення користувача через /api/user/update
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { getAccessToken } = useAuth();

  return useMutation({
    mutationFn: async (userData: UpdateUserRequest) => {
      try {
        console.log("Updating user profile with data:", userData);
        const apiClient = createApiClient(getAccessToken);
        // Бекенд отримує userId з токену, тому просто передаємо name та email
        const result = await apiClient.put<User>("/user/update", userData);
        console.log("User profile updated successfully:", result);
        return result;
      } catch (error) {
        console.error("Error in useUpdateUserProfile mutation:", error);
        throw error;
      }
    },
    onSuccess: (updatedUser) => {
      console.log("User profile update successful, invalidating queries");

      // Якщо updatedUser порожній (API повернув 204 No Content), просто інвалідуємо кеш
      if (updatedUser && Object.keys(updatedUser).length > 0) {
        // Оновити кеш для конкретного користувача
        queryClient.setQueryData(queryKeys.user(updatedUser.id), updatedUser);
      }

      // Інвалідувати список користувачів та me запит
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
    onError: (error) => {
      console.error("User profile update failed:", error);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { getAccessToken } = useAuth();

  return useMutation({
    mutationFn: (id: string) => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.delete(`/users/${id}`);
    },
    onSuccess: (_, deletedId) => {
      // Видалити з кешу
      queryClient.removeQueries({ queryKey: queryKeys.user(deletedId) });
      // Інвалідувати список користувачів
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
    },
  });
};
