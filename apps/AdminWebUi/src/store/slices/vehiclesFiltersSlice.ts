import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  EMPTY_VEHICLE_FILTERS,
  type VehicleFilters,
} from "../../types/filters";

interface VehiclesFiltersState {
  draftFilters: VehicleFilters;
  appliedFilters: VehicleFilters;
  page: number;
}

const initialState: VehiclesFiltersState = {
  draftFilters: EMPTY_VEHICLE_FILTERS,
  appliedFilters: EMPTY_VEHICLE_FILTERS,
  page: 1,
};

const vehiclesFiltersSlice = createSlice({
  name: "vehiclesFilters",
  initialState,
  reducers: {
    setDraftVehicleFilter(
      state,
      action: PayloadAction<{ key: keyof VehicleFilters; value: string }>,
    ) {
      state.draftFilters[action.payload.key] = action.payload.value;
    },
    applyVehicleFilters(state) {
      state.appliedFilters = { ...state.draftFilters };
      state.page = 1;
    },
    resetVehicleFilters(state) {
      state.draftFilters = { ...EMPTY_VEHICLE_FILTERS };
      state.appliedFilters = { ...EMPTY_VEHICLE_FILTERS };
      state.page = 1;
    },
    setVehiclePage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
});

export const {
  setDraftVehicleFilter,
  applyVehicleFilters,
  resetVehicleFilters,
  setVehiclePage,
} = vehiclesFiltersSlice.actions;

export default vehiclesFiltersSlice.reducer;
