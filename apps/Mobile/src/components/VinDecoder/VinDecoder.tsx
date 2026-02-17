import React, { useState, useEffect } from "react";
import { View, Text, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { globalStyles } from "../../styles/globalStyles";
import { Input } from "../Input";
import { decodeVinExtended, VinDecodeData } from "../../api/services/nhtsaService";

interface VinDecoderProps {
  onDecodeSuccess: (data: {
    brand: string;
    model: string;
    year: string;
    vin: string;
    bodyClass?: string;
    fuelType?: string;
    displacement?: string;
    transmission?: string;
    driveType?: string;
  }) => void;
  containerStyle?: object;
}

export const VinDecoder: React.FC<VinDecoderProps> = ({
  onDecodeSuccess,
  containerStyle,
}) => {
  const theme = useTheme();
  const [vinDecode, setVinDecode] = useState("");
  const [isDecodingVin, setIsDecodingVin] = useState(false);

  useEffect(() => {
    const decodeVin = async () => {
      const trimmedVin = vinDecode.trim().toUpperCase();
      
      if (trimmedVin.length !== 17) {
        return;
      }

      try {
        setIsDecodingVin(true);
        // Використовуємо NHTSA API напряму для отримання розширених даних
        const vinData = await decodeVinExtended(trimmedVin);

        // Автоматично заповнюємо поля через callback
        onDecodeSuccess({
          brand: vinData.Make || "",
          model: vinData.Model || "",
          year: vinData.ModelYear || "",
          vin: trimmedVin,
          bodyClass: vinData.BodyClass,
          fuelType: vinData.FuelTypePrimary,
          displacement: vinData.DisplacementL,
          transmission: vinData.TransmissionStyle,
          driveType: vinData.DriveType,
        });

        Alert.alert("Успішно!", "Дані про автомобіль отримано та заповнено");
      } catch (error) {
        console.error("Error decoding VIN:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Не вдалося розшифрувати VIN номер. Перевірте правильність введення.";
        Alert.alert("Помилка", errorMessage);
      } finally {
        setIsDecodingVin(false);
      }
    };

    // Затримка для того, щоб не робити запит на кожен символ
    const timeoutId = setTimeout(() => {
      if (vinDecode.trim().length === 17) {
        decodeVin();
      }
    }, 500); // 500ms затримка після останнього введення

    return () => clearTimeout(timeoutId);
  }, [vinDecode, onDecodeSuccess]);

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[globalStyles.textPrimary, styles.label]}>
        Розшифрувати VIN номер
      </Text>
      <View style={styles.inputContainer}>
        <Input
          value={vinDecode}
          onChangeText={setVinDecode}
          placeholder="Введіть 17-значний VIN номер"
          autoCapitalize="characters"
          maxLength={17}
          editable={!isDecodingVin}
          inputStyle={styles.input}
        />
        {isDecodingVin && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={theme.colors.accent.primary}
            />
            <Text style={styles.loadingText}>Розшифровка...</Text>
          </View>
        )}
      </View>
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
  inputContainer: {
    position: "relative",
  },
  input: {
    // Додаткові стилі для інпуту якщо потрібно
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  loadingText: {
    color: "#8b949e", // theme.colors.text.secondary
    fontSize: 14,
  },
});



