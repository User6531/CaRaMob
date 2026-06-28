import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import { styles } from "./Select.styles";

const OPTION_COLOR_SWATCHES: Record<string, string> = {
  white: "#FFFFFF",
  black: "#1A1A1A",
  gray: "#808080",
  silver: "#C0C0C0",
  red: "#E53935",
  blue: "#1E88E5",
  green: "#43A047",
  yellow: "#FDD835",
  brown: "#795548",
  beige: "#D7CCC8",
  orange: "#FB8C00",
  purple: "#8E24AA",
};

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  onValueChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  containerStyle?: object;
  error?: string;
  disabled?: boolean;
  /** Show search when option count exceeds this. Default: 6 */
  searchThreshold?: number;
}

function getOptionSwatch(value: string | number): string | undefined {
  return OPTION_COLOR_SWATCHES[String(value).toLowerCase()];
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Виберіть опцію",
  label,
  containerStyle,
  error,
  disabled = false,
  searchThreshold = 6,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedOption = options.find((option) => option.value === value);
  const showSearch = options.length > searchThreshold;
  const modalTitle = label || "Виберіть опцію";
  const listMaxHeight = Dimensions.get("window").height * 0.42;

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return options;
    }
    const query = searchQuery.toLowerCase().trim();
    return options.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  const handleSelect = (optionValue: string | number) => {
    onValueChange(optionValue);
    setIsModalVisible(false);
    setSearchQuery("");
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSearchQuery("");
  };

  const selectedSwatch = selectedOption
    ? getOptionSwatch(selectedOption.value)
    : undefined;

  const renderOption = ({ item }: { item: SelectOption }) => {
    const isSelected = value === item.value;
    const swatch = getOptionSwatch(item.value);

    return (
      <TouchableOpacity
        style={[styles.optionItem, isSelected && styles.optionItemSelected]}
        onPress={() => handleSelect(item.value)}
        activeOpacity={0.8}
      >
        {swatch ? (
          <View style={[styles.swatch, { backgroundColor: swatch }]} />
        ) : null}
        <Text
          style={[styles.optionText, isSelected && styles.optionTextSelected]}
        >
          {item.label}
        </Text>
        {isSelected ? (
          <Feather
            name="check-circle"
            size={18}
            color={theme.colors.accent.primary}
          />
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity
        style={[
          styles.selectButton,
          isModalVisible && styles.selectButtonOpen,
          error && styles.selectError,
          disabled && styles.selectDisabled,
        ]}
        onPress={() => !disabled && setIsModalVisible(true)}
        disabled={disabled}
        activeOpacity={0.85}
      >
        <View style={styles.selectValueRow}>
          {selectedSwatch ? (
            <View
              style={[styles.swatch, { backgroundColor: selectedSwatch }]}
            />
          ) : null}
          <Text
            style={[
              styles.selectText,
              !selectedOption && styles.placeholderText,
            ]}
            numberOfLines={1}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
        </View>
        <Feather
          name={isModalVisible ? "chevron-up" : "chevron-down"}
          size={18}
          color={isModalVisible ? theme.colors.accent.primary : "#8E8E93"}
        />
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalRoot}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleModalClose}
          />

          <View style={styles.sheet}>
            <View style={styles.handle} />

            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderContent}>
                <Text style={styles.sheetTitle}>{modalTitle}</Text>
                <Text style={styles.sheetSubtitle}>
                  {filteredOptions.length}{" "}
                  {filteredOptions.length === 1 ? "варіант" : "варіантів"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleModalClose}
                style={styles.closeButton}
                activeOpacity={0.8}
              >
                <Feather name="x" size={18} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            {showSearch ? (
              <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                  <Feather name="search" size={16} color="#8E8E93" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Пошук..."
                    placeholderTextColor="#8E8E93"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus={Platform.OS === "ios"}
                  />
                  {searchQuery.length > 0 ? (
                    <TouchableOpacity
                      onPress={() => setSearchQuery("")}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Feather name="x-circle" size={16} color="#8E8E93" />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            ) : null}

            {filteredOptions.length > 0 ? (
              <FlatList
                data={filteredOptions}
                keyExtractor={(item) => String(item.value)}
                style={[styles.optionsList, { maxHeight: listMaxHeight }]}
                contentContainerStyle={styles.optionsListContent}
                renderItem={renderOption}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.noResultsContainer}>
                <Feather name="search" size={28} color="#8E8E93" />
                <Text style={styles.noResultsTitle}>Нічого не знайдено</Text>
                <Text style={styles.noResultsText}>
                  Спробуйте інший пошуковий запит
                </Text>
              </View>
            )}

            <View
              style={[
                styles.sheetFooter,
                { paddingBottom: Math.max(insets.bottom, 16) },
              ]}
            >
              <TouchableOpacity
                style={styles.doneButton}
                onPress={handleModalClose}
                activeOpacity={0.85}
              >
                <Text style={styles.doneButtonText}>Готово</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
