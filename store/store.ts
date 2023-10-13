import { configureStore } from '@reduxjs/toolkit';

// import slices here
import ablySlice from './slices/ably';
import userSlice from './slices/user';
import toastSlice from './slices/toast';
import tippySlice from './slices/tippy';
import twilioSlice from './slices/twilio';
import pageContextSlice from './slices/pageContext';
import sidebarSlice from './slices/sidebar';
import permissionsSlice from './slices/permissions';
import webModalSlice from './slices/webModalSlice';
import smsLogsSlice from './slices/smsLogs';

export const store = configureStore({
   reducer: {
      ably: ablySlice,
      toast: toastSlice,
      user: userSlice, // slice to manage the current user
      tippy: tippySlice,
      twilio: twilioSlice,
      pageContext: pageContextSlice, // slice to manage page state, to avoid prop drilling... use it through the <PageProvider />
      sidebar: sidebarSlice, // slice to manage the app, page data, including permissions for each page
      permissions: permissionsSlice,
      webModal: webModalSlice, //slice to open and close website modals (reduce and reuse)
      smsLogs: smsLogsSlice,
   },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
