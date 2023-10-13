import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface TippyState {
   position: 'left' | 'right' | 'top' | 'bottom';
   content: string | null | any;
   contentId?: string;
   isOpen: boolean;
   anchorId: string | null;
}

const tippyDefaultState: TippyState = {
   position: 'bottom',
   isOpen: false,
   content: null,
   anchorId: null,
};

export const tippySlice = createSlice({
   name: 'tippy',
   initialState: { ...tippyDefaultState },
   reducers: {
      setTippyOpen: (state, action) => {
         state = {
            ...state,
            ...action.payload,
         };
         return state;
      },
      setTippyClose: (state, action) => {
         // reset the state
         state = { ...state, isOpen: false };
         return state;
      },
   },
});

// Action creators are generated for each case reducer function
export const { setTippyOpen, setTippyClose } = tippySlice.actions;

// Selectors
export const selectTippy = (state: RootState) => state.tippy;

export default tippySlice.reducer;
