import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { useMechanicWork } from "../../context/MechanicWorkContext";
import { MechanicSessionStatus, MechanicWorkItem, PartOrderItem } from "../../types/mechanicWork";
import { formatMechanicVehicleMeta } from "../MechanicAssignedVehiclesScreen/mechanicVehicleUtils";
import {
  getSessionProgress,
  getSessionStatusLabel,
  getSessionStepIndex,
  getVisibleSessionSteps,
} from "./mechanicSessionConfig";
import {
  calculateWorksTotal,
  formatWorkPrice,
  getWorkItemStatusStyle,
  splitWorkItems,
  WORK_ITEM_STATUS_LABELS,
  WORK_ITEM_STATUS_ORDER,
} from "./mechanicWorkUtils";
import {
  getPartOrderStatusStyle,
  PART_ORDER_STATUS_LABELS,
  PART_ORDER_STATUS_ORDER,
} from "./mechanicPartsUtils";
import { styles } from "./MechanicActiveWorkContent.styles";

const MAX_PHOTOS = 6;

export interface MechanicActiveWorkContentProps {
  contentContainerStyle?: ViewStyle;
}

interface PhotoGridProps {
  photos: string[];
  onAdd: () => void;
  onRemove: (uri: string) => void;
  addLabel: string;
}

function PhotoGrid({ photos, onAdd, onRemove, addLabel }: PhotoGridProps) {
  const theme = useTheme();

  return (
    <>
      <View style={styles.photoToolbar}>
        <TouchableOpacity
          style={styles.photoButton}
          onPress={onAdd}
          activeOpacity={0.85}
          disabled={photos.length >= MAX_PHOTOS}
        >
          <Feather name="camera" size={14} color={theme.colors.accent.primary} />
          <Text style={styles.photoButtonText}>{addLabel}</Text>
        </TouchableOpacity>
      </View>
      {photos.length > 0 ? (
        <View style={styles.photoList}>
          {photos.map((uri) => (
            <View key={uri} style={styles.photoThumbWrap}>
              <Image source={{ uri }} style={styles.photoThumb} />
              <TouchableOpacity
                style={styles.photoRemove}
                onPress={() => onRemove(uri)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Feather name="x" size={12} color="#F85149" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : null}
    </>
  );
}

function SessionTimeline({ status }: { status: MechanicSessionStatus }) {
  const steps = getVisibleSessionSteps();
  const currentIndex = getSessionStepIndex(status);
  const progress = getSessionProgress(status);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Етап роботи</Text>
      <Text style={styles.sectionHint}>
        Поточний етап: {getSessionStatusLabel(status)}. Перехід лише через дії
        нижче.
      </Text>

      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>Загальний прогрес</Text>
        <Text style={styles.progressPercent}>{progress}%</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.timelineRow}>
        {steps.map((step) => {
          const stepIndex = getSessionStepIndex(step.id);
          const isDone =
            status === "completed" ? stepIndex <= getSessionStepIndex("estimate") : currentIndex > stepIndex;
          const isActive =
            status === "completed"
              ? step.id === "estimate"
              : status === "waiting_parts"
                ? step.id === "repair"
                : step.id === status;

          return (
            <View key={step.id} style={styles.timelineStep}>
              <View
                style={[
                  styles.timelineDot,
                  isDone && styles.timelineDotDone,
                  isActive && !isDone && styles.timelineDotActive,
                ]}
              />
              <Text
                style={[
                  styles.timelineLabel,
                  isDone && styles.timelineLabelDone,
                  isActive && styles.timelineLabelActive,
                ]}
                numberOfLines={2}
              >
                {step.shortTitle}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function VehicleInfoCard({
  vehicleTitle,
  licensePlate,
  meta,
  clientName,
  problemSummary,
}: {
  vehicleTitle: string;
  licensePlate: string;
  meta: string;
  clientName?: string;
  problemSummary: string;
}) {
  const theme = useTheme();

  return (
    <View style={[styles.section, styles.vehicleCard]}>
      <View style={styles.vehicleHeader}>
        <View style={styles.vehicleIcon}>
          <Feather name="truck" size={22} color={theme.colors.accent.primary} />
        </View>
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleTitle}>
            {vehicleTitle} · {licensePlate}
          </Text>
          <Text style={styles.vehicleMeta}>{meta}</Text>
          {clientName ? (
            <Text style={styles.vehicleMeta}>Власник: {clientName}</Text>
          ) : null}
        </View>
      </View>
      <Text style={styles.problemText}>Запит клієнта: {problemSummary}</Text>
    </View>
  );
}

function PrimaryButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  onPress: () => void;
}) {
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={styles.primaryButton}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Feather name={icon} size={18} color={theme.colors.text.inverse} />
      <Text style={styles.primaryButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

function SecondaryButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.secondaryButton}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Feather name={icon} size={18} color="#FFFFFF" />
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

interface PartOrderRowProps {
  item: PartOrderItem;
  onNameChange: (value: string) => void;
  onQuantityChange: (value: string) => void;
  onArticleChange: (value: string) => void;
  onSupplierChange: (value: string) => void;
  onStatusChange: (status: PartOrderItem["status"]) => void;
  onRemove: () => void;
}

function PartOrderRow({
  item,
  onNameChange,
  onQuantityChange,
  onArticleChange,
  onSupplierChange,
  onStatusChange,
  onRemove,
}: PartOrderRowProps) {
  return (
    <View style={[styles.workItem, styles.partOrderItem]}>
      <View style={styles.workItemHeader}>
        <Text style={styles.stageInfoTitle}>Деталь</Text>
        <TouchableOpacity
          style={styles.removeWorkButton}
          onPress={onRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="trash-2" size={14} color="#F85149" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        value={item.name}
        onChangeText={onNameChange}
        placeholder="Назва деталі"
        placeholderTextColor="#8E8E93"
      />

      <View style={styles.partMetaRow}>
        <TextInput
          style={[styles.input, styles.partMetaInput]}
          value={item.quantity}
          onChangeText={onQuantityChange}
          placeholder="К-сть"
          placeholderTextColor="#8E8E93"
          keyboardType="number-pad"
        />
        <TextInput
          style={[styles.input, styles.partMetaInputWide]}
          value={item.article}
          onChangeText={onArticleChange}
          placeholder="Артикул / OEM"
          placeholderTextColor="#8E8E93"
        />
      </View>

      <TextInput
        style={styles.input}
        value={item.supplier}
        onChangeText={onSupplierChange}
        placeholder="Постачальник"
        placeholderTextColor="#8E8E93"
      />

      <View style={styles.statusRow}>
        {PART_ORDER_STATUS_ORDER.map((status) => {
          const isActive = item.status === status;
          const statusStyle = getPartOrderStatusStyle(status);

          return (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusToggle,
                {
                  backgroundColor: isActive
                    ? statusStyle.backgroundColor
                    : "rgba(255, 255, 255, 0.03)",
                  borderColor: isActive
                    ? statusStyle.borderColor
                    : "rgba(255, 255, 255, 0.08)",
                },
              ]}
              onPress={() => onStatusChange(status)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.statusToggleText,
                  { color: isActive ? statusStyle.textColor : "#8E8E93" },
                ]}
              >
                {PART_ORDER_STATUS_LABELS[status]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

interface DiagnosticsWorkItemProps {
  item: MechanicWorkItem;
  onTitleChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onRemove: () => void;
}

function DiagnosticsWorkItemRow({
  item,
  onTitleChange,
  onPriceChange,
  onRemove,
}: DiagnosticsWorkItemProps) {
  return (
    <View style={styles.workItem}>
      <View style={styles.workItemHeader}>
        <Text style={styles.stageInfoTitle}>Робота</Text>
        <TouchableOpacity
          style={styles.removeWorkButton}
          onPress={onRemove}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="trash-2" size={14} color="#F85149" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        value={item.title}
        onChangeText={onTitleChange}
        placeholder="Назва роботи"
        placeholderTextColor="#8E8E93"
      />
      <View style={styles.priceRow}>
        <TextInput
          style={[styles.input, styles.priceInput]}
          value={item.price}
          onChangeText={onPriceChange}
          placeholder="0"
          placeholderTextColor="#8E8E93"
          keyboardType="decimal-pad"
        />
        <Text style={styles.priceSuffix}>грн</Text>
      </View>
    </View>
  );
}

interface RepairWorkItemProps {
  item: MechanicWorkItem;
  onStatusChange: (status: MechanicWorkItem["status"]) => void;
  onAddPhoto: () => void;
  onRemovePhoto: (uri: string) => void;
}

function RepairWorkItemRow({
  item,
  onStatusChange,
  onAddPhoto,
  onRemovePhoto,
}: RepairWorkItemProps) {
  const statusStyle = getWorkItemStatusStyle(item.status);

  return (
    <View style={styles.workItem}>
      <Text style={styles.stageInfoTitle}>{item.title || "Без назви"}</Text>
      {item.price ? (
        <Text style={styles.stageInfoText}>{formatWorkPrice(item.price)}</Text>
      ) : null}

      <View style={styles.statusRow}>
        {WORK_ITEM_STATUS_ORDER.map((status) => {
          const isActive = item.status === status;
          const toggleStyle = getWorkItemStatusStyle(status);

          return (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusToggle,
                {
                  backgroundColor: isActive
                    ? toggleStyle.backgroundColor
                    : "rgba(255, 255, 255, 0.03)",
                  borderColor: isActive
                    ? toggleStyle.borderColor
                    : "rgba(255, 255, 255, 0.08)",
                },
              ]}
              onPress={() => onStatusChange(status)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.statusToggleText,
                  { color: isActive ? toggleStyle.textColor : "#8E8E93" },
                ]}
              >
                {WORK_ITEM_STATUS_LABELS[status]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <PhotoGrid
        photos={item.photos}
        onAdd={onAddPhoto}
        onRemove={onRemovePhoto}
        addLabel="Фото роботи"
      />

      <View
        style={[
          styles.estimateStatusBadge,
          {
            backgroundColor: statusStyle.backgroundColor,
            borderColor: statusStyle.borderColor,
          },
        ]}
      >
        <Text style={[styles.estimateStatusText, { color: statusStyle.textColor }]}>
          {WORK_ITEM_STATUS_LABELS[item.status]}
        </Text>
      </View>
    </View>
  );
}

interface RecommendationWorkItemProps {
  item: MechanicWorkItem;
  editable?: boolean;
  onTitleChange?: (value: string) => void;
  onStatusChange?: (status: MechanicWorkItem["status"]) => void;
  onRemove?: () => void;
}

function RecommendationWorkItemRow({
  item,
  editable = true,
  onTitleChange,
  onStatusChange,
  onRemove,
}: RecommendationWorkItemProps) {
  const isRecommended = item.kind === "recommended";

  return (
    <View
      style={[styles.workItem, isRecommended && styles.workItemRecommended]}
    >
      <View style={styles.workItemHeader}>
        <View style={styles.workItemBadges}>
          <View style={styles.kindBadge}>
            <Text style={styles.kindBadgeText}>Рекомендація</Text>
          </View>
          {item.awaitingApproval ? (
            <View style={styles.approvalBadge}>
              <Text style={styles.approvalBadgeText}>Очікує погодження</Text>
            </View>
          ) : null}
        </View>
        {editable && onRemove ? (
          <TouchableOpacity
            style={styles.removeWorkButton}
            onPress={onRemove}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="trash-2" size={14} color="#F85149" />
          </TouchableOpacity>
        ) : null}
      </View>

      {editable && onTitleChange ? (
        <TextInput
          style={styles.input}
          value={item.title}
          onChangeText={onTitleChange}
          placeholder="Опишіть знайдену проблему"
          placeholderTextColor="#8E8E93"
        />
      ) : (
        <Text style={styles.stageInfoText}>{item.title || "Без опису"}</Text>
      )}

      {onStatusChange ? (
        <View style={styles.statusRow}>
          {WORK_ITEM_STATUS_ORDER.map((status) => {
            const isActive = item.status === status;
            const toggleStyle = getWorkItemStatusStyle(status);

            return (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusToggle,
                  {
                    backgroundColor: isActive
                      ? toggleStyle.backgroundColor
                      : "rgba(255, 255, 255, 0.03)",
                    borderColor: isActive
                      ? toggleStyle.borderColor
                      : "rgba(255, 255, 255, 0.08)",
                  },
                ]}
                onPress={() => onStatusChange(status)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.statusToggleText,
                    { color: isActive ? toggleStyle.textColor : "#8E8E93" },
                  ]}
                >
                  {WORK_ITEM_STATUS_LABELS[status]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

interface EstimateWorkItemProps {
  item: MechanicWorkItem;
  onPriceChange: (value: string) => void;
}

function EstimateWorkItemRow({ item, onPriceChange }: EstimateWorkItemProps) {
  const statusStyle = getWorkItemStatusStyle(item.status);

  return (
    <View style={styles.workItem}>
      <Text style={styles.stageInfoTitle}>{item.title || "Без назви"}</Text>
      <View
        style={[
          styles.estimateStatusBadge,
          {
            backgroundColor: statusStyle.backgroundColor,
            borderColor: statusStyle.borderColor,
          },
        ]}
      >
        <Text style={[styles.estimateStatusText, { color: statusStyle.textColor }]}>
          {WORK_ITEM_STATUS_LABELS[item.status]}
        </Text>
      </View>
      <View style={styles.priceRow}>
        <TextInput
          style={[styles.input, styles.priceInput]}
          value={item.price}
          onChangeText={onPriceChange}
          placeholder="0"
          placeholderTextColor="#8E8E93"
          keyboardType="decimal-pad"
        />
        <Text style={styles.priceSuffix}>грн</Text>
      </View>
    </View>
  );
}

async function pickPhoto(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert("Дозвіл потрібен", "Потрібен дозвіл для доступу до галереї");
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) return null;
  return result.assets[0].uri;
}

export function MechanicActiveWorkContent({
  contentContainerStyle,
}: MechanicActiveWorkContentProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const scrollTopInset = 16 + insets.top;

  const {
    activeVehicle,
    session,
    acceptVehicle,
    startDiagnostics,
    approveDiagnostics,
    completeRepair,
    returnToRepair,
    startWaitingParts,
    proceedToEstimate,
    finishWork,
    addWorkItem,
    updateWorkItem,
    removeWorkItem,
    addWorkItemPhoto,
    removeWorkItemPhoto,
    addPartOrder,
    updatePartOrder,
    removePartOrder,
    setConclusion,
    addConclusionPhoto,
    removeConclusionPhoto,
  } = useMechanicWork();

  const handlePickWorkItemPhoto = async (workItemId: string, currentCount: number) => {
    if (currentCount >= MAX_PHOTOS) {
      Alert.alert("Ліміт", `Можна додати до ${MAX_PHOTOS} фото`);
      return;
    }
    const uri = await pickPhoto();
    if (uri) addWorkItemPhoto(workItemId, uri);
  };

  const handlePickConclusionPhoto = async () => {
    if ((session?.conclusionPhotos.length ?? 0) >= MAX_PHOTOS) {
      Alert.alert("Ліміт", `Можна додати до ${MAX_PHOTOS} фото`);
      return;
    }
    const uri = await pickPhoto();
    if (uri) addConclusionPhoto(uri);
  };

  const handleApproveDiagnostics = () => {
    const planned = session?.workItems.filter((item) => item.kind === "planned") ?? [];
    const hasValidWork = planned.some((item) => item.title.trim().length > 0);

    if (!hasValidWork) {
      Alert.alert("Помилка", "Додайте хоча б одну роботу з назвою перед погодженням");
      return;
    }

    Alert.alert(
      "Погодити кошторис?",
      "Клієнт отримає список робіт та приблизну вартість для підтвердження.",
      [
        { text: "Скасувати", style: "cancel" },
        { text: "Погодити", onPress: approveDiagnostics },
      ]
    );
  };

  const handleCompleteRepair = () => {
    const planned =
      session?.workItems.filter(
        (item) => item.kind === "planned" && item.status !== "completed"
      ) ?? [];

    if (planned.length > 0) {
      Alert.alert(
        "Незавершені роботи",
        "Деякі роботи ще не позначені як виконані. Все одно перейти до фінальної перевірки?",
        [
          { text: "Скасувати", style: "cancel" },
          { text: "Перейти", onPress: completeRepair },
        ]
      );
      return;
    }

    completeRepair();
  };

  const handleReturnToRepair = () => {
    Alert.alert(
      "Повернутись до ремонту?",
      "Ви зможете змінити статуси робіт, додати фото та продовжити ремонт.",
      [
        { text: "Скасувати", style: "cancel" },
        { text: "Повернутись", onPress: returnToRepair },
      ]
    );
  };

  const handleStartWaitingParts = () => {
    const hasNamedPart =
      session?.partOrders.some((item) => item.name.trim().length > 0) ?? false;

    if (!hasNamedPart && (session?.partOrders.length ?? 0) === 0) {
      addPartOrder();
    }

    startWaitingParts();
  };

  const handleResumeFromParts = () => {
    const pending =
      session?.partOrders.filter((item) => item.status !== "received") ?? [];

    if (pending.length > 0) {
      Alert.alert(
        "Деталі ще не всі отримані",
        "Деякі позиції ще не позначені як «Отримано». Продовжити ремонт?",
        [
          { text: "Скасувати", style: "cancel" },
          { text: "Продовжити", onPress: returnToRepair },
        ]
      );
      return;
    }

    returnToRepair();
  };

  const handleFinishWork = () => {
    if (!session?.conclusion.trim()) {
      Alert.alert("Помилка", "Напишіть висновок для водія перед завершенням");
      return;
    }

    Alert.alert(
      "Завершити роботу?",
      "Водій побачить кошторис, висновок та фото. Статус зміниться на «Завершено».",
      [
        { text: "Скасувати", style: "cancel" },
        { text: "Завершити", onPress: finishWork },
      ]
    );
  };

  if (!activeVehicle || !session) {
    return (
      <View style={styles.panel}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.contentContainer,
            { paddingTop: 0 },
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.scrollContent, { paddingTop: scrollTopInset }]}>
            <Text style={styles.pageTitle}>В роботі</Text>
            <Text style={styles.pageSubtitle}>
              Оберіть автомобіль у вкладці «Мої авто»
            </Text>
            <View style={styles.emptyCard}>
              <Feather name="tool" size={36} color="#8E8E93" />
              <Text style={styles.emptyTitle}>Немає активного авто</Text>
              <Text style={styles.emptyText}>
                Відкрийте картку автомобіля в списку призначених, щоб почати
                роботу
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  const { planned, recommended } = splitWorkItems(session.workItems);
  const allWorksTotal = calculateWorksTotal(session.workItems);
  const diagnosticsTotal = calculateWorksTotal(planned);

  const renderRecommendationsSection = (editable: boolean) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Додаткові рекомендації</Text>
      <Text style={styles.sectionHint}>
        Якщо знайшли нову проблему — додайте рекомендацію для погодження з
        клієнтом
      </Text>

      {recommended.map((item) => (
        <RecommendationWorkItemRow
          key={item.id}
          item={item}
          editable={editable}
          onTitleChange={
            editable
              ? (value) => updateWorkItem(item.id, { title: value })
              : undefined
          }
          onStatusChange={
            editable
              ? (status) => updateWorkItem(item.id, { status })
              : undefined
          }
          onRemove={editable ? () => removeWorkItem(item.id) : undefined}
        />
      ))}

      {editable ? (
        <TouchableOpacity
          style={[styles.addButton, styles.recommendButton]}
          onPress={() => addWorkItem("recommended")}
          activeOpacity={0.85}
        >
          <Feather name="alert-circle" size={16} color="#FFA657" />
          <Text style={[styles.addButtonText, styles.recommendButtonText]}>
            Додати рекомендацію
          </Text>
        </TouchableOpacity>
      ) : recommended.length === 0 ? (
        <Text style={styles.stageInfoText}>Додаткових рекомендацій немає</Text>
      ) : null}
    </View>
  );

  const renderStageContent = () => {
    switch (session.sessionStatus) {
      case "waiting":
        return (
          <Animated.View entering={FadeIn.duration(300).delay(120)}>
            <View style={styles.section}>
              <View style={styles.stageInfoCard}>
                <Text style={styles.stageInfoTitle}>Очікує прийому</Text>
                <Text style={styles.stageInfoText}>
                  Автомобіль ще не прийнято на СТО. Перевірте запит клієнта та
                  натисніть «Прийняти», коли будете готові почати роботу.
                </Text>
              </View>
              <PrimaryButton
                label="Прийняти автомобіль"
                icon="check-circle"
                onPress={acceptVehicle}
              />
            </View>
          </Animated.View>
        );

      case "accepted":
        return (
          <Animated.View entering={FadeIn.duration(300).delay(120)}>
            <View style={styles.section}>
              <View style={styles.stageInfoCard}>
                <Text style={styles.stageInfoTitle}>Автомобіль прийнято</Text>
                <Text style={styles.stageInfoText}>
                  Проміжний етап. Наступний крок — діагностика та складання
                  переліку робіт.
                </Text>
              </View>
              <PrimaryButton
                label="Почати діагностику"
                icon="search"
                onPress={startDiagnostics}
              />
            </View>
          </Animated.View>
        );

      case "diagnostics":
        return (
          <>
            <Animated.View entering={FadeIn.duration(300).delay(120)}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Перелік робіт</Text>
                <Text style={styles.sectionHint}>
                  Складіть список робіт та вкажіть приблизну вартість кожної
                </Text>

                {planned.map((item) => (
                  <DiagnosticsWorkItemRow
                    key={item.id}
                    item={item}
                    onTitleChange={(value) =>
                      updateWorkItem(item.id, { title: value })
                    }
                    onPriceChange={(value) =>
                      updateWorkItem(item.id, { price: value })
                    }
                    onRemove={() => removeWorkItem(item.id)}
                  />
                ))}

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addWorkItem("planned")}
                  activeOpacity={0.85}
                >
                  <Feather name="plus" size={16} color={theme.colors.accent.primary} />
                  <Text style={styles.addButtonText}>Додати роботу</Text>
                </TouchableOpacity>

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Приблизна вартість</Text>
                  <Text style={styles.totalValue}>
                    {formatWorkPrice(diagnosticsTotal)}
                  </Text>
                </View>

                <PrimaryButton
                  label="Погодити"
                  icon="send"
                  onPress={handleApproveDiagnostics}
                />
              </View>
            </Animated.View>
          </>
        );

      case "repair":
        return (
          <>
            <Animated.View entering={FadeIn.duration(300).delay(120)}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Роботи в процесі</Text>
                <Text style={styles.sectionHint}>
                  Відмічайте статус кожної роботи та додавайте фото
                </Text>

                {planned.map((item) => (
                  <RepairWorkItemRow
                    key={item.id}
                    item={item}
                    onStatusChange={(status) =>
                      updateWorkItem(item.id, { status })
                    }
                    onAddPhoto={() =>
                      handlePickWorkItemPhoto(item.id, item.photos.length)
                    }
                    onRemovePhoto={(uri) => removeWorkItemPhoto(item.id, uri)}
                  />
                ))}
              </View>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(300).delay(160)}>
              {renderRecommendationsSection(true)}
            </Animated.View>

            <Animated.View entering={FadeIn.duration(300).delay(200)}>
              <View style={[styles.section, styles.actionGroup]}>
                <SecondaryButton
                  label="Очікуємо деталі"
                  icon="package"
                  onPress={handleStartWaitingParts}
                />
                <PrimaryButton
                  label="Завершити ремонт"
                  icon="check"
                  onPress={handleCompleteRepair}
                />
              </View>
            </Animated.View>
          </>
        );

      case "waiting_parts":
        return (
          <>
            <Animated.View entering={FadeIn.duration(300).delay(120)}>
              <View style={styles.section}>
                <View style={[styles.stageInfoCard, styles.partsInfoCard]}>
                  <Text style={styles.stageInfoTitle}>Очікує деталей</Text>
                  <Text style={styles.stageInfoText}>
                    Додайте замовлені деталі та відстежуйте їх статус. Коли
                    деталі надійдуть — продовжіть ремонт.
                  </Text>
                </View>
              </View>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(300).delay(140)}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Замовлення деталей</Text>
                <Text style={styles.sectionHint}>
                  Вкажіть що замовлено, у якої кількості та від якого
                  постачальника
                </Text>

                {session.partOrders.map((item) => (
                  <PartOrderRow
                    key={item.id}
                    item={item}
                    onNameChange={(value) =>
                      updatePartOrder(item.id, { name: value })
                    }
                    onQuantityChange={(value) =>
                      updatePartOrder(item.id, { quantity: value })
                    }
                    onArticleChange={(value) =>
                      updatePartOrder(item.id, { article: value })
                    }
                    onSupplierChange={(value) =>
                      updatePartOrder(item.id, { supplier: value })
                    }
                    onStatusChange={(status) =>
                      updatePartOrder(item.id, { status })
                    }
                    onRemove={() => removePartOrder(item.id)}
                  />
                ))}

                <TouchableOpacity
                  style={[styles.addButton, styles.recommendButton]}
                  onPress={addPartOrder}
                  activeOpacity={0.85}
                >
                  <Feather name="plus" size={16} color="#FFA657" />
                  <Text style={[styles.addButtonText, styles.recommendButtonText]}>
                    Додати деталь
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(300).delay(160)}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Роботи на паузі</Text>
                <Text style={styles.sectionHint}>
                  Статуси робіт збережено — після отримання деталей продовжіть
                  ремонт
                </Text>

                {planned.map((item) => (
                  <View key={item.id} style={styles.workItem}>
                    <Text style={styles.stageInfoTitle}>
                      {item.title || "Без назви"}
                    </Text>
                    <Text style={styles.stageInfoText}>
                      {WORK_ITEM_STATUS_LABELS[item.status]}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(300).delay(200)}>
              <View style={[styles.section, styles.actionGroup]}>
                <PrimaryButton
                  label="Продовжити ремонт"
                  icon="tool"
                  onPress={handleResumeFromParts}
                />
              </View>
            </Animated.View>
          </>
        );

      case "final_check":
        return (
          <>
            <Animated.View entering={FadeIn.duration(300).delay(120)}>
              <View style={styles.section}>
                <View style={styles.stageInfoCard}>
                  <Text style={styles.stageInfoTitle}>Фінальна перевірка</Text>
                  <Text style={styles.stageInfoText}>
                    Перевірте якість виконаних робіт. За потреби змініть статус
                    роботи або поверніться до етапу ремонту.
                  </Text>
                </View>
              </View>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(300).delay(140)}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Статус робіт</Text>
                <Text style={styles.sectionHint}>
                  Якщо щось не завершено — поверніть роботу в «В роботі» або
                  «Не розпочато»
                </Text>

                {planned.map((item) => (
                  <RepairWorkItemRow
                    key={item.id}
                    item={item}
                    onStatusChange={(status) =>
                      updateWorkItem(item.id, { status })
                    }
                    onAddPhoto={() =>
                      handlePickWorkItemPhoto(item.id, item.photos.length)
                    }
                    onRemovePhoto={(uri) => removeWorkItemPhoto(item.id, uri)}
                  />
                ))}
              </View>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(300).delay(160)}>
              {renderRecommendationsSection(true)}
            </Animated.View>

            <Animated.View entering={FadeIn.duration(300).delay(200)}>
              <View style={[styles.section, styles.actionGroup]}>
                <SecondaryButton
                  label="Повернутись до ремонту"
                  icon="arrow-left"
                  onPress={handleReturnToRepair}
                />
                <PrimaryButton
                  label="Перейти до кошторису"
                  icon="file-text"
                  onPress={proceedToEstimate}
                />
              </View>
            </Animated.View>
          </>
        );

      case "estimate":
        return (
          <>
            <Animated.View entering={FadeIn.duration(300).delay(120)}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Кошторис</Text>
                <Text style={styles.sectionHint}>
                  Уточніть вартість кожної роботи перед завершенням
                </Text>

                {session.workItems.map((item) => (
                  <EstimateWorkItemRow
                    key={item.id}
                    item={item}
                    onPriceChange={(value) =>
                      updateWorkItem(item.id, { price: value })
                    }
                  />
                ))}

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Загальна сума</Text>
                  <Text style={styles.totalValue}>
                    {formatWorkPrice(allWorksTotal)}
                  </Text>
                </View>
              </View>
            </Animated.View>

            <Animated.View entering={FadeIn.duration(300).delay(160)}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Висновок для водія</Text>
                <Text style={styles.sectionHint}>
                  Опишіть результат робіт і рекомендації для клієнта
                </Text>

                <TextInput
                  style={[styles.input, styles.textarea]}
                  value={session.conclusion}
                  onChangeText={setConclusion}
                  placeholder="Наприклад: роботи виконані, рекомендуємо звернути увагу на заміну гальм через 5000 кілометрів"
                  placeholderTextColor="#8E8E93"
                  multiline
                />

                <PhotoGrid
                  photos={session.conclusionPhotos}
                  onAdd={handlePickConclusionPhoto}
                  onRemove={removeConclusionPhoto}
                  addLabel="Фото до висновку"
                />

                <PrimaryButton
                  label="Завершити"
                  icon="flag"
                  onPress={handleFinishWork}
                />
              </View>
            </Animated.View>
          </>
        );

      case "completed":
        return (
          <Animated.View entering={FadeIn.duration(300).delay(120)}>
            <View style={styles.section}>
              <View style={styles.completedCard}>
                <Feather name="check-circle" size={40} color={theme.colors.accent.primary} />
                <Text style={styles.completedTitle}>Роботу завершено</Text>
                <Text style={styles.stageInfoText}>
                  Водій отримав кошторис та ваш висновок. Автомобіль готовий до
                  видачі.
                </Text>
              </View>
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.panel}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: 0 },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.scrollContent, { paddingTop: scrollTopInset }]}>
          <Animated.View entering={FadeIn.duration(280)}>
            <Text style={styles.pageTitle}>В роботі</Text>
            <Text style={styles.pageSubtitle}>
              Керуйте етапами роботи з автомобілем
            </Text>
          </Animated.View>

          <Animated.View entering={FadeIn.duration(300).delay(40)}>
            <VehicleInfoCard
              vehicleTitle={activeVehicle.vehicleTitle}
              licensePlate={activeVehicle.licensePlate}
              meta={formatMechanicVehicleMeta(activeVehicle)}
              clientName={activeVehicle.clientName}
              problemSummary={activeVehicle.problemSummary}
            />
          </Animated.View>

          <Animated.View entering={FadeIn.duration(300).delay(80)}>
            <SessionTimeline status={session.sessionStatus} />
          </Animated.View>

          {renderStageContent()}
        </View>
      </ScrollView>
    </View>
  );
}
