export type VisitReasonId =
  | "maintenance"
  | "suspension"
  | "diagnostics"
  | "other";

export type TimeSlotId = "morning" | "day" | "evening";

export type PartsOption = "shop" | "own";

export type BookingMediaType = "image" | "video";

export interface BookingMediaAttachment {
  id: string;
  type: BookingMediaType;
  uri: string;
}
