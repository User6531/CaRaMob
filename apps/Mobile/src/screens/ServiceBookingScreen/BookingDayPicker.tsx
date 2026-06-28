import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "./ServiceBookingScreen.styles";
import { BOOKING_DAYS_AHEAD } from "./serviceBookingConfig";

interface BookingDay {
  key: string;
  date: Date;
  weekday: string;
  dayNumber: string;
  month: string;
}

function buildBookingDays(): BookingDay[] {
  const days: BookingDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let offset = 0; offset < BOOKING_DAYS_AHEAD; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    days.push({
      key: date.toISOString().slice(0, 10),
      date,
      weekday: date.toLocaleDateString("uk-UA", { weekday: "short" }),
      dayNumber: date.toLocaleDateString("uk-UA", { day: "2-digit" }),
      month: date.toLocaleDateString("uk-UA", { month: "short" }),
    });
  }

  return days;
}

export interface BookingDayPickerProps {
  selectedDateKey: string | null;
  onSelect: (dateKey: string) => void;
}

export function BookingDayPicker({
  selectedDateKey,
  onSelect,
}: BookingDayPickerProps) {
  const days = React.useMemo(() => buildBookingDays(), []);

  React.useEffect(() => {
    if (!selectedDateKey && days[0]) {
      onSelect(days[0].key);
    }
  }, [days, onSelect, selectedDateKey]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.dayPickerContent}
    >
      {days.map((day) => {
        const isSelected = day.key === selectedDateKey;
        return (
          <TouchableOpacity
            key={day.key}
            style={[styles.dayChip, isSelected && styles.dayChipSelected]}
            onPress={() => onSelect(day.key)}
            activeOpacity={0.85}
          >
            <Text
              style={[styles.dayWeekday, isSelected && styles.dayTextSelected]}
            >
              {day.weekday}
            </Text>
            <Text
              style={[styles.dayNumber, isSelected && styles.dayTextSelected]}
            >
              {day.dayNumber}
            </Text>
            <Text
              style={[styles.dayMonth, isSelected && styles.dayTextSelected]}
            >
              {day.month}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
