import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  EMPTY_DRIVER_FILTERS,
  type DriverFilters,
} from "../../types/filters";

interface DriversFiltersState {
  draftFilters: DriverFilters;
  appliedFilters: DriverFilters;
  page: number;
}

const initialState: DriversFiltersState = {
  draftFilters: EMPTY_DRIVER_FILTERS,
  appliedFilters: EMPTY_DRIVER_FILTERS,
  page: 1,
};

const driversFiltersSlice = createSlice({
  name: "driversFilters",
  initialState,
  reducers: {
    setDraftDriverFilter(
      state,
      action: PayloadAction<{ key: keyof DriverFilters; value: string }>,
    ) {
      state.draftFilters[action.payload.key] = action.payload.value;
    },
    applyDriverFilters(state) {
      state.appliedFilters = { ...state.draftFilters };
      state.page = 1;
    },
    resetDriverFilters(state) {
      state.draftFilters = { ...EMPTY_DRIVER_FILTERS };
      state.appliedFilters = { ...EMPTY_DRIVER_FILTERS };
      state.page = 1;
    },
    setDriverPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
  },
});

export const {
  setDraftDriverFilter,
  applyDriverFilters,
  resetDriverFilters,
  setDriverPage,
} = driversFiltersSlice.actions;

export default driversFiltersSlice.reducer;
