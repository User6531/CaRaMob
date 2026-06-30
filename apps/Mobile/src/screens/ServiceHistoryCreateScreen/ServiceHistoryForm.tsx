import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../../hooks/useTheme";
import { styles } from "./ServiceHistoryCreateScreen.styles";

export interface ServiceHistoryWorkInput {
  id: string;
  title: string;
  price: string;
}

export interface ServiceHistoryFormProps {
  pageTitle: string;
  pageSubtitle: string;
  vehicleTitle?: string;
  draftHint?: boolean;
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  works: ServiceHistoryWorkInput[];
  onAddWork: () => void;
  onRemoveWork: (id: string) => void;
  onWorkTitleChange: (id: string, value: string) => void;
  onWorkPriceChange: (id: string, value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
  saveLabel?: string;
  savingLabel?: string;
}

function parseWorkPrice(price: string): number {
  const parsed = Number(price.replace(",", ".").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatTotal(price: number): string {
  if (price <= 0) return "0 грн";
  return `${price.toLocaleString("uk-UA")} грн`;
}

export function ServiceHistoryForm({
  pageTitle,
  pageSubtitle,
  vehicleTitle,
  draftHint = false,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  works,
  onAddWork,
  onRemoveWork,
  onWorkTitleChange,
  onWorkPriceChange,
  onCancel,
  onSave,
  isSaving,
  saveLabel = "Зберегти запис",
  savingLabel = "Збереження...",
}: ServiceHistoryFormProps) {
  const theme = useTheme();

  const worksTotal = works.reduce(
    (sum, work) => sum + parseWorkPrice(work.price),
    0
  );

  return (
    <>
      <Animated.View entering={FadeIn.duration(280)}>
        <Text style={styles.pageTitle}>{pageTitle}</Text>
        <Text style={styles.pageSubtitle}>{pageSubtitle}</Text>

        {vehicleTitle ? (
          <View style={styles.vehicleBadge}>
            <Feather name="truck" size={14} color={theme.colors.accent.primary} />
            <Text style={styles.vehicleBadgeText}>{vehicleTitle}</Text>
          </View>
        ) : null}

        {draftHint ? (
          <View style={styles.draftBadge}>
            <Feather name="save" size={14} color="#D29922" />
            <Text style={styles.draftBadgeText}>
              Відновлено збережений чернетковий запис
            </Text>
          </View>
        ) : null}
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(60)}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Основна інформація</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Назва візиту / СТО *</Text>
            <TextInput
              value={title}
              onChangeText={onTitleChange}
              placeholder="Наприклад: Bosch Service, ТО 120000"
              placeholderTextColor="#8E8E93"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Опис</Text>
            <TextInput
              value={description}
              onChangeText={onDescriptionChange}
              placeholder="Короткий опис візиту (необов'язково)"
              placeholderTextColor="#8E8E93"
              style={[styles.input, styles.textarea]}
              multiline
            />
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(120)}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Список робіт</Text>
            <Text style={styles.sectionMeta}>{works.length} поз.</Text>
          </View>

          {works.map((work, index) => (
            <View key={work.id} style={styles.workItem}>
              <View style={styles.workItemHeader}>
                <View style={styles.workItemTitleRow}>
                  <View style={styles.workItemIndex}>
                    <Text style={styles.workItemIndexText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.workItemTitle}>Робота</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeWorkButton}
                  onPress={() => onRemoveWork(work.id)}
                  disabled={works.length === 1}
                  activeOpacity={0.8}
                >
                  <Feather
                    name="trash-2"
                    size={14}
                    color={works.length === 1 ? "#6E7681" : "#F85149"}
                  />
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

              <View style={styles.field}>
                <Text style={styles.label}>Назва роботи *</Text>
                <TextInput
                  value={work.title}
                  onChangeText={(value) => onWorkTitleChange(work.id, value)}
                  placeholder="Наприклад: Заміна масла"
                  placeholderTextColor="#8E8E93"
                  style={styles.input}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Ціна, грн *</Text>
                <TextInput
                  value={work.price}
                  onChangeText={(value) => onWorkPriceChange(work.id, value)}
                  placeholder="0"
                  placeholderTextColor="#8E8E93"
                  style={styles.input}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addWorkButton}
            onPress={onAddWork}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={16} color={theme.colors.accent.primary} />
            <Text style={styles.addWorkButtonText}>Додати роботу</Text>
          </TouchableOpacity>

          <Text style={styles.hint}>
            Додайте довільну кількість робіт. Для кожної вкажіть назву та ціну
            більше 0.
          </Text>

          {worksTotal > 0 ? (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Попередня сума</Text>
              <Text style={styles.totalPrice}>{formatTotal(worksTotal)}</Text>
            </View>
          ) : null}
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(180)}>
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={onSave}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            <Feather name="check" size={18} color={theme.colors.text.inverse} />
            <Text style={styles.saveButtonText}>
              {isSaving ? savingLabel : saveLabel}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            disabled={isSaving}
            activeOpacity={0.85}
          >
            <Feather name="x" size={18} color={theme.colors.accent.primary} />
            <Text style={styles.cancelButtonText}>Скасувати</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
}
