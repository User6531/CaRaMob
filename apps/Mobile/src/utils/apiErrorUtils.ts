const API_ERROR_MESSAGES_UK: Record<string, string> = {
  "Vin is required.": "Введіть VIN номер.",
  "Vin must be 17 characters long.": "VIN має містити рівно 17 символів.",
  "Vin must not exceed 17 characters.": "VIN має містити рівно 17 символів.",
  "Vin must be a valid 17-character VIN.":
    "VIN має містити 17 символів: латинські літери (без I, O, Q) та цифри.",
  "License plate is required.": "Введіть номерний знак.",
  "License plate must not exceed 10 characters.":
    "Номерний знак не може перевищувати 10 символів.",
};

function translateApiMessage(message: string): string {
  return API_ERROR_MESSAGES_UK[message] ?? message;
}

export function parseApiErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Не вдалося зберегти дані";
  }

  try {
    const parsed = JSON.parse(error.message) as {
      title?: string;
      errors?: Record<string, string[]>;
    };

    if (parsed.errors) {
      const messages = Object.values(parsed.errors)
        .flat()
        .map(translateApiMessage);

      if (messages.length > 0) {
        return messages.join("\n");
      }
    }

    if (parsed.title) {
      return translateApiMessage(parsed.title);
    }
  } catch {
    // Response is not JSON — use raw message below.
  }

  if (error.message.includes("401")) {
    return "Сесія закінчилася. Будь ласка, увійдіть знову.";
  }

  return translateApiMessage(error.message);
}
