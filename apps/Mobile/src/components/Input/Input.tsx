import React, { useState } from "react";
import { View, Text, TextInput, TextInputProps, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { globalStyles } from "../../styles/globalStyles";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: object;
  inputStyle?: object;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  ...textInputProps
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[globalStyles.textPrimary, styles.label]}>{label}</Text>
      )}
      <TextInput
        {...textInputProps}
        style={[
          globalStyles.input,
          isFocused && globalStyles.inputFocused,
          error && styles.inputError,
          inputStyle,
        ]}
        placeholderTextColor={theme.colors.special.placeholder}
        onFocus={(e) => {
          setIsFocused(true);
          textInputProps.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          textInputProps.onBlur?.(e);
        }}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
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
  inputError: {
    borderColor: "#f85149", // theme.colors.accent.error
  },
  errorText: {
    color: "#f85149", // theme.colors.accent.error
    fontSize: 12,
    marginTop: 4,
  },
});



