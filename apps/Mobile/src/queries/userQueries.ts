import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createApiClient } from '../api/client';
import { queryKeys } from './queryKeys';
import { User, CreateUserDto, UpdateUserDto } from '../types/api';
import { useAuth } from '../context/AuthContext';

// Query hooks
export const useMe = () => {
  const { getAccessToken } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.get<User>('/users/me');
    },
    enabled: true, // Включити тільки коли користувач авторизований
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
      return apiClient.get<User[]>('/users');
    },
  });
};

// Mutation hooks
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { getAccessToken } = useAuth();

  return useMutation({
    mutationFn: (userData: CreateUserDto) => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.post<User>('/users', userData);
    },
    onSuccess: () => {
      // Інвалідувати список користувачів після створення
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
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
