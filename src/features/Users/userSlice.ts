import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserState, TUser } from '../../types/types';

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserStart(state) {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess(state, action: PayloadAction<TUser>) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { updateUserStart, updateUserSuccess, updateUserFailure } = userSlice.actions;
export default userSlice.reducer;