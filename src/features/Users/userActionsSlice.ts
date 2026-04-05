import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UserActionsState {
  selectedUserId: number | null;
  isEditMode: boolean;
  filters: {
    role: string;
    search: string;
  };
}

const initialState: UserActionsState = {
  selectedUserId: null,
  isEditMode: false,
  filters: {
    role: '',
    search: '',
  },
};

const userActionsSlice = createSlice({
  name: 'userActions',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<number | null>) => {
      state.selectedUserId = action.payload;
    },
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditMode = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<UserActionsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { role: '', search: '' };
    },
  },
});

export const { setSelectedUser, setEditMode, setFilters, clearFilters } = userActionsSlice.actions;
export default userActionsSlice.reducer;