export type ServiceTag =
  | "suspension"
  | "engine"
  | "tires"
  | "diagnostics"
  | "electrical"
  | "bodywork"
  | "maintenance"
  | "wash";

export interface ServiceShopSocialLinks {
  instagram?: string;
  facebook?: string;
  telegram?: string;
  website?: string;
}

export interface WorkingHours {
  weekdays: string;
  saturday?: string;
  sunday?: string;
}

export interface AutoServiceShop {
  id: string;
  name: string;
  logoUrl: string;
  coverImageUrl?: string;
  address: string;
  city: string;
  phone: string;
  isOpen: boolean;
  workingHours: WorkingHours;
  tags: ServiceTag[];
  socialLinks: ServiceShopSocialLinks;
  distanceKm?: number;
  visitCount?: number;
  isSubscribed?: boolean;
  description?: string;
  rating?: number;
}
