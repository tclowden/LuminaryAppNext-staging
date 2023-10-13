import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface Toast {
   uniqueId?: string;
   title?: string;
   iconName?: string;
   details: Array<{
      label: string;
      text: string;
   }>;
   autoCloseDelay?: number; // Delay in seconds
   disableCloseButton?: boolean;
   onToastClick?: {
      actionType: string; // Example: To call the 'answerCall' reducer in the twilio Slice you would use 'twilio/answerCall'. Make sure to use the slice name defined in the createSlice function
      actionPayload?: any;
   };
   onCloseToast?: {
      // Defaults to simply closing the toast, with no callback
      actionType: string;
      actionPayload?: any;
   };
   destinationRoute?: string;
   position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
   variant?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
   animate?: boolean;
   audio?: string;
   loopAudio?: boolean;
}

export interface ToastWithId extends Toast {
   id: string;
}

export interface ToastState {
   toasts: ToastWithId[];
}

const toastInitialState: ToastState = {
   toasts: [],
};

export const toastSlice = createSlice({
   name: 'toast',
   initialState: { ...toastInitialState },
   reducers: {
      setHelloMessage: (state, action) => {
         console.log('Hello', action.payload.name);
         return state;
      },
      setAddToast: (state, action: PayloadAction<Toast>) => {
         const newToast = {
            id: Math.floor(Math.random() * 10000).toString(),
            ...action.payload,
         };
         state = {
            toasts: [...state.toasts, newToast],
         };

         return state;
      },
      setRemoveToast: (state, action) => {
         const filteredToasts = state.toasts.filter((toast) => toast.id !== action.payload.id);
         state = {
            toasts: [...filteredToasts],
         };
         return state;
      },
      setRemoveToastByUniqueId: (state, action) => {
         const filteredToasts = state.toasts.filter((toast) => toast.uniqueId !== action.payload.uniqueId);
         state = {
            toasts: [...filteredToasts],
         };
         return state;
      },
   },
});

export const { setAddToast, setRemoveToast, setRemoveToastByUniqueId } = toastSlice.actions;

export const selectToasts = (state: RootState) => state.toast.toasts;

export default toastSlice.reducer;
