'use client';

import React, { useState } from 'react';
import * as Yup from 'yup';
import Tabs from '../../../../../../common/components/tabs/Tabs';
import Profile from './(partials)/Profile';
import GeneralInfo from './(partials)/GeneralInfo';
import Button from '../../../../../../common/components/button/Button';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import LeadsInPipe from './(partials)/LeadsInPipe';
import Customers from './(partials)/Customers';
import PitchReport from './(partials)/PitchReport';
import Scorecard from './(partials)/Scorecard';
import PageContainer from '../../../../../../common/components/page-container/PageContainer';
import Grid from '../../../../../../common/components/grid/Grid';
import { UserData, UserProps } from '../types';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { selectPageContext } from '../../../../../../store/slices/pageContext';
import useForm, { YupSchemaObject } from '../../../../../../common/hooks/useForm';
import { setAddToast } from '../../../../../../store/slices/toast';
import LoadingBackdrop from '../../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';
import { selectUser, updateUser } from '../../../../../../store/slices/user';
import NewScoreCard from './(partials)/NewScorcard';

const userGeneralInfoValidationSchema: YupSchemaObject<any> = {
   firstName: Yup.string().required('First name is required.'),
   lastName: Yup.string().required('Last name is required.'),
   emailAddress: Yup.string().email('Must be valid email address.').required('Email address is required.'),
   rolesOnUser: Yup.array().of(Yup.object()).required('User must have at least one role.'),
   legalFirstName: Yup.string(),
   office: Yup.object().required('User must belong to an office.'),
   teamLead: Yup.object(),
   divisionLead: Yup.object(),
   salesDirector: Yup.object(),
   profileUrl: Yup.string().url('Must be a valid url.').nullable(),
};

const tabs = [
   { name: 'Settings', iconName: 'Gear' },
   { name: 'Leads in Pipe', iconName: 'Target' },
   { name: 'Customers', iconName: 'Users' },
   { name: 'Score Card', iconName: 'LeadSources' },
   { name: 'Pitch Report', iconName: 'Proposal' },
   { name: 'Status Report', iconName: 'PieGraph' },
];

const UserClient = () => {
   const router = useRouter();
   const [activeNavIndex, setActiveNavIndex] = useState<number>(0);
   const [isSaving, setIsSaving] = useState<boolean>(false);
   const dispatch = useAppDispatch();
   const contextData: UserProps = useAppSelector(selectPageContext);
   const user = useAppSelector(selectUser);

   const userData: UserData | undefined = contextData.userData;
   const handleSaveUser = async (e: any, userToSave: any) => {
      // validate user state here

      try {
         // get the token from the cookies && set the headers object
         const token = user?.token;
         const headers = { Authorization: `Bearer ${token}` };
         const dataToSend = { ...userToSave, sendEmailInvite: false };
         let result: any = null;

         // delete unneccesary code
         delete dataToSend['createdAtPretty'];
         delete dataToSend['updatedAtPretty'];
         console.log('dataToSend:', dataToSend);

         // if valid && there is an id, this means that we just want to update the user
         if (dataToSend?.id) {
            // update user
            const url = `/api/v2/users/${dataToSend.id}`;
            result = await axios.put(url, dataToSend, { headers: headers });
         } else {
            // create user
            dataToSend['sendEmailInvite'] = true;
            const url = `/api/v2/users`;
            result = await axios.post(url, dataToSend, { headers: headers });
         }

         if (result.status === 200) {
            // see if the user editted is the same as the current user... if so, edit the global state
            if (user?.id === result?.data?.id) {
               dispatch(
                  updateUser({
                     ...result.data,
                  })
               );
            }

            const randomStr = Math.random().toString().slice(2, 7);
            router.push(`/admin/users?${randomStr}`);
            setTimeout(() => {
               setIsSaving(false);
               dispatch(
                  setAddToast({
                     details: [{ label: 'Success', text: 'User Successfully Saved' }],
                     iconName: 'CheckMarkCircle',
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
            }, 500);
         }
      } catch (err: any) {
         console.log('err saving user', err);
         setIsSaving(false);
         const errMsg = err.response?.data?.error?.errorMessage || 'Changes Not Saved';
         dispatch(
            setAddToast({
               iconName: 'XMarkCircle',
               details: [{ label: 'Error', text: errMsg }],
               variant: 'danger',
               autoCloseDelay: 5,
            })
         );
      }
   };

   const handleUploadImg = async (e: any) => {
      try {
         const token = user?.token;
         const formData = new FormData();
         formData.append('file', e.target.files[0]);
         const fileNickName = `${e.target.files[0]?.name.split('.')[0]}-${Date.now()}.${
            e.target.files[0]?.name.split('.')[1]
         }`;
         formData.append('fileNickName', fileNickName);
         formData.append('filePath', `users/${user?.id}/${fileNickName}`);
         formData.append('userId', user?.id as any);
         // const url = `${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/users/upload`;

         console.log('formData.values():', formData.values());
         for (const val of Array.from(formData.values())) {
            console.log('val:', val);
         }
         const url = `/api/v2/users/${user?.id}/upload`;
         const userImageUrl = await fetch(url, {
            method: 'POST',
            headers: {
               Authorization: `Bearer ${token}`,
            },
            body: formData,
         }).then((res) => res.json());

         setValue('profileUrl', userImageUrl);
         // router.push(result);
      } catch (err) {
         console.log('err:', err);
      }
   };

   const { values, errors, handleChange, handleBlur, handleSubmit, setValue } = useForm({
      initialValues: contextData?.userData,
      validationSchema: userGeneralInfoValidationSchema,
      onSubmit: handleSaveUser,
   });

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Button color='blue' onClick={handleSubmit}>
                     Save
                  </Button>
                  <Button
                     color='white'
                     onClick={() => {
                        router.back();
                     }}>
                     Cancel
                  </Button>
               </>
            }>
            <Grid>
               {/* Profile Details */}
               <Profile userToConfig={values} />
               {/* End Profile Details */}

               {/* User Navigation */}
               <Tabs tabs={tabs} activeTabIndex={activeNavIndex} setActiveTabIndex={setActiveNavIndex} />
               {/* End User Navigation */}

               {tabs[activeNavIndex].name === 'Settings' && (
                  <GeneralInfo
                     handleUploadImg={handleUploadImg}
                     useFormProps={{ values, errors, handleChange, handleBlur, setValue }}
                  />
               )}
               {tabs[activeNavIndex].name === 'Score Card' && <NewScoreCard userData={userData} />}
               {/* {tabs[activeNavIndex].name === 'Leads in Pipe' && <LeadsInPipe />}
            {tabs[activeNavIndex].name === 'Customers' && <Customers />}
            {tabs[activeNavIndex].name === 'Score Card' && <Scorecard />}
            {tabs[activeNavIndex].name === 'Pitch Report' && <PitchReport />}
            {tabs[activeNavIndex].name === 'Status Report' && <h1>Status Report</h1>} */}
            </Grid>
         </PageContainer>
         <LoadingBackdrop isOpen={isSaving} />
      </>
   );
};

export default UserClient;

// 'use client';

// import React, { useEffect, useState } from 'react';
// import Tabs from '../../../../../../common/components/tabs/Tabs';
// import Profile from './(partials)/Profile';
// import Settings from './(partials)/Settings';
// import { defaultCustomPermissions, defaultPagePermissions } from './(partials)/dummyData';
// import Button from '../../../../../../common/components/button/Button';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import LeadsInPipe from './(partials)/LeadsInPipe';
// import Customers from './(partials)/Customers';
// import PitchReport from './(partials)/PitchReport';
// import Scorecard from './(partials)/Scorecard';
// import PageContainer from '../../../../../../common/components/page-container/PageContainer';
// import Grid from '../../../../../../common/components/grid/Grid';
// import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
// import { clearPageContext, setPageContext } from '../../../../../../store/slices/pageContext';

// interface IdNameObj {
//    id: number;
//    name: string;
// }

// interface LeadershipObj {
//    id: number;
//    firstName?: string;
//    lastName?: string;
//    emailAddress?: string;
// }

// export interface UserData {
//    id?: number;
//    firstName?: string;
//    lastName?: string;
//    emailAddress?: string;
//    legalFirstName?: string;
//    archived?: boolean;
//    createdAt?: Date | string;
//    phoneNumber?: string | number | null;
//    profileUrl?: string | null;
//    role?: IdNameObj;
//    office?: IdNameObj;r
//    teamLead?: LeadershipObj;
//    divisionLead?: LeadershipObj;
//    salesDirector?: LeadershipObj;
// }

// export interface UserProps {
//    userData?: UserData;
//    officesData?: IdNameObj[];
//    rolesData?: IdNameObj[];
//    teamLeads?: LeadershipObj[];
//    divisionLeads?: LeadershipObj[];
//    salesDirectors?: LeadershipObj[];
//    permissionSetsData?: IdNameObj[];
//    permissionsData?: IdNameObj[];
//    pagesData?: IdNameObj[];
//    pagePermissions?: { name: string; description?: string; expandableData?: Array<any> }[];
//    customPermissions?: { name: string; description?: string; expandableData?: Array<any> }[];
// }

// const tabs = [
//    { name: 'Settings', iconName: 'Gear' },
//    { name: 'Leads in Pipe', iconName: 'Target' },
//    { name: 'Customers', iconName: 'Users' },
//    { name: 'Score Card', iconName: 'LeadSources' },
//    { name: 'Pitch Report', iconName: 'Proposal' },
//    { name: 'Status Report', iconName: 'PieGraph' },
// ];

// const UserClient = ({
//    userData,
//    rolesData,
//    officesData,
//    pagePermissions: defaultPagePermissions,
//    customPermissions: defaultCustomPermissions,
// }: UserProps) => {
//    const router = useRouter();
//    const [activeNavIndex, setActiveNavIndex] = useState<number>(0);

//    const [userState, setUserState] = useState<UserData>({ ...userData });
//    const [roles, setRoles] = useState<IdNameObj[]>([...(rolesData || [])]);
//    const [offices, setOffices] = useState<IdNameObj[]>([...(officesData || [])]);
//    const [pagePermissions, setPagePermissions] = useState([...(defaultPagePermissions || [])]);
//    const [customPermissions, setCustomPermissions] = useState<any[]>([...(defaultCustomPermissions || [])]);

//    const dispatch = useAppDispatch();
//    const state = useAppSelector((state) => state.pageContext);

//    const handleSaveUser = async (e: any) => {
//       // console.log(userState);
//       // validate user state here

//       // get the token from the cookies && set the headers object
//       const token = Cookies.get('LUM_AUTH');
//       const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
//       const dataToSend = { ...userState, roleId: userState.role?.id, officeId: userState.office?.id };

//       // if valid && there is an id, this means that we just want to update the user
//       if (userData?.id && true) {
//          await axios
//             .put(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/users/${31}`, dataToSend, { headers: headers })
//             .then((res) => {
//                console.log('RES', res);
//                return;
//             })
//             .catch((err) => {
//                console.log('ERR', err);
//                return;
//             });
//       }

//       // if valud && there is NOT an id, this means we want to save the user & send an invite link via email
//       if (!userData?.id && true) {
//          axios
//             .post(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/users`, dataToSend, { headers: headers })
//             .then((res) => {
//                console.log('RES', res);
//                return;
//             })
//             .catch((err) => {
//                console.log('ERR', err);
//                return;
//             });
//       }

//       router.push('/admin/users');
//    };

//    const handleUserStateChange = (tempUserState: UserData) => {
//       setUserState(tempUserState);
//    };

//    return (
//       <PageContainer
//          breadcrumbsChildren={
//             <>
//                <Button color='blue' onClick={handleSaveUser}>
//                   Save
//                </Button>
//                <Button
//                   color='white'
//                   onClick={() => {
//                      router.back();
//                   }}>
//                   Cancel
//                </Button>
//             </>
//          }>
//          <Grid>
//             {/* Profile Details */}
//             {/* <Profile userData={userState} /> */}
//             {/* End Profile Details */}

//             {/* User Navigation */}
//             <Tabs tabs={tabs} activeTabIndex={activeNavIndex} setActiveTabIndex={setActiveNavIndex} />
//             {/* End User Navigation */}

//             {/* SETTINGS */}
//             {/* {tabs[activeNavIndex].name === 'Settings' && (
//                <Settings
//                   userData={userState}
//                   handleUserStateChange={handleUserStateChange}
//                   rolesData={roles}
//                   officesData={offices}
//                   pagePermissions={pagePermissions}
//                   customPermissions={customPermissions}
//                />
//             )} */}

//             {/* LEADS IN PIPE */}
//             {tabs[activeNavIndex].name === 'Leads in Pipe' && <LeadsInPipe />}

//             {/* CUSTOMERS */}
//             {tabs[activeNavIndex].name === 'Customers' && <Customers />}

//             {/* SCORE CARD */}
//             {tabs[activeNavIndex].name === 'Score Card' && <Scorecard />}

//             {/* PITCH REPORT */}
//             {tabs[activeNavIndex].name === 'Pitch Report' && <PitchReport />}

//             {/* STATUS REPORT */}
//             {tabs[activeNavIndex].name === 'Status Report' && <h1>Status Report</h1>}
//          </Grid>
//       </PageContainer>
//    );
// };

// export default UserClient;
