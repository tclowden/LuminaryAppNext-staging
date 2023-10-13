import { createSlice, createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// const userInitialState: UserState = {
//   userId: 7884058,
//   permissions: [{ permissionId: null, fieldLevelPermissions: [] }],
//   authed: true,
// }

export const pageContextSlice = createSlice({
   name: 'pageContext',
   initialState: {},
   reducers: {
      setPageContext: (state, action) => {
         // return { ...state, ...action.payload };
         Object.assign(state, action.payload);
      },
      clearPageContext: (state, action) => {
         return {};
      },
   },
});

// Action creators are generated for each case reducer function
export const { setPageContext, clearPageContext } = pageContextSlice.actions;

// Selectors
// return a deep copy to make the page context state mutable...
// export const selectPageContext = createSelector(
//    (state: RootState) => JSON.parse(JSON.stringify(state.pageContext)),
//    (data: any) => data
// );
export const selectPageContext = (state: RootState) => JSON.parse(JSON.stringify(state.pageContext));
// export const memoizedPageContextSelector = createSelector(selectPageContext, (data: any) => {
//    console.log('data:', data);
// });

export default pageContextSlice.reducer;
