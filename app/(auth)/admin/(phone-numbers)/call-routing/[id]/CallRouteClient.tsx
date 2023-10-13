'use client';

import Button from '@/common/components/button/Button';
import ChipButton from '@/common/components/chip-button/ChipButton';
import Chip from '@/common/components/chip/Chip';
import DropDown from '@/common/components/drop-down/DropDown';
import Explainer from '@/common/components/explainer/Explainer';
import Grid from '@/common/components/grid/Grid';
import Input from '@/common/components/input/Input';
import LoadingBackdrop from '@/common/components/loaders/loading-spinner/LoadingBackdrop';
import PageContainer from '@/common/components/page-container/PageContainer';
import TableHeader from '@/common/components/table/tablePartials/TableHeader';
import { ColumnType } from '@/common/components/table/tableTypes';
import Textarea from '@/common/components/textarea/Textarea';
import useForm, { YupSchemaObject } from '@/common/hooks/useForm';
import useToaster from '@/common/hooks/useToaster';
import { ActionOnCallRoute } from '@/common/types/CallRoutes';
import { PhoneNumber } from '@/common/types/PhoneNumbers';
import { fetchDbApi, revalidate } from '@/serverActions';
import { findMinMaxValueInArray } from '@/utilities/helpers';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Yup from 'yup';

const configureFieldValidationSchema: YupSchemaObject<any> = {
   name: Yup.string().required(`Call Route 'Name' is required`),
   description: Yup.string().required(`Call Route 'Description' is required`),
   type: Yup.object(),
   phoneNumbersOnCallRoute: Yup.array(),
   statusesOnCallRoute: Yup.array(),
   userIdsToDial: Yup.array(),
   roleIdsToDial: Yup.array(),
};

const columns: ColumnType[] = [
   {
      colSpan: 1,
      title: 'After (Seconds)',
   },
   {
      title: 'Action',
      colSpan: 4,
   },
];

interface Props {
   phoneNumbersData: any;
   statusesData: any;
   callRouteTypesData: any;
   actionTypesData: any;
   usersData: any;
   rolesData: any;
   callRouteData: any;
}

const CallRouteClient = ({
   phoneNumbersData,
   statusesData,
   callRouteTypesData,
   actionTypesData,
   usersData,
   rolesData,
   callRouteData,
}: Props) => {
   const router = useRouter();
   const makeToast = useToaster();

   const [optionSearchVal, setOptionSearchVal] = useState<string>('');
   const [isSaving, setIsSaving] = useState<boolean>(false);

   const handleAddAction = () => {
      const tempActions = values?.actionsOnCallRoute ? [...values?.actionsOnCallRoute] : [];
      const { max } = findMinMaxValueInArray(tempActions, ['displayOrder']);
      setMultiValues({
         ...values,
         actionsOnCallRoute: [
            ...tempActions,
            { tempId: crypto.randomUUID(), waitSeconds: 0, displayOrder: (max || 0) + 1 },
         ],
      });
   };

   const handleDeleteAction = (action: any) => {
      if (action?.tempId) {
         return setMultiValues({
            ...values,
            actionsOnCallRoute: [...values?.actionsOnCallRoute.filter((item: any) => item?.tempId !== action.tempId)],
         });
      }
      const foundAction = values?.actionsOnCallRoute.find((item: ActionOnCallRoute) => item.id === action.id);
      foundAction['archived'] = true;
      setMultiValues({
         ...values,
      });
   };

   const handleRemovePhoneNumber = (number: string | number) => {
      const foundPhoneNumberOnRoute = values?.phoneNumbersOnCallRoute?.find(
         (numberOnRoute: any) => numberOnRoute?.phoneNumber?.prettyNumber === number
      );
      if (!foundPhoneNumberOnRoute) return;

      if (foundPhoneNumberOnRoute?.tempId) {
         return setMultiValues({
            ...values,
            phoneNumbersOnCallRoute: [
               ...(!!values?.phoneNumbersOnCallRoute?.length ? values.phoneNumbersOnCallRoute : []).filter(
                  (item: any) => item?.phoneNumber?.prettyNumber !== number
               ),
            ],
         });
      }
      foundPhoneNumberOnRoute['archived'] = true;
      setMultiValues({
         ...values,
      });
   };

   const handleRemoveStatus = (statusName: string | number) => {
      const foundStatusOnRoute = values?.statusesOnCallRoute?.find(
         (statusOnRoute: any) => statusOnRoute?.status?.name === statusName
      );
      if (!foundStatusOnRoute) return;

      if (foundStatusOnRoute?.tempId) {
         return setMultiValues({
            ...values,
            statusesOnCallRoute: [
               ...(!!values?.statusesOnCallRoute?.length ? values.statusesOnCallRoute : []).filter(
                  (item: any) => item?.status?.name !== statusName
               ),
            ],
         });
      }
      foundStatusOnRoute['archived'] = true;
      setMultiValues({
         ...values,
      });
   };

   const handleSave = () => {
      const newCallRouteData = { ...values };
      setIsSaving(true);

      if (newCallRouteData?.id) {
         return fetchDbApi(`/api/v2/call-routes/${newCallRouteData.id}`, {
            method: 'PUT',
            body: JSON.stringify(newCallRouteData),
         })
            .then(async () => {
               setIsSaving(false);
               makeToast(true, 'Call route was updated!');
               await revalidate({ path: '/admin/call-routing' });
               router.push('/admin/call-routing');
            })
            .catch((err) => {
               setIsSaving(false);
               makeToast(false, 'Call route was not updated');
               console.error('err', err);
            });
      } else {
         return fetchDbApi(`/api/v2/call-routes`, {
            method: 'POST',
            body: JSON.stringify(newCallRouteData),
         })
            .then(async () => {
               setIsSaving(false);
               makeToast(true, 'Call route was created!');
               await revalidate({ path: '/admin/call-routing' });
               router.push('/admin/call-routing');
            })
            .catch((err) => {
               setIsSaving(false);
               makeToast(false, 'Call route was not created');
               console.error('err', err);
            });
      }
   };

   const { handleSubmit, handleChange, handleBlur, values, setValue, setMultiValues, errors } = useForm({
      initialValues: callRouteData,
      validationSchema: configureFieldValidationSchema,
      onSubmit: handleSave,
   });

   const archivedPhoneNumbers = !!values?.phoneNumbersOnCallRoute?.length
      ? values.phoneNumbersOnCallRoute.filter((numberOnRoute: any) => numberOnRoute?.archived)
      : [].map((item: any) => item?.phoneNumber);
   const archivedStatuses = !!values?.statusesOnCallRoute?.length
      ? values.statusesOnCallRoute
           .filter((statusOnRoute: any) => statusOnRoute?.archived)
           .map((item: any) => item?.status)
      : [];

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Button color='blue' onClick={handleSubmit}>
                     Save
                  </Button>
                  <Button color='white' onClick={router.back}>
                     Cancel
                  </Button>
               </>
            }
            breadcrumbsTitle={callRouteData?.name}>
            <Grid>
               <Explainer description='Give your Call Route a name & description. Choose whether your Call Route will trigger based on the phone number dialed by the lead, or based on the status of the lead calling in.'>
                  <Grid>
                     <span className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Configure Call Route</span>
                     <Input
                        name={'name'}
                        label='Call Route Name'
                        placeholder='Call Route Name...'
                        value={values?.name || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errorMessage={errors?.name}
                        required
                     />
                     <Textarea
                        name={'description'}
                        label='Call Route Description'
                        placeholder={'Call Route Description...'}
                        value={values?.description || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errorMessage={errors?.description}
                        rows={3}
                     />
                     <div className='grid grid-cols-2'>
                        <DropDown
                           label='Call Route Type'
                           placeholder='Select Type'
                           selectedValues={values?.type ? [values?.type] : []}
                           options={callRouteTypesData}
                           keyPath={['name']}
                           onOptionSelect={(e, option) => setValue('type', option)}
                        />
                     </div>

                     {/* Match Id to 'Phone Number' Type Id */}
                     {values?.type?.id === 'effeae2e-b875-4508-b7c4-41a390c8d85f' && (
                        <>
                           <span className='text-[12px] text-lum-gray-500 dark:text-lum-gray-300'>Phone Numbers</span>
                           <div className='flex flex-wrap gap-[5px]'>
                              {values?.phoneNumbersOnCallRoute
                                 ?.filter((item: any) => !item?.archived)
                                 .map((numberOnCallRoute: any) => (
                                    <Chip
                                       key={numberOnCallRoute?.phoneNumber?.number}
                                       value={numberOnCallRoute?.phoneNumber?.prettyNumber}
                                       onClick={(e, value) => handleRemovePhoneNumber(value)}
                                       color='blue'
                                    />
                                 ))}
                              <ChipButton
                                 options={[...phoneNumbersData, ...archivedPhoneNumbers].filter(
                                    (number: PhoneNumber) => {
                                       const foundNumberOnRoute = values?.phoneNumbersOnCallRoute?.find(
                                          (numberOnRoute: any) => numberOnRoute?.phoneNumber?.id === number.id
                                       );

                                       const matchesSearch = number?.number
                                          ?.replace(/\D/g, '')
                                          .includes(optionSearchVal?.replace(/\D/g, ''));

                                       if (foundNumberOnRoute?.archived) return matchesSearch;
                                       return !foundNumberOnRoute && matchesSearch;
                                    }
                                 )}
                                 textKeyPath={['prettyNumber']}
                                 onOptionSelect={(e, option) => {
                                    const foundNumberOnRoute = values?.phoneNumbersOnCallRoute?.find(
                                       (numberOnRoute: any) => numberOnRoute?.phoneNumber?.id === option.id
                                    );
                                    if (!foundNumberOnRoute) {
                                       return setMultiValues({
                                          ...values,
                                          phoneNumbersOnCallRoute: [
                                             ...(!!values?.phoneNumbersOnCallRoute?.length
                                                ? values.phoneNumbersOnCallRoute
                                                : []),
                                             { tempId: crypto.randomUUID(), phoneNumber: { ...option } },
                                          ],
                                       });
                                    }
                                    foundNumberOnRoute['archived'] = false;
                                    setMultiValues({
                                       ...values,
                                    });
                                 }}
                                 searchable
                                 searchConfig={{
                                    placeholder: 'Search Numbers',
                                    searchValue: optionSearchVal,
                                    handleChange: (e: any) => {
                                       setOptionSearchVal(e.target.value);
                                    },
                                 }}
                                 chipBtnText={'+ Add Phone Number'}
                              />
                           </div>
                        </>
                     )}

                     {/* Match Id to 'Status' Type Id */}
                     {values?.type?.id === 'aa8deed6-1bb5-4de1-b387-033e68c34c49' && (
                        <>
                           <span className='text-[12px] text-lum-gray-500 dark:text-lum-gray-300'>Statuses</span>
                           <div className='flex flex-wrap gap-[5px]'>
                              {values?.statusesOnCallRoute
                                 ?.filter((item: any) => !item?.archived)
                                 .map((statusOnCallRoute: any) => (
                                    <Chip
                                       key={statusOnCallRoute?.status?.id}
                                       value={statusOnCallRoute?.status?.name}
                                       onClick={(e, value) => handleRemoveStatus(value)}
                                       color='blue'
                                    />
                                 ))}
                              <ChipButton
                                 options={[...statusesData, ...archivedStatuses].filter((status: any) => {
                                    const foundStatusOnRoute = values?.statusesOnCallRoute?.find(
                                       (statusOnRoute: any) => statusOnRoute?.status?.id === status?.id
                                    );
                                    const matchesSearch = status?.name
                                       ?.toLowerCase()
                                       .includes(optionSearchVal?.toLowerCase());

                                    if (foundStatusOnRoute?.archived) return matchesSearch;
                                    return !foundStatusOnRoute && matchesSearch;
                                 })}
                                 textKeyPath={['name']}
                                 onOptionSelect={(e, option) => {
                                    const foundStatusOnRoute = values?.statusesOnCallRoute?.find(
                                       (statusOnRoute: any) => statusOnRoute?.status?.id === option.id
                                    );
                                    if (!foundStatusOnRoute) {
                                       return setMultiValues({
                                          ...values,
                                          statusesOnCallRoute: [
                                             ...(!!values?.statusesOnCallRoute?.length
                                                ? values.statusesOnCallRoute
                                                : []),
                                             { tempId: crypto.randomUUID(), status: { ...option } },
                                          ],
                                       });
                                    }
                                    foundStatusOnRoute['archived'] = false;
                                    setMultiValues({
                                       ...values,
                                    });
                                 }}
                                 searchable
                                 searchConfig={{
                                    placeholder: 'Search Statuses',
                                    searchValue: optionSearchVal,
                                    handleChange: (e: any) => {
                                       setOptionSearchVal(e.target.value);
                                    },
                                 }}
                                 chipBtnText={'+ Add Status'}
                              />
                           </div>
                        </>
                     )}
                  </Grid>
               </Explainer>
               <Explainer description='Specify route actions with a wait time.'>
                  <Grid>
                     <span className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Setup Routing</span>
                     <div className='grid gap-[1px]'>
                        <TableHeader columns={columns} />
                        <div className='mt-[1px] grid gap-[1px]'>
                           {values?.actionsOnCallRoute &&
                              values?.actionsOnCallRoute
                                 .filter((action: ActionOnCallRoute) => !action?.archived)
                                 .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
                                 .map((item: ActionOnCallRoute, index: number) => (
                                    <div key={index} className='flex gap-[1px]'>
                                       <div className='w-[20%] px-[12px] py-[5px] flex items-center bg-lum-gray-50 dark:bg-lum-gray-700 rounded-l-sm'>
                                          {index === 0 ? (
                                             'Default'
                                          ) : (
                                             <Input
                                                name={'name'}
                                                value={item?.waitSeconds ?? ''}
                                                onChange={(e) => {
                                                   const foundAction = values?.actionsOnCallRoute.find(
                                                      (action: ActionOnCallRoute) =>
                                                         item?.id
                                                            ? action?.id === item?.id
                                                            : action?.tempId === item?.tempId
                                                   );
                                                   foundAction['waitSeconds'] = e.target.value;
                                                   setMultiValues({
                                                      ...values,
                                                   });
                                                }}
                                             />
                                          )}
                                       </div>
                                       <div className='flex w-[80%] px-[12px] py-[5px] bg-lum-gray-50 dark:bg-lum-gray-700 rounded-r-sm'>
                                          <div className='grid grid-flow-col grid-cols-2 gap-x-[5px] w-[90%]'>
                                             <DropDown
                                                placeholder='Select Action Type'
                                                keyPath={['name']}
                                                selectedValues={item?.type ? [item?.type] : []}
                                                options={actionTypesData}
                                                onOptionSelect={(e, option) => {
                                                   const foundAction = values?.actionsOnCallRoute.find(
                                                      (action: ActionOnCallRoute) =>
                                                         item?.id
                                                            ? action?.id === item?.id
                                                            : action?.tempId === item?.tempId
                                                   );
                                                   foundAction['type'] = option;
                                                   setMultiValues({
                                                      ...values,
                                                   });
                                                }}
                                             />
                                             {item?.type?.name === 'Say a phrase' && (
                                                <Input
                                                   placeholder='Phrase to say'
                                                   value={item?.messageToSay || ''}
                                                   onChange={(e) => {
                                                      const foundAction = values?.actionsOnCallRoute.find(
                                                         (action: ActionOnCallRoute) =>
                                                            item?.id
                                                               ? action?.id === item?.id
                                                               : action?.tempId === item?.tempId
                                                      );
                                                      foundAction['messageToSay'] = e.target.value;
                                                      setMultiValues({
                                                         ...values,
                                                      });
                                                   }}
                                                />
                                             )}
                                             {item?.type?.name === 'Play a MP3 file' && (
                                                <Input
                                                   placeholder='Paste MP3 url here'
                                                   value={item?.messageToSay || ''}
                                                   onChange={(e) => {
                                                      const foundAction = values?.actionsOnCallRoute.find(
                                                         (action: ActionOnCallRoute) =>
                                                            item?.id
                                                               ? action?.id === item?.id
                                                               : action?.tempId === item?.tempId
                                                      );
                                                      foundAction['waitMusicUrl'] = e.target.value;
                                                      setMultiValues({
                                                         ...values,
                                                      });
                                                   }}
                                                />
                                             )}
                                             {item?.type?.name === 'Ring a specific user' && (
                                                <DropDown
                                                   placeholder='Select User'
                                                   keyPath={['fullName']}
                                                   selectedValues={
                                                      item?.userIdsToDial
                                                         ? [
                                                              usersData.find(
                                                                 (user: any) => user?.id === item.userIdsToDial?.at(0)
                                                              ),
                                                           ]
                                                         : []
                                                   }
                                                   options={usersData}
                                                   onOptionSelect={(e, option) => {
                                                      const foundAction = values?.actionsOnCallRoute.find(
                                                         (action: ActionOnCallRoute) =>
                                                            item?.id
                                                               ? action?.id === item?.id
                                                               : action?.tempId === item?.tempId
                                                      );
                                                      foundAction['userIdsToDial'] = [option?.id];
                                                      setMultiValues({
                                                         ...values,
                                                      });
                                                   }}
                                                   searchable
                                                />
                                             )}
                                             {item?.type?.name === 'Ring a user role' && (
                                                <DropDown
                                                   placeholder='Select Role'
                                                   keyPath={['name']}
                                                   selectedValues={
                                                      item?.roleIdsToDial
                                                         ? [
                                                              rolesData.find(
                                                                 (role: any) => role?.id === item.roleIdsToDial?.at(0)
                                                              ),
                                                           ]
                                                         : []
                                                   }
                                                   options={rolesData}
                                                   onOptionSelect={(e, option) => {
                                                      const foundAction = values?.actionsOnCallRoute.find(
                                                         (action: ActionOnCallRoute) =>
                                                            item?.id
                                                               ? action?.id === item?.id
                                                               : action?.tempId === item?.tempId
                                                      );
                                                      foundAction['roleIdsToDial'] = [option?.id];
                                                      setMultiValues({
                                                         ...values,
                                                      });
                                                   }}
                                                   searchable
                                                />
                                             )}
                                             {item?.type?.name === 'Forward to an external number' && <Input />}
                                             {item?.type?.name === 'Send to voicemail' && <Input />}
                                          </div>
                                          <div className='w-[10%] flex justify-center items-center'>
                                             <Button
                                                iconName={'TrashCan'}
                                                color={'transparent'}
                                                onClick={(e: any) => {
                                                   handleDeleteAction(item);
                                                }}
                                                iconColor='gray:300'
                                                tooltipContent='Delete Action'
                                             />
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                           <div className='flex justify-center items-center py-[5px] bg-lum-gray-50 dark:bg-lum-gray-700'>
                              <Button color='light' size='sm' onClick={handleAddAction}>
                                 Add Action
                              </Button>
                           </div>
                        </div>
                     </div>
                  </Grid>
               </Explainer>
            </Grid>
         </PageContainer>
         <LoadingBackdrop isOpen={isSaving} zIndex={101} />
      </>
   );
};

export default CallRouteClient;
