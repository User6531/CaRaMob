import React from "react";
import { Alert, ActivityIndicator, Text, View } from "react-native";
import { FormScreen } from "../../components/FormScreen";
import { useServiceHistoryCreateDraft } from "../../hooks/useServiceHistoryCreateDraft";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useCreateServiceHistory } from "../../queries";
import { ServiceHistoryCreateScreenProps } from "../../navigation/types";
import { globalStyles } from "../../styles/globalStyles";
import { useTheme } from "../../hooks/useTheme";
import { ServiceHistoryForm } from "./ServiceHistoryForm";
import { styles } from "./ServiceHistoryCreateScreen.styles";

export default function ServiceHistoryCreateScreen({
  navigation,
  route,
}: ServiceHistoryCreateScreenProps) {
  useStatusBar();
  const theme = useTheme();
  const { vehicleId, vehicleTitle } = route.params;
  const createServiceHistory = useCreateServiceHistory();
  const {
    title,
    setTitle,
    description,
    setDescription,
    works,
    isDraftLoaded,
    hasRestoredDraft,
    clearDraft,
    addWork,
    removeWork,
    updateWorkTitle,
    updateWorkPrice,
  } = useServiceHistoryCreateDraft({ vehicleId });

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Помилка", "Вкажіть назву візиту або сервісу.");
      return;
    }

    const parsedRecords = works.map((work, index) => {
      const parsedPrice = Number(work.price.replace(",", ".").trim());
      return {
        index,
        title: work.title.trim(),
        price: parsedPrice,
      };
    });

    if (!parsedRecords.length) {
      Alert.alert("Помилка", "Додайте хоча б одну виконану роботу.");
      return;
    }

    const invalidRecord = parsedRecords.find(
      (record) =>
        !record.title ||
        Number.isNaN(record.price) ||
        !Number.isFinite(record.price) ||
        record.price <= 0
    );

    if (invalidRecord) {
      Alert.alert(
        "Помилка",
        `Перевірте пункт #${invalidRecord.index + 1}: вкажіть назву роботи та ціну більше 0.`
      );
      return;
    }

    const visitDescription = description.trim();

    try {
      await createServiceHistory.mutateAsync({
        vehicleId,
        data: {
          title: title.trim(),
          records: parsedRecords.map((record, index) => ({
            title: record.title,
            price: record.price,
            description:
              index === 0 && visitDescription ? visitDescription : "",
          })),
        },
      });

      await clearDraft();

      Alert.alert("Успіх", "Запис обслуговування збережено у базі.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert(
        "Помилка",
        error instanceof Error
          ? error.message
          : "Не вдалося зберегти запис обслуговування"
      );
    }
  };

  if (!isDraftLoaded) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.pageBackground,
          styles.loadingContainer,
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.accent.primary} />
        <Text style={globalStyles.loadingText}>Завантаження форми...</Text>
      </View>
    );
  }

  return (
    <FormScreen
      style={[globalStyles.container, globalStyles.pageBackground]}
      contentContainerStyle={styles.contentContainer}
    >
      <ServiceHistoryForm
        pageTitle="Новий запис"
        pageSubtitle="Додайте візит до автосервісу з переліком виконаних робіт"
        vehicleTitle={vehicleTitle}
        draftHint={hasRestoredDraft}
        title={title}
        onTitleChange={setTitle}
        description={description}
        onDescriptionChange={setDescription}
        works={works}
        onAddWork={addWork}
        onRemoveWork={removeWork}
        onWorkTitleChange={updateWorkTitle}
        onWorkPriceChange={updateWorkPrice}
        onCancel={() => navigation.goBack()}
        onSave={handleSave}
        isSaving={createServiceHistory.isPending}
        saveLabel="Зберегти запис"
        savingLabel="Збереження..."
      />
    </FormScreen>
  );
}
