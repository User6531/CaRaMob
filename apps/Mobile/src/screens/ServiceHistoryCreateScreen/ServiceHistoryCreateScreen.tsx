import React from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { FormScreen } from "../../components/FormScreen";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useCreateServiceHistory } from "../../queries";
import { ServiceHistoryCreateScreenProps } from "../../navigation/types";
import { globalStyles } from "../../styles/globalStyles";
import { styles } from "./ServiceHistoryCreateScreen.styles";

type WorkInput = {
  id: string;
  title: string;
  price: string;
};

const createEmptyWork = (): WorkInput => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  title: "",
  price: "",
});

export default function ServiceHistoryCreateScreen({
  navigation,
  route,
}: ServiceHistoryCreateScreenProps) {
  useStatusBar();
  const { vehicleId, vehicleTitle } = route.params;
  const createServiceHistory = useCreateServiceHistory();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [works, setWorks] = React.useState<WorkInput[]>([createEmptyWork()]);

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

  return (
    <FormScreen
      style={[globalStyles.container, globalStyles.pageBackground]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Новий запис обслуговування</Text>
      <Text style={styles.subtitle}>
        {vehicleTitle ? `Авто: ${vehicleTitle}` : "Створення запису для вибраного авто"}
      </Text>

      <View style={styles.formCard}>
        <View>
          <Text style={styles.label}>Назва візиту / СТО</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Наприклад: Bosch Service, ТО 120000"
            placeholderTextColor="#8E8E93"
            style={styles.input}
          />
        </View>

        <View>
          <Text style={styles.label}>Опис</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Короткий опис візиту"
            placeholderTextColor="#8E8E93"
            style={[styles.input, styles.textarea]}
            multiline
          />
        </View>

        <View>
          <Text style={styles.label}>Список робіт</Text>
          {works.map((work, index) => (
            <View key={work.id} style={styles.workItem}>
              <View style={styles.workItemHeader}>
                <Text style={styles.workItemTitle}>Робота #{index + 1}</Text>
                <TouchableOpacity
                  onPress={() => handleRemoveWork(work.id)}
                  disabled={works.length === 1}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.removeWorkText,
                      works.length === 1 && styles.removeWorkTextDisabled,
                    ]}
                  >
                    Видалити
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                value={work.title}
                onChangeText={(value) => handleWorkTitleChange(work.id, value)}
                placeholder="Назва або короткий опис роботи"
                placeholderTextColor="#8E8E93"
                style={[styles.input, styles.workField]}
              />
              <TextInput
                value={work.price}
                onChangeText={(value) => handleWorkPriceChange(work.id, value)}
                placeholder="Ціна, грн"
                placeholderTextColor="#8E8E93"
                style={[styles.input, styles.workField]}
                keyboardType="decimal-pad"
              />
            </View>
          ))}
          <TouchableOpacity
            style={styles.addWorkButton}
            onPress={handleAddWork}
            activeOpacity={0.8}
          >
            <Text style={styles.addWorkButtonText}>+ Додати роботу</Text>
          </TouchableOpacity>
          <Text style={styles.hint}>
            Додайте довільну кількість робіт. Для кожної роботи вкажіть назву і
            ціну більше 0.
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[globalStyles.buttonSecondary, styles.actionButton]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={globalStyles.buttonSecondaryText}>Скасувати</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyles.buttonPrimary, styles.actionButton]}
            onPress={handleSave}
            activeOpacity={0.8}
            disabled={createServiceHistory.isPending}
          >
            <Text style={globalStyles.buttonPrimaryText}>
              {createServiceHistory.isPending ? "Збереження..." : "Зберегти"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </FormScreen>
  );
}
