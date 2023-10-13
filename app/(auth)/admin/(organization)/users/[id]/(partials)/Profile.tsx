'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Panel from '../../../../../../../common/components/panel/Panel';
import { UserData } from '../../types';
import { useAppDispatch, useAppSelector } from '../../../../../../../store/hooks';
import { useRouter } from 'next/navigation';
import { setAddToast } from '../../../../../../../store/slices/toast';
import LoadingBackdrop from '../../../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';
import { selectUser } from '../../../../../../../store/slices/user';

interface Props {
   userToConfig: UserData;
}
const Profile = ({ userToConfig }: Props) => {
   const router = useRouter();
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   const [loading, setLoading] = useState<boolean>(false);

   const fullName = userToConfig?.firstName
      ? userToConfig?.lastName
         ? `${userToConfig?.firstName} ${userToConfig?.lastName}`
         : `${userToConfig?.firstName}`
      : userToConfig?.lastName
      ? `${userToConfig.lastName}`
      : null;

   const handleSendEmailInvitation = async () => {
      if (userToConfig?.id) {
         try {
            // get the token from the cookies
            const token = user?.token;
            const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
            const result = await axios.get(`/api/v2/users/${user?.id}/invite`, {
               headers: headers,
            });

            if (result.status === 200) {
               setTimeout(() => {
                  setLoading(false);
                  dispatch(
                     setAddToast({
                        details: [{ label: 'Success', text: 'Invite Sent!' }],
                        iconName: 'CheckMarkCircle',
                        variant: 'success',
                        autoCloseDelay: 5,
                     })
                  );
               }, 500);
            }
         } catch (err: any) {
            console.log('err:', err);
            setLoading(false);
            const errMsg = err.response?.data?.error?.errorMessage || 'Invite not sent...';
            dispatch(
               setAddToast({
                  iconName: 'XMarkCircle',
                  details: [{ label: 'Error', text: errMsg }],
                  variant: 'danger',
                  autoCloseDelay: 5,
               })
            );
         }
      }
   };

   const handleDeactivateUser = async () => {
      if (userToConfig?.id) {
         try {
            const token = user?.token;
            const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
            const result = await axios.delete(`/api/v2/users/${userToConfig?.id}`, { headers: headers });

            if (result.status === 200) {
               setTimeout(() => {
                  const randomStr = Math.random().toString().slice(2, 7);
                  router.push(`/admin/users?${randomStr}`);
                  setLoading(false);
                  dispatch(
                     setAddToast({
                        details: [{ label: 'Success', text: 'User Deactivated' }],
                        iconName: 'CheckMarkCircle',
                        variant: 'success',
                        autoCloseDelay: 5,
                     })
                  );
               }, 500);
            }
         } catch (err: any) {
            console.log('err:', err);
            setLoading(false);
            const errMsg = err.response?.data?.error?.errorMessage || 'Trouble deactivating this user...';
            dispatch(
               setAddToast({
                  iconName: 'XMarkCircle',
                  details: [{ label: 'Error', text: errMsg }],
                  variant: 'danger',
                  autoCloseDelay: 5,
               })
            );
         }
      }
   };

   const options = [
      {
         text: 'Send Email Invitation',
         iconConfig: { name: 'PaperAirplane', color: 'blue' },
         callback: (e: any, option: any) => {
            setLoading(true);
            handleSendEmailInvitation();
         },
      },
      {
         text: 'Deactivate User',
         iconConfig: { name: 'TrashCan', color: 'red' },
         callback: (e: any, option: any) => {
            setLoading(true);
            handleDeactivateUser();
         },
      },
   ];

   return (
      <>
         <Panel
            title={fullName ? fullName : <span className='text-lum-gray-200'>New User</span>}
            titleSize={'lg'}
            titleImageSource={userToConfig?.profileUrl || '/assets/images/profile.jpg'}
            // @ts-ignore
            options={options}
            optionsIconTooltip={'Admin Actions'}>
            <div className='grid grid-flow-row grid-cols-2 items-center'>
               <div>
                  <div className='text-lum-gray-450 text-[10px] uppercase'>Luminary Phone Number</div>
                  <div className='text-lum-gray-700 dark:text-lum-white text-[16px]'>
                     {userToConfig?.phoneNumber || <span className='text-lum-gray-200'>-</span>}
                  </div>
               </div>
               <div>
                  <div className='text-lum-gray-450 text-[10px] uppercase'>Roles</div>
                  <div className='text-lum-gray-700 dark:text-lum-white text-[16px] truncate'>
                     {userToConfig?.rolesOnUser
                        ?.filter((roleOnUser: any) => !roleOnUser.archived)
                        ?.map((roleOnUser: any) => {
                           const roleName = roleOnUser?.role?.name || '';
                           return roleName || <span className='text-lum-gray-200'>-</span>;
                        })
                        .join(', ')}
                  </div>
               </div>
            </div>
         </Panel>
         <LoadingBackdrop isOpen={loading} />
      </>
   );
};

export default Profile;

// 'use client';
// import React, { useContext, useState } from 'react';
// import { UserData } from '../UserClient';
// import Cookies from 'js-cookie';
// import axios from 'axios';
// import Panel from '../../../../../../../common/components/panel/Panel';
// import { PageContext } from '../../../../../../../providers/PageContextProvider';

// const Profile = ({ userData }: { userData: UserData | null }) => {
//    const { contextData: { userData: userData }, setContextData } = useContext(PageContext);
//    const
//    const fullName = userData?.firstName
//       ? userData?.lastName
//          ? `${userData?.firstName} ${userData?.lastName}`
//          : `${userData?.firstName}`
//       : null;

//    const handleSendEmailInvitation = (e: any) => {
//       if (userData?.id) {
//          // get the token from the cookies
//          const token = Cookies.get('LUM_AUTH');
//          const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
//          axios
//             .get(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/users/invite/${31}`, { headers: headers })
//             .then((res) => {
//                console.log('RES', res);
//             })
//             .catch((err) => {
//                console.log('ERR', err);
//             });
//       }
//    };

//    const options = userData?.id
//       ? [
//            {
//               text: 'Send Email Invitation',
//               iconName: 'PaperAirplane',
//               iconColor: 'blue',
//               callback: (e: any) => console.log('edit user'),
//            },
//            {
//               text: 'Deactivate User',
//               iconName: 'TrashCan',
//               iconColor: 'red',
//               callback: (e: any, option: any) => console.log('delete user'),
//            },
//         ]
//       : [];

//    return (
//       <Panel
//          title={fullName ? fullName : <span className='text-lum-gray-200'>New User</span>}
//          titleSize={'lg'}
//          titleImageSource={'/assets/images/profile.png'}
//          options={options}
//          optionsIconTooltip={'Admin Actions'}>
//          <div className='grid grid-flow-row grid-cols-2 items-center'>
//             <div>
//                <div className='text-lum-gray-450 text-[10px] uppercase'>Luminary Phone Number</div>
//                <div className='text-lum-gray-700 text-[16px]'>
//                   {userData?.phoneNumber || <span className='text-lum-gray-200'>-</span>}
//                </div>
//             </div>
//             <div>
//                <div className='text-lum-gray-450 text-[10px] uppercase'>Role</div>
//                <div className='text-lum-gray-700 text-[16px]'>
//                   {userData?.role?.name || <span className='text-lum-gray-200'>-</span>}
//                </div>
//             </div>
//          </div>
//       </Panel>
//    );
// };

// export default Profile;
