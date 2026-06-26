import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useTheme } from "../../hooks/useTheme";
import { ServiceHistoryVisitDto } from "../../types/api";
import { ServiceHistoryVisitBody } from "./ServiceHistoryVisitBody";
import { styles } from "./ServiceHistoryScreen.styles";

interface ServiceHistorySwipeableVisitProps {
  visit: ServiceHistoryVisitDto;
  vehicleId: string;
  index: number;
  onEditPress: (visit: ServiceHistoryVisitDto) => void;
  onDeletePress: (visit: ServiceHistoryVisitDto) => void;
  onSwipeOpen?: (visitId: string) => void;
  swipeableRef?: (ref: Swipeable | null) => void;
}

export function ServiceHistorySwipeableVisit({
  visit,
  vehicleId,
  index,
  onEditPress,
  onDeletePress,
  onSwipeOpen,
  swipeableRef,
}: ServiceHistorySwipeableVisitProps) {
  const theme = useTheme();

  const renderRightActions = () => (
    <View style={styles.swipeActions}>
      <TouchableOpacity
        style={styles.swipeEditAction}
        onPress={() => onEditPress(visit)}
        activeOpacity={0.85}
      >
        <Feather name="edit-2" size={18} color={theme.colors.accent.primary} />
        <Text style={[styles.swipeActionText, styles.swipeEditActionText]}>
          Редагувати
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.swipeDeleteAction}
        onPress={() => onDeletePress(visit)}
        activeOpacity={0.85}
      >
        <Feather name="trash-2" size={18} color="#F85149" />
        <Text style={[styles.swipeActionText, styles.swipeDeleteActionText]}>
          Видалити
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Animated.View entering={FadeIn.duration(280).delay(80 + index * 50)}>
      <Swipeable
        ref={swipeableRef}
        containerStyle={styles.swipeableWrapper}
        renderRightActions={renderRightActions}
        overshootRight={false}
        friction={2}
        onSwipeableWillOpen={() => onSwipeOpen?.(visit.id)}
      >
        <View style={styles.visitCard}>
          <ServiceHistoryVisitBody visit={visit} vehicleId={vehicleId} />
        </View>
      </Swipeable>
    </Animated.View>
  );
}
