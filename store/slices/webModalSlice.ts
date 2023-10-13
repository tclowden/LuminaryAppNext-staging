import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { WebModalType } from '@/common/components/webModals/modals';

// Define a type for the slice state
interface WebModalState {
   isOpen: boolean;
   modalType: WebModalType;
}

// Define the initial state using that type
const initialState: WebModalState = {
   isOpen: false,
   modalType: null,
};

export const webModalSlice = createSlice({
   name: 'modal',
   initialState,
   reducers: {
      openModal: (state, action: PayloadAction<any>) => {
         state.isOpen = true;
         state.modalType = action.payload;
      },
      closeModal: (state) => {
         state.isOpen = false;
         state.modalType = null;
      },
   },
});

export const { openModal, closeModal } = webModalSlice.actions;
export default webModalSlice.reducer;
