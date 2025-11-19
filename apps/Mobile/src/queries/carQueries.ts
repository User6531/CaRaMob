import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createApiClient } from "../api/client";
import { queryKeys } from "./queryKeys";
import { Car, CreateCarDto, UpdateCarDto } from "../types/api";
import { useAuth } from "../context/AuthContext";

// Query hooks
export const useCars = () => {
  const { getAccessToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.cars,
    queryFn: () => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.get<Car[]>("/cars");
    },
  });
};

export const useCar = (id: string) => {
  const { getAccessToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.car(id),
    queryFn: () => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.get<Car>(`/cars/${id}`);
    },
    enabled: !!id,
  });
};

export const useUserCars = (userId: string) => {
  const { getAccessToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.userCars(userId),
    queryFn: () => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.get<Car[]>(`/users/${userId}/cars`);
    },
    enabled: !!userId,
  });
};

// Mutation hooks
export const useCreateCar = () => {
  const queryClient = useQueryClient();
  const { getAccessToken } = useAuth();

  return useMutation({
    mutationFn: (carData: CreateCarDto) => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.post<Car>("/cars", carData);
    },
    onSuccess: (newCar) => {
      // Інвалідувати список автомобілів
      queryClient.invalidateQueries({ queryKey: queryKeys.cars });
      // Інвалідувати автомобілі користувача
      queryClient.invalidateQueries({
        queryKey: queryKeys.userCars(newCar.userId),
      });
    },
  });
};

export const useUpdateCar = () => {
  const queryClient = useQueryClient();
  const { getAccessToken } = useAuth();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCarDto }) => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.put<Car>(`/cars/${id}`, data);
    },
    onSuccess: (updatedCar) => {
      // Оновити кеш для конкретного автомобіля
      queryClient.setQueryData(queryKeys.car(updatedCar.id), updatedCar);
      // Інвалідувати список автомобілів
      queryClient.invalidateQueries({ queryKey: queryKeys.cars });
      // Інвалідувати автомобілі користувача
      queryClient.invalidateQueries({
        queryKey: queryKeys.userCars(updatedCar.userId),
      });
    },
  });
};

export const useDeleteCar = () => {
  const queryClient = useQueryClient();
  const { getAccessToken } = useAuth();

  return useMutation({
    mutationFn: (id: string) => {
      const apiClient = createApiClient(getAccessToken);
      return apiClient.delete(`/cars/${id}`);
    },
    onSuccess: (_, deletedId) => {
      // Видалити з кешу
      queryClient.removeQueries({ queryKey: queryKeys.car(deletedId) });
      // Інвалідувати список автомобілів
      queryClient.invalidateQueries({ queryKey: queryKeys.cars });
    },
  });
};
