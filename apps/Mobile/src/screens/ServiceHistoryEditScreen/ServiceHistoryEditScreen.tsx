import React from "react";
import { Alert } from "react-native";
import { FormScreen } from "../../components/FormScreen";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useUpdateServiceHistory } from "../../queries";
import { ServiceHistoryEditScreenProps } from "../../navigation/types";
import { globalStyles } from "../../styles/globalStyles";
import {
  ServiceHistoryForm,
  ServiceHistoryWorkInput,
} from "../ServiceHistoryCreateScreen/ServiceHistoryForm";
import { styles } from "../ServiceHistoryCreateScreen/ServiceHistoryCreateScreen.styles";

const createEmptyWork = (): ServiceHistoryWorkInput => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  title: "",
  price: "",
});

const mapVisitToWorks = (
  records: { title: string; price?: number | null }[] | undefined
): ServiceHistoryWorkInput[] => {
  if (!records?.length) {
    return [createEmptyWork()];
  }

  return records.map((record) => ({
    id: `${record.title}-${Math.random().toString(16).slice(2)}`,
    title: record.title,
    price: typeof record.price === "number" ? String(record.price) : "",
  }));
};

export default function ServiceHistoryEditScreen({
  navigation,
  route,
}: ServiceHistoryEditScreenProps) {
  useStatusBar();
  const { vehicleId, vehicleTitle, visit } = route.params;
  const updateServiceHistory = useUpdateServiceHistory();

  const [title, setTitle] = React.useState(visit.title);
  const [description, setDescription] = React.useState(
    visit.description ?? visit.records?.[0]?.description ?? ""
  );
  const [works, setWorks] = React.useState<ServiceHistoryWorkInput[]>(
    mapVisitToWorks(visit.records)
  );

  const handleAddWork = () => {
    setWorks((prev) => [...prev, createEmptyWork()]);
  };

  const handleRemoveWork = (id: string) => {
    setWorks((prev) =>
      prev.length > 1 ? prev.filter((item) => item.id !== id) : prev
    );
  };

  const handleWorkTitleChange = (id: string, value: string) => {
    setWorks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: value } : item))
    );
  };

  const handleWorkPriceChange = (id: string, value: string) => {
    setWorks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: value } : item))
    );
  };

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
      await updateServiceHistory.mutateAsync({
        vehicleId,
        serviceHistoryId: visit.id,
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

      Alert.alert("Успіх", "Запис обслуговування оновлено.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert(
        "Помилка",
        error instanceof Error
          ? error.message
          : "Не вдалося оновити запис обслуговування"
      );
    }
  };

  return (
    <FormScreen
      style={[globalStyles.container, globalStyles.pageBackground]}
      contentContainerStyle={styles.contentContainer}
    >
      <ServiceHistoryForm
        pageTitle="Редагування запису"
        pageSubtitle="Оновіть дані візиту та перелік виконаних робіт"
        vehicleTitle={vehicleTitle}
        title={title}
        onTitleChange={setTitle}
        description={description}
        onDescriptionChange={setDescription}
        works={works}
        onAddWork={handleAddWork}
        onRemoveWork={handleRemoveWork}
        onWorkTitleChange={handleWorkTitleChange}
        onWorkPriceChange={handleWorkPriceChange}
        onCancel={() => navigation.goBack()}
        onSave={handleSave}
        isSaving={updateServiceHistory.isPending}
        saveLabel="Зберегти зміни"
        savingLabel="Збереження..."
      />
    </FormScreen>
  );
}
