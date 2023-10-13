import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initPermissionsStore = {
   raw: [],
   ids: [],
};

export const permissions = createSlice({
   name: 'permissions',
   initialState: initPermissionsStore,
   reducers: {
      setPermissions: (state, action) => {
         return { ...state, ...action.payload };
      },
      clearPermissions: (state, action) => {
         return { ...initPermissionsStore };
      },
   },
});

// Action creators are generated for each case reducer function
export const { setPermissions, clearPermissions } = permissions.actions;

// Selectors
export const selectPermissions = (state: RootState) => state.permissions;

export default permissions.reducer;
