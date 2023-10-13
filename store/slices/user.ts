import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { RootState } from '../store';
import { useRouter } from 'next/navigation';
import { setAddToast } from './toast';

// export interface Permission {
//    permissionId: number | null;
//    fieldLevelPermissions?: Array<number>;
// }

export interface UserState {
   id: string | null;
   authed: boolean;
   firstName: string | null;
   lastName: string | null;
   fullName: string | null;
   emailAddress: string | null;
   profileUrl: string | null;
   roles: { id: string | null; name: string | null; permissions: Array<any> }[];
   rolesOnUser: Array<any>;
   roleIds: Array<string>;
   office: { id: number | null; name: string | null };
   teamLead: boolean;
   divisionLead: boolean;
   permissions: Array<any>;
   permissionIds: Array<string>;
   token: string | null;
   phoneNumbers: Array<{
      phoneNumber: { id: string | null; number: string | null; prettyNumber: string | null };
   }>;
   prefersDarkMode: boolean;
   appointments: Array<any>;
   notificationCount: number;
}

const userInitialState: UserState = {
   id: null,
   authed: false,
   firstName: null,
   lastName: null,
   fullName: null,
   emailAddress: null,
   profileUrl: null,
   roles: [],
   roleIds: [],
   rolesOnUser: [],
   office: { id: null, name: null },
   teamLead: false,
   divisionLead: false,
   permissions: [],
   permissionIds: [],
   token: null,
   phoneNumbers: [],
   prefersDarkMode: false,
   appointments: [],
   notificationCount: 0,
};

export const userSlice = createSlice({
   name: 'user',
   initialState: { ...userInitialState },
   reducers: {
      incrementUserNotificationCount: (state) => {
         Object.assign(state, { notificationCount: state.notificationCount + 1 });
      },
      decrementUserNotificationCount: (state) => {
         Object.assign(state, { notificationCount: state.notificationCount - 1 });
      },
      updateUser: (state, action) => {
         Object.assign(state, action.payload);
         // return { ...state, ...action.payload };
      },
      setLoginUser: (state, action) => {
         let allPermissionsOnRole = action.payload?.rolesOnUser
            ?.map((roleOnUser: any) => roleOnUser?.role?.permissionsOnRole)
            .flat();
         allPermissionsOnRole = allPermissionsOnRole.filter(
            (permOnRole: any, index: number, originalArr: Array<any>) => {
               return index === originalArr.findIndex((permObj) => permObj?.id === permOnRole?.id);
            }
         );
         let allUsersPermissions = allPermissionsOnRole.map((permOnRole: any) => permOnRole?.permission);
         return {
            ...state,
            ...action.payload,
            phoneNumbers: action?.payload?.phoneNumbersOnUser,
            authed: true,
            permissions: allUsersPermissions,
            permissionIds: allUsersPermissions.map((permission: any) => permission?.id),
            roleIds: action.payload?.rolesOnUser.map((roleOnUser: any) => roleOnUser?.role?.id),
         };
      },
      setLogoutUser: (state, action) => {
         // reset the state
         return { ...userInitialState };
      },
   },
});

// Action creators are generated for each case reducer function
export const {
   setLoginUser,
   setLogoutUser,
   updateUser,
   incrementUserNotificationCount,
   decrementUserNotificationCount,
} = userSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.user;
export const selectUserHasPermission = (userState: UserState, permissionId: string) =>
   userState.permissionIds?.includes(permissionId);

export default userSlice.reducer;
