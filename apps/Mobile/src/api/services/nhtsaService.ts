/**
 * NHTSA VPIC API Service
 * Documentation: https://vpic.nhtsa.dot.gov/api/
 */

const NHTSA_BASE_URL = "https://vpic.nhtsa.dot.gov/api";

export interface NhtsaMake {
  MakeId: number;
  MakeName: string;
  VehicleTypeId?: number;
  VehicleTypeName?: string;
}

export interface NhtsaModel {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
}

export interface NhtsaResponse<T> {
  Count: number;
  Message: string;
  SearchCriteria: string;
  Results: T[];
}

/**
 * Отримати всі марки автомобілів (легкові)
 */
export async function getAllMakes(): Promise<NhtsaMake[]> {
  try {
    const response = await fetch(
      `${NHTSA_BASE_URL}/vehicles/GetMakesForVehicleType/car?format=json`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NhtsaResponse<NhtsaMake> = await response.json();

    if (data.Results && data.Results.length > 0) {
      // Фільтруємо валідні записи (з MakeName та MakeId)
      const validMakes = data.Results.filter(
        (make) =>
          make &&
          make.MakeName &&
          typeof make.MakeName === "string" &&
          make.MakeId &&
          typeof make.MakeId === "number"
      );

      // Сортуємо за назвою
      return validMakes.sort((a, b) => {
        const nameA = a.MakeName || "";
        const nameB = b.MakeName || "";
        return nameA.localeCompare(nameB);
      });
    }

    return [];
  } catch (error) {
    console.error("Error fetching makes:", error);
    throw error;
  }
}

/**
 * Отримати моделі для конкретної марки
 */
export async function getModelsForMakeId(
  makeId: number
): Promise<NhtsaModel[]> {
  try {
    const response = await fetch(
      `${NHTSA_BASE_URL}/vehicles/GetModelsForMakeId/${makeId}?format=json`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NhtsaResponse<NhtsaModel> = await response.json();

    if (data.Results && data.Results.length > 0) {
      // Фільтруємо валідні записи
      const validModels = data.Results.filter(
        (model) =>
          model &&
          model.Model_Name &&
          typeof model.Model_Name === "string" &&
          model.Model_ID &&
          typeof model.Model_ID === "number"
      );

      // Сортуємо за назвою моделі
      return validModels.sort((a, b) => {
        const nameA = a.Model_Name || "";
        const nameB = b.Model_Name || "";
        return nameA.localeCompare(nameB);
      });
    }

    return [];
  } catch (error) {
    console.error("Error fetching models:", error);
    throw error;
  }
}

/**
 * Отримати моделі для марки та року
 */
export async function getModelsForMakeIdYear(
  makeId: number,
  year: number
): Promise<NhtsaModel[]> {
  try {
    const response = await fetch(
      `${NHTSA_BASE_URL}/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NhtsaResponse<NhtsaModel> = await response.json();

    if (data.Results && data.Results.length > 0) {
      // Фільтруємо валідні записи
      const validModels = data.Results.filter(
        (model) =>
          model &&
          model.Model_Name &&
          typeof model.Model_Name === "string" &&
          model.Model_ID &&
          typeof model.Model_ID === "number"
      );

      // Сортуємо за назвою моделі
      return validModels.sort((a, b) => {
        const nameA = a.Model_Name || "";
        const nameB = b.Model_Name || "";
        return nameA.localeCompare(nameB);
      });
    }

    return [];
  } catch (error) {
    console.error("Error fetching models for year:", error);
    throw error;
  }
}

/**
 * Генерує список років (від поточного року до 1995)
 */
export function generateYearOptions(): { label: string; value: string }[] {
  const currentYear = new Date().getFullYear();
  const years: { label: string; value: string }[] = [];

  for (let year = currentYear; year >= 1995; year--) {
    years.push({ label: year.toString(), value: year.toString() });
  }

  return years;
}

/**
 * Інтерфейс для розширених даних VIN декодування
 */
export interface VinDecodeData {
  Make?: string;
  Model?: string;
  ModelYear?: string;
  BodyClass?: string; // Тип кузова
  FuelTypePrimary?: string; // Тип палива
  DisplacementL?: string; // Об'єм двигуна
  TransmissionStyle?: string; // Коробка передач
  DriveType?: string; // Привід
}

/**
 * Декодування VIN з отриманням розширених даних
 * Використовує DecodeVinValuesExtended для отримання всіх доступних даних
 */
export async function decodeVinExtended(
  vin: string,
  modelYear?: number
): Promise<VinDecodeData> {
  try {
    const yearParam = modelYear ? `&modelyear=${modelYear}` : "";
    const response = await fetch(
      `${NHTSA_BASE_URL}/vehicles/DecodeVinValuesExtended/${vin}?format=json${yearParam}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.Results && data.Results.length > 0) {
      const result = data.Results[0];

      return {
        Make: result.Make || undefined,
        Model: result.Model || undefined,
        ModelYear: result.ModelYear || undefined,
        BodyClass: result.BodyClass || undefined,
        FuelTypePrimary: result.FuelTypePrimary || undefined,
        DisplacementL: result.DisplacementL || undefined,
        TransmissionStyle: result.TransmissionStyle || undefined,
        DriveType: result.DriveType || undefined,
      };
    }

    return {};
  } catch (error) {
    console.error("Error decoding VIN extended:", error);
    throw error;
  }
}

/**
 * Отримати список значень для змінної (для селектів)
 */
export async function getVariableValues(
  variableName: string
): Promise<string[]> {
  try {
    const response = await fetch(
      `${NHTSA_BASE_URL}/vehicles/GetVehicleVariableValuesList/${encodeURIComponent(variableName)}?format=json`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.Results && data.Results.length > 0) {
      return data.Results.map((item: { Value?: string; Name?: string }) => item.Value || item.Name).filter(Boolean);
    }

    return [];
  } catch (error) {
    console.error(`Error fetching variable values for ${variableName}:`, error);
    return [];
  }
}

