import React from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useStatusBar } from "../../hooks/useStatusBar";
import { ServiceHistoryDetailScreenProps } from "../../navigation/types";
import { useDeleteServiceHistory, useServiceHistory } from "../../queries";
import { globalStyles } from "../../styles/globalStyles";
import { ServiceHistoryVisitBody } from "../ServiceHistoryScreen/ServiceHistoryVisitBody";
import { styles } from "../ServiceHistoryScreen/ServiceHistoryScreen.styles";

export default function ServiceHistoryDetailScreen({
  navigation,
  route,
}: ServiceHistoryDetailScreenProps) {
  useStatusBar();
  const insets = useSafeAreaInsets();
  const { vehicleId, vehicleTitle, visit: initialVisit } = route.params;
  const deleteServiceHistory = useDeleteServiceHistory();
  const { data: visits = [] } = useServiceHistory(vehicleId);
  const visit =
    visits.find((item) => item.id === initialVisit.id) ?? initialVisit;

  const handleEdit = () => {
    navigation.navigate("ServiceHistoryEdit", {
      vehicleId,
      vehicleTitle,
      visit,
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Видалити запис?",
      `Запис «${visit.title}» буде видалено без можливості відновлення.`,
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteServiceHistory.mutateAsync({
                vehicleId,
                serviceHistoryId: visit.id,
              });
              navigation.goBack();
            } catch (error) {
              Alert.alert(
                "Помилка",
                error instanceof Error
                  ? error.message
                  : "Не вдалося видалити запис обслуговування"
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={[globalStyles.container, globalStyles.pageBackground]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.contentContainer,
          styles.detailContentContainer,
          {
            paddingTop: 16 + insets.top,
            paddingBottom: 24 + insets.bottom,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {vehicleTitle ? (
          <Text style={styles.pageSubtitle}>Авто: {vehicleTitle}</Text>
        ) : null}

        <View style={styles.visitCard}>
          <ServiceHistoryVisitBody visit={visit} limitRecords={false} />
        </View>

        <View style={styles.detailActions}>
          <TouchableOpacity
            style={[styles.detailActionButton, styles.detailEditButton]}
            onPress={handleEdit}
            activeOpacity={0.85}
          >
            <Feather name="edit-2" size={18} color="#FFFFFF" />
            <Text style={styles.detailActionText}>Редагувати</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.detailActionButton, styles.detailDeleteButton]}
            onPress={handleDelete}
            activeOpacity={0.85}
            disabled={deleteServiceHistory.isPending}
          >
            <Feather name="trash-2" size={18} color="#FFFFFF" />
            <Text style={styles.detailActionText}>
              {deleteServiceHistory.isPending ? "Видалення..." : "Видалити"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
