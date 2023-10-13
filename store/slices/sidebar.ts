import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initSidebarStore = {
   pages: [],
   raw: [],
};

export const sidebarSlice = createSlice({
   name: 'sidebar',
   initialState: initSidebarStore,
   reducers: {
      setSidebar: (state, action) => {
         return { ...state, ...action.payload };
      },
      clearSidebar: (state, action) => {
         return { ...initSidebarStore };
      },
   },
});

// Action creators are generated for each case reducer function
export const { setSidebar, clearSidebar } = sidebarSlice.actions;

// Selectors
// return a deep copy to make the page context state mutable...
export const selectSidebar = (state: RootState) => state.sidebar;
export const selectCurrentPage = (state: RootState, pathname: string) => {
   return state.sidebar.raw.find((page: any) => page.route === pathname);
};

export default sidebarSlice.reducer;
