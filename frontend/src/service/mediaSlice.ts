import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface MediaState {
  loading: boolean;
  error: string | null;
  lastConvertedUrl: string | null;
}

const initialState: MediaState = {
  loading: false,
  error: null,
  lastConvertedUrl: null,
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setConvertedUrl: (state, action: PayloadAction<string | null>) => {
      state.lastConvertedUrl = action.payload;
    },
  },
});

export const { setLoading, setError, setConvertedUrl } = mediaSlice.actions;
export default mediaSlice.reducer;
