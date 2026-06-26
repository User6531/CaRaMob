import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ServiceHistoryVisitDto } from "../types/api";

// Визначаємо список всіх скрінів у додатку
export type RootStackParamList = {
  Login: undefined;
  UserCheck: undefined;
  Home: undefined;
  Profile: undefined;
  ProfileEdit: undefined;
  ProfileSetup: undefined;
  CarCard: undefined;
  CarEdit: { carId: string };
  CarDetails: { carId: string };
  ServiceHistory: { vehicleId: string; vehicleTitle?: string };
  ServiceHistoryCreate: { vehicleId: string; vehicleTitle?: string };
  ServiceHistoryEdit: {
    vehicleId: string;
    vehicleTitle?: string;
    visit: ServiceHistoryVisitDto;
  };
  ServiceShopDetail: { serviceId: string };
};

// Типи для кожного скріна
export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Login"
>;

export type UserCheckScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "UserCheck"
>;

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;

export type ProfileScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Profile"
>;

export type ProfileEditScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ProfileEdit"
>;

export type ProfileSetupScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ProfileSetup"
>;

export type CarCardScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "CarCard"
>;

export type CarEditScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "CarEdit"
>;

export type CarDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "CarDetails"
>;

export type ServiceHistoryScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ServiceHistory"
>;

export type ServiceHistoryCreateScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ServiceHistoryCreate"
>;

export type ServiceHistoryEditScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ServiceHistoryEdit"
>;

export type ServiceShopDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ServiceShopDetail"
>;
