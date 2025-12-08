import { createSlice } from "@reduxjs/toolkit";

interface State {
  value: number;
}

const initialState: State = { value: 0 };

const baseSlice = createSlice({
  name: "baseSlice",
  initialState,
  reducers: {},
});

export const {} = baseSlice.actions;
export default baseSlice.reducer;
