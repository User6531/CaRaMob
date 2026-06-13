import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { ServiceHistoryVisitDto } from "../../types/api";
import { ServiceHistoryVisitBody } from "./ServiceHistoryVisitBody";
import { styles } from "./ServiceHistoryScreen.styles";

interface ServiceHistorySwipeableVisitProps {
  visit: ServiceHistoryVisitDto;
  onPress: (visit: ServiceHistoryVisitDto) => void;
  onEditPress: (visit: ServiceHistoryVisitDto) => void;
  onDeletePress: (visit: ServiceHistoryVisitDto) => void;
  onSwipeOpen?: (visitId: string) => void;
  swipeableRef?: (ref: Swipeable | null) => void;
}

export function ServiceHistorySwipeableVisit({
  visit,
  onPress,
  onEditPress,
  onDeletePress,
  onSwipeOpen,
  swipeableRef,
}: ServiceHistorySwipeableVisitProps) {
  const handleEdit = () => {
    onEditPress(visit);
  };

  const handleDelete = () => {
    onDeletePress(visit);
  };

  const renderRightActions = () => (
    <View style={styles.swipeActions}>
      <TouchableOpacity
        style={styles.swipeEditAction}
        onPress={handleEdit}
        activeOpacity={0.85}
      >
        <Feather name="edit-2" size={20} color="#FFFFFF" />
        <Text style={styles.swipeActionText}>Редагувати</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.swipeDeleteAction}
        onPress={handleDelete}
        activeOpacity={0.85}
      >
        <Feather name="trash-2" size={20} color="#FFFFFF" />
        <Text style={styles.swipeActionText}>Видалити</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Swipeable
      ref={swipeableRef}
      containerStyle={styles.swipeableWrapper}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
      onSwipeableWillOpen={() => onSwipeOpen?.(visit.id)}
    >
      <TouchableOpacity
        style={styles.visitCard}
        onPress={() => onPress(visit)}
        activeOpacity={0.9}
      >
        <ServiceHistoryVisitBody visit={visit} />
      </TouchableOpacity>
    </Swipeable>
  );
}
