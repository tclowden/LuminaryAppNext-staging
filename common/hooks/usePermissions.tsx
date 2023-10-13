'use client';
import React from 'react';
import { useSelector } from 'react-redux';
// import { selectUserFieldLevelPermissions } from '../../store/slices/user';

// this custom hook takes an array of permission ids...
// the reason for this is to simply validate someone against global state
// example... only show an input if the user permission is [1,2,3,6,7]
// returns a boolean

// FIELD LEVEL PERMISSIONS

const usePermissions = (fieldLevelPermissions: Array<number> = [], permissionId: number) => {
   // // retruns an array of user permissions wihtin global state
   // const userFieldLevelPermissions = useSelector((state: any) => selectUserFieldLevelPermissions(state, permissionId));

   // if (!userFieldLevelPermissions.length) return false;
   // if (!fieldLevelPermissions.length) return false;
   // // check to see if user has permissions
   // const userHasPermissions = fieldLevelPermissions.filter((flp) => userFieldLevelPermissions.indexOf(flp) !== -1);
   // if (!userHasPermissions.length) return false;
   return true;
};

export default usePermissions;
