import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { FormScreen } from "../../components/FormScreen";
import { useStatusBar } from "../../hooks/useStatusBar";
import { useTheme } from "../../hooks/useTheme";
import { useVehicles, useVehicle } from "../../queries";
import { ServiceBookingScreenProps } from "../../navigation/types";
import { globalStyles } from "../../styles/globalStyles";
import {
  BookingMediaAttachment,
  PartsOption,
  TimeSlotId,
  VisitReasonId,
} from "../../types/serviceBooking";
import { formatVinShort } from "../HomeScreen/homeScreenUtils";
import { BookingDayPicker } from "./BookingDayPicker";
import {
  PARTS_OPTIONS,
  TIME_SLOT_OPTIONS,
  VISIT_REASON_OPTIONS,
} from "./serviceBookingConfig";
import { styles } from "./ServiceBookingScreen.styles";

const MAX_PHOTO_ATTACHMENTS = 3;

function createAttachmentId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ServiceBookingScreen({
  navigation,
  route,
}: ServiceBookingScreenProps) {
  useStatusBar();
  const theme = useTheme();
  const { serviceId, serviceName } = route.params;
  void serviceId;

  const { data: vehicles = [], isLoading: isLoadingVehicles } = useVehicles();
  const [selectedVehicleId, setSelectedVehicleId] = React.useState<
    string | undefined
  >();
  const [visitReason, setVisitReason] = React.useState<VisitReasonId | null>(
    null
  );
  const [problemDescription, setProblemDescription] = React.useState("");
  const [selectedDateKey, setSelectedDateKey] = React.useState<string | null>(
    null
  );
  const [timeSlot, setTimeSlot] = React.useState<TimeSlotId | null>(null);
  const [partsOption, setPartsOption] = React.useState<PartsOption | null>(
    null
  );
  const [attachments, setAttachments] = React.useState<
    BookingMediaAttachment[]
  >([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { data: selectedVehicle, isLoading: isLoadingVehicle } = useVehicle(
    selectedVehicleId
  );

  React.useEffect(() => {
    if (!vehicles.length) {
      setSelectedVehicleId(undefined);
      return;
    }

    const exists = selectedVehicleId
      ? vehicles.some((vehicle) => vehicle.id === selectedVehicleId)
      : false;

    if (!exists) {
      setSelectedVehicleId(vehicles[0].id);
    }
  }, [vehicles, selectedVehicleId]);

  const handlePickMedia = async () => {
    if (attachments.length >= MAX_PHOTO_ATTACHMENTS) {
      Alert.alert(
        "Ліміт досягнуто",
        `Можна додати до ${MAX_PHOTO_ATTACHMENTS} фото або відео`
      );
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Дозвіл потрібен", "Потрібен дозвіл для доступу до галереї");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.8,
      videoMaxDuration: 30,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setAttachments((prev) => [
      ...prev,
      {
        id: createAttachmentId(),
        type: asset.type === "video" ? "video" : "image",
        uri: asset.uri,
      },
    ]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async () => {
    if (!selectedVehicleId || !selectedVehicle) {
      Alert.alert("Помилка", "Оберіть автомобіль для запису");
      return;
    }
    if (!visitReason) {
      Alert.alert("Помилка", "Оберіть причину візиту");
      return;
    }
    if (!problemDescription.trim()) {
      Alert.alert("Помилка", "Опишіть проблему своїми словами");
      return;
    }
    if (!selectedDateKey) {
      Alert.alert("Помилка", "Оберіть бажану дату");
      return;
    }
    if (!timeSlot) {
      Alert.alert("Помилка", "Оберіть часовий слот");
      return;
    }
    if (!partsOption) {
      Alert.alert("Помилка", "Вкажіть, чи потрібні запчастини від СТО");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      Alert.alert(
        "Заявку надіслано",
        `${serviceName ?? "СТО"} отримає вашу заявку. Адміністратор зателефонує, щоб підтвердити точний час.`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingVehicles) {
    return (
      <View
        style={[
          globalStyles.container,
          globalStyles.pageBackground,
          styles.loadingContainer,
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.accent.primary} />
        <Text style={globalStyles.loadingText}>Завантаження...</Text>
      </View>
    );
  }

  return (
    <FormScreen
      style={[globalStyles.container, globalStyles.pageBackground]}
      contentContainerStyle={styles.contentContainer}
    >
      <Animated.View entering={FadeIn.duration(280)}>
        <Text style={styles.pageTitle}>Онлайн запис</Text>
        <Text style={styles.pageSubtitle}>
          Заповніть заявку — менеджер СТО побачить усі деталі в CRM
        </Text>
        {serviceName ? (
          <View style={styles.serviceBadge}>
            <Feather name="map-pin" size={14} color={theme.colors.accent.primary} />
            <Text style={styles.serviceBadgeText}>{serviceName}</Text>
          </View>
        ) : null}
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(60)}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Автомобіль</Text>
          <Text style={styles.sectionHint}>
            Менеджер одразу побачить рік, об&apos;єм і VIN у CRM
          </Text>

          {!vehicles.length ? (
            <View style={styles.emptyCard}>
              <Feather name="truck" size={28} color="#8E8E93" />
              <Text style={styles.emptyText}>
                Додайте автомобіль у гараж, щоб записатися на сервіс
              </Text>
              <TouchableOpacity
                style={styles.addCarButton}
                onPress={() => navigation.navigate("CarCard")}
                activeOpacity={0.85}
              >
                <Text style={styles.addCarButtonText}>Додати автомобіль</Text>
              </TouchableOpacity>
            </View>
          ) : (
            vehicles.map((vehicle) => {
              const isSelected = vehicle.id === selectedVehicleId;
              const showDetails =
                isSelected && selectedVehicle && !isLoadingVehicle;

              return (
                <TouchableOpacity
                  key={vehicle.id}
                  style={[
                    styles.vehicleCard,
                    isSelected && styles.vehicleCardSelected,
                  ]}
                  onPress={() => setSelectedVehicleId(vehicle.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.vehicleCardHeader}>
                    <Text style={styles.vehicleCardTitle}>
                      {vehicle.brand} {vehicle.model}
                    </Text>
                    <Text style={styles.vehicleCardPlate}>
                      {vehicle.licensePlate}
                    </Text>
                  </View>

                  {showDetails ? (
                    <View style={styles.vehicleMetaRow}>
                      <Text style={styles.vehicleMetaPill}>
                        {selectedVehicle.year} р.
                      </Text>
                      <Text style={styles.vehicleMetaPill}>
                        {(selectedVehicle.engineCapacity / 1000).toFixed(1)} л
                      </Text>
                      <Text style={styles.vehicleMetaPill}>
                        VIN {formatVinShort(selectedVehicle.vin)}
                      </Text>
                    </View>
                  ) : isSelected && isLoadingVehicle ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.accent.primary}
                    />
                  ) : (
                    <Text style={styles.vehicleMetaPill}>
                      {vehicle.year} р.
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(120)}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Причина візиту</Text>
          {VISIT_REASON_OPTIONS.map((option) => {
            const isSelected = visitReason === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.reasonCard,
                  isSelected && styles.reasonCardSelected,
                ]}
                onPress={() => setVisitReason(option.id)}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.reasonIconWrap,
                    isSelected && styles.reasonIconWrapSelected,
                  ]}
                >
                  <Feather
                    name={option.icon}
                    size={16}
                    color={theme.colors.accent.primary}
                  />
                </View>
                <View style={styles.reasonContent}>
                  <Text style={styles.reasonTitle}>{option.title}</Text>
                  <Text style={styles.reasonSubtitle}>{option.subtitle}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(180)}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Опис проблеми</Text>
          <View style={styles.field}>
            <TextInput
              style={styles.textarea}
              value={problemDescription}
              onChangeText={setProblemDescription}
              placeholder="Опишіть, що трапилося (наприклад: стукає справа попереду на ямах, або свистить під капотом під час розгону)"
              placeholderTextColor="#8E8E93"
              multiline
            />
          </View>

          <View style={styles.mediaToolbar}>
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={handlePickMedia}
              activeOpacity={0.85}
            >
              <Feather name="paperclip" size={14} color={theme.colors.accent.primary} />
              <Text style={styles.mediaButtonText}>Фото / відео</Text>
            </TouchableOpacity>
          </View>

          {attachments.length > 0 ? (
            <View style={styles.attachmentsList}>
              {attachments.map((attachment) => (
                <View key={attachment.id} style={styles.attachmentItem}>
                  {attachment.type === "image" ? (
                    <Image
                      source={{ uri: attachment.uri }}
                      style={{ width: 36, height: 36, borderRadius: 8 }}
                    />
                  ) : (
                    <Feather
                      name="video"
                      size={16}
                      color={theme.colors.accent.primary}
                    />
                  )}
                  <Text style={styles.attachmentLabel}>
                    {attachment.type === "image" ? "Фото" : "Відео"}
                  </Text>
                  <TouchableOpacity
                    style={styles.attachmentRemove}
                    onPress={() => handleRemoveAttachment(attachment.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Feather name="x" size={16} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(240)}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Бажана дата та час</Text>
          <Text style={styles.sectionHint}>
            Оберіть день і зручний слот — точний час узгодять по телефону
          </Text>

          <BookingDayPicker
            selectedDateKey={selectedDateKey}
            onSelect={setSelectedDateKey}
          />

          <View style={styles.slotRow}>
            {TIME_SLOT_OPTIONS.map((slot) => {
              const isSelected = timeSlot === slot.id;
              return (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.slotChip,
                    isSelected && styles.slotChipSelected,
                  ]}
                  onPress={() => setTimeSlot(slot.id)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.slotLabel,
                      isSelected && styles.slotLabelSelected,
                    ]}
                  >
                    {slot.label}
                  </Text>
                  <Text style={styles.slotRange}>{slot.range}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(300)}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Запчастини</Text>
          {PARTS_OPTIONS.map((option) => {
            const isSelected = partsOption === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.partsCard,
                  isSelected && styles.partsCardSelected,
                ]}
                onPress={() => setPartsOption(option.id)}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.partsRadio,
                    isSelected && styles.partsRadioSelected,
                  ]}
                >
                  {isSelected ? <View style={styles.partsRadioDot} /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.partsTitle}>{option.title}</Text>
                  <Text style={styles.partsSubtitle}>{option.subtitle}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(300).delay(360)}>
        <View style={styles.actionsSection}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              (isSubmitting || !vehicles.length) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting || !vehicles.length}
            activeOpacity={0.85}
          >
            <Feather name="send" size={18} color={theme.colors.text.inverse} />
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Надсилання..." : "Надіслати заявку"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            <Feather name="x" size={18} color={theme.colors.accent.primary} />
            <Text style={styles.cancelButtonText}>Скасувати</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </FormScreen>
  );
}
