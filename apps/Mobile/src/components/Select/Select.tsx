import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { globalStyles } from "../../styles/globalStyles";

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
}) => {
  const theme = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedOption = options.find((option) => option.value === value);

  // Фільтруємо опції на основі пошукового запиту
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
    setSearchQuery(""); // Очищаємо пошук після вибору
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSearchQuery(""); // Очищаємо пошук при закритті
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[globalStyles.textPrimary, styles.label]}>{label}</Text>
      )}
      <TouchableOpacity
        style={[
          globalStyles.input,
          error && styles.selectError,
          styles.selectButton,
          disabled && styles.selectDisabled,
        ]}
        onPress={() => !disabled && setIsModalVisible(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.selectText,
            !selectedOption && styles.placeholderText,
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={handleModalClose}
          />
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            {/* Заголовок */}
            <View style={styles.modalHeader}>
              <Text style={[globalStyles.textPrimary, styles.modalTitle]}>
                {label || "Виберіть опцію"}
              </Text>
              <TouchableOpacity
                onPress={handleModalClose}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            {/* Пошукове поле */}
            <View style={styles.searchContainer}>
              <TextInput
                style={[globalStyles.input, styles.searchInput]}
                placeholder="Пошук..."
                placeholderTextColor={theme.colors.special.placeholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus={true}
              />
            </View>
            {/* Список опцій */}
            <View style={styles.optionsContainer}>
              {filteredOptions.length > 0 ? (
                <FlatList
                  data={filteredOptions}
                  keyExtractor={(item) => String(item.value)}
                  style={styles.optionsList}
                  contentContainerStyle={styles.optionsListContent}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.optionItem,
                        value === item.value && styles.optionItemSelected,
                      ]}
                      onPress={() => handleSelect(item.value)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          globalStyles.textPrimary,
                          styles.optionText,
                          value === item.value && styles.optionTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                      {value === item.value && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  )}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={true}
                />
              ) : (
                <View style={styles.noResultsContainer}>
                  <Text style={styles.noResultsText}>
                    Нічого не знайдено
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: {
    flex: 1,
    color: "#f0f6fc", // theme.colors.text.primary
  },
  placeholderText: {
    color: "#6e7681", // theme.colors.special.placeholder
  },
  arrow: {
    color: "#8b949e", // theme.colors.text.secondary
    fontSize: 12,
  },
  selectError: {
    borderColor: "#f85149", // theme.colors.accent.error
  },
  selectDisabled: {
    opacity: 0.5,
  },
  errorText: {
    color: "#f85149", // theme.colors.accent.error
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#161b22", // theme.colors.background.secondary
    borderRadius: 16,
    width: "90%",
    maxWidth: 500,
    height: "80%",
    maxHeight: 600,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#30363d", // theme.colors.border.primary
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  closeButton: {
    padding: 8,
    marginLeft: 12,
    borderRadius: 8,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#8b949e", // theme.colors.text.secondary
    fontSize: 20,
    lineHeight: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#30363d", // theme.colors.border.primary
  },
  searchInput: {
    marginBottom: 0,
  },
  optionsContainer: {
    flex: 1,
    minHeight: 200,
  },
  optionsList: {
    flex: 1,
  },
  optionsListContent: {
    paddingVertical: 4,
  },
  noResultsContainer: {
    padding: 40,
    alignItems: "center",
  },
  noResultsText: {
    color: "#8b949e", // theme.colors.text.secondary
    fontSize: 16,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#21262d", // theme.colors.border.secondary
  },
  optionText: {
    flex: 1,
  },
  optionItemSelected: {
    backgroundColor: "#21262d", // theme.colors.background.tertiary
  },
  optionTextSelected: {
    color: "#58a6ff", // theme.colors.accent.primary
    fontWeight: "600",
  },
  checkmark: {
    color: "#58a6ff", // theme.colors.accent.primary
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
});



