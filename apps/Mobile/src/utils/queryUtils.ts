import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "../queries/queryKeys";

// Утиліти для роботи з React Query

/**
 * Очистити всі дані користувача при логауті
 */
export const clearUserData = (queryClient: QueryClient) => {
  queryClient.removeQueries({ queryKey: queryKeys.users });
  queryClient.removeQueries({ queryKey: queryKeys.me });
};

/**
 * Очистити всі дані автомобілів
 */
export const clearCarData = (queryClient: QueryClient) => {
  queryClient.removeQueries({ queryKey: queryKeys.cars });
};

/**
 * Очистити всі дані
 */
export const clearAllData = (queryClient: QueryClient) => {
  queryClient.clear();
};

/**
 * Оновити дані користувача в кеші
 */
export const updateUserInCache = (
  queryClient: QueryClient,
  userId: string,
  updatedUser: any
) => {
  queryClient.setQueryData(queryKeys.user(userId), updatedUser);
  queryClient.setQueryData(queryKeys.me, updatedUser);
};

/**
 * Оновити дані автомобіля в кеші
 */
export const updateCarInCache = (
  queryClient: QueryClient,
  carId: string,
  updatedCar: any
) => {
  queryClient.setQueryData(queryKeys.car(carId), updatedCar);
};

/**
 * Інвалідувати всі запити користувача
 */
export const invalidateUserQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.users });
  queryClient.invalidateQueries({ queryKey: queryKeys.me });
};

/**
 * Інвалідувати всі запити автомобілів
 */
export const invalidateCarQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.cars });
};

/**
 * Отримати дані користувача з кешу
 */
export const getUserFromCache = (queryClient: QueryClient, userId: string) => {
  return queryClient.getQueryData(queryKeys.user(userId));
};

/**
 * Отримати дані поточного користувача з кешу
 */
export const getMeFromCache = (queryClient: QueryClient) => {
  return queryClient.getQueryData(queryKeys.me);
};

/**
 * Перевірити, чи є дані в кеші
 */
export const hasCachedData = (queryClient: QueryClient, queryKey: any[]) => {
  return queryClient.getQueryData(queryKey) !== undefined;
};
