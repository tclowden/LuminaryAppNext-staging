import { fetchDbApi } from '@/serverActions';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { setAddToast } from './toast';

export interface SmsLogsState {
   smsLogsByLeadId: {
      [leadId: string]: Array<any>;
   };
   acknowledgedByUsersByLeadId: {
      [leadId: string]: Array<string>;
   };
}

const smsLogsDefaultState: SmsLogsState = {
   smsLogsByLeadId: {},
   acknowledgedByUsersByLeadId: {},
};

export const getLeadSmsLogs = createAsyncThunk('getLeadSmsLogs', async (leadId: string, { dispatch }) => {
   try {
      const smsLogsResult = await fetchDbApi(`/api/v2/leads/${leadId}/sms-logs`, { method: 'GET' });

      if (!smsLogsResult?.length) return;
      setAcknowledgedByIds({
         leadId,
         acknowledgedByIds: smsLogsResult[0]?.lead?.smsAcknowledgedBy?.acknowledgedByUserIds,
      });
      dispatch(setLeadSmsLogs({ leadId, smsLogs: smsLogsResult }));
   } catch (err) {
      console.log('slice/smsLogs -> getSmsLogs -> Error:', err);
      dispatch(
         setAddToast({
            iconName: 'XMarkCircle',
            details: [{ label: 'Error', text: 'Failed to get Lead sms' }],
            variant: 'danger',
            autoCloseDelay: 5,
         })
      );
   }
});

export const acknowledgeLeadSmsLogs = createAsyncThunk(
   'acknowledgeLeadSmsLogs',
   async ({ leadId, userId }: { leadId: string; userId: string }, { dispatch }) => {
      try {
         await fetchDbApi(`/api/v2/leads/${leadId}/sms-logs/acknowledge`, { method: 'PUT' });

         dispatch(setAcknowledgedByUserId({ leadId, userId }));
      } catch (err) {
         console.log('slice/smsLogs -> acknowledgeLeadSmsLogs -> Error:', err);
         dispatch(
            setAddToast({
               iconName: 'XMarkCircle',
               details: [{ label: 'Error', text: 'Failed to acknowledge SMS' }],
               variant: 'danger',
               autoCloseDelay: 5,
            })
         );
      }
   }
);

export const smsLogsSlice = createSlice({
   name: 'smsLogs',
   initialState: { ...smsLogsDefaultState },
   reducers: {
      setLeadSmsLogs: (state, action: PayloadAction<{ leadId: string; smsLogs: Array<any> }>) => {
         const leadId = action.payload?.leadId;
         if (!leadId) return state;
         state.smsLogsByLeadId = {
            ...state.smsLogsByLeadId,
            [leadId]: [...action.payload?.smsLogs],
         };
         return state;
      },
      setNewLeadSmsLog: (state, action: PayloadAction<{ leadId: string; smsLog: Array<any> }>) => {
         const leadId = action.payload?.leadId;
         if (!leadId) return state;
         state.smsLogsByLeadId = {
            ...state.smsLogsByLeadId,
            [leadId]: [...state.smsLogsByLeadId[leadId], action.payload?.smsLog],
         };
         state.acknowledgedByUsersByLeadId = {
            ...state.acknowledgedByUsersByLeadId,
            [leadId]: [],
         };
         return state;
      },
      setAcknowledgedByIds: (state, action: PayloadAction<{ leadId: string; acknowledgedByIds: Array<string> }>) => {
         const leadId = action.payload?.leadId;
         if (!leadId) return state;
         state.acknowledgedByUsersByLeadId = {
            ...state.acknowledgedByUsersByLeadId,
            [leadId]: action.payload?.acknowledgedByIds?.length ? action.payload?.acknowledgedByIds : [],
         };
         return state;
      },
      setAcknowledgedByUserId: (state, action: PayloadAction<{ leadId: string; userId: string }>) => {
         const leadId = action.payload?.leadId;
         const userId = action.payload?.userId;
         if (!leadId) return state;
         state.acknowledgedByUsersByLeadId = {
            ...state.acknowledgedByUsersByLeadId,
            [leadId]: [
               ...(!!state.acknowledgedByUsersByLeadId[leadId] ? state.acknowledgedByUsersByLeadId[leadId] : []),
               userId,
            ],
         };
         return state;
      },
   },
});

// Action creators are generated for each case reducer function
export const { setLeadSmsLogs, setNewLeadSmsLog, setAcknowledgedByIds, setAcknowledgedByUserId } = smsLogsSlice.actions;

// Selectors
export const selectLeadSmsLogs = (state: RootState) => state.smsLogs.smsLogsByLeadId;
export const selectAcknowledgedSmsLogs = (state: RootState) => state.smsLogs.acknowledgedByUsersByLeadId;

export default smsLogsSlice.reducer;
