'use client';
import DatePicker from '@/common/components/date-picker/DatePicker';
import DropDown from '@/common/components/drop-down/DropDown';
import Grid from '@/common/components/grid/Grid';
import Input from '@/common/components/input/Input';
import LoadingBackdrop from '@/common/components/loaders/loading-spinner/LoadingBackdrop';
import Modal from '@/common/components/modal/Modal';
import SearchBar from '@/common/components/search-bar/SearchBar';
import Textarea from '@/common/components/textarea/Textarea';
import useDebounce from '@/common/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPageContext, setPageContext } from '@/store/slices/pageContext';
import { selectUser } from '@/store/slices/user';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { getOrderData } from '../../../utilities';
import { setAddToast } from '@/store/slices/toast';
import { LumError } from '@/utilities/models/LumError';
import { fetchDbApi } from '@/serverActions';
import useForm from '@/common/hooks/useForm';

interface Props {
   modalOpen: boolean;
   setModalOpen: (bool: boolean) => void;
   initValues: any;
}

const TaskModal = ({ modalOpen, setModalOpen, initValues }: Props) => {
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   const { order } = useAppSelector(selectPageContext);

   const [isSaving, setIsSaving] = useState<boolean>(false);

   const [modalSearchVal, setModalSearchVal] = useState<string>();
   const [modalSearchResults, setModalSearchResults] = useState<Array<any>>([]);

   const handleSaveOneOffTask = (e: any, updatedData: any) => {
      setIsSaving(true);
      const fullTaskOnOrderData = order?.tasksOnOrder?.find((taskOnOrder: any) => taskOnOrder?.id === updatedData?.id);

      let dataToSave = null;
      if (fullTaskOnOrderData) dataToSave = { ...fullTaskOnOrderData, ...updatedData };
      else dataToSave = { ...updatedData };

      // the name & description could be the productTask name and description or the taskOnOrder name & description...
      // don't save the name & description if it's the productTask name & description
      if (dataToSave?.taskOnProductId) {
         dataToSave['name'] = null;
         dataToSave['description'] = null;
      }

      // if description is an empty string, ste it to null
      if (dataToSave?.description === '') dataToSave['description'] = null;

      // delete unnecessry data
      delete dataToSave['actionsConfig'];
      delete dataToSave['createdBy'];
      delete dataToSave['updatedBy'];

      let url = null;
      let method = null;
      if (dataToSave?.id) {
         dataToSave['updatedById'] = user?.id;

         url = `/api/v2/orders/${order?.id}/tasks/${dataToSave?.id}`;
         method = 'PUT';
      } else {
         dataToSave['createdById'] = user?.id;
         dataToSave['updatedById'] = null;

         url = `/api/v2/orders/${order?.id}/tasks`;
         method = 'POST';
      }

      console.log('dataToSave', dataToSave);

      fetchDbApi(url, {
         method: method,
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
         body: JSON.stringify(dataToSave),
      })
         .then(async (res: any) => {
            if (!res?.errors?.length) {
               const tempOrder = await getOrderData(user?.token || undefined, order?.id);
               dispatch(setPageContext({ order: tempOrder }));

               setTimeout(() => {
                  resetForm();
                  setModalSearchVal(undefined);
                  setModalSearchResults([]);

                  setIsSaving(false);
                  setModalOpen(false);
                  dispatch(
                     setAddToast({
                        details: [{ label: 'Success', text: 'Task Updated Successfully!' }],
                        iconName: 'CheckMarkCircle',
                        variant: 'success',
                        autoCloseDelay: 5,
                     })
                  );
               }, 500);
            } else throw new LumError(400, res?.errors[0] || res?.message);
         })
         .catch((err: any) => {
            console.log('err saving task on order...:', err);
            setIsSaving(false);
            const errMsg = err?.errorMessage || 'Changes Not Saved';
            dispatch(
               setAddToast({
                  iconName: 'XMarkCircle',
                  details: [{ label: 'Error', text: errMsg }],
                  variant: 'danger',
                  autoCloseDelay: 5,
               })
            );
         });
   };

   const { handleSubmit, handleChange, handleBlur, values, errors, setValue, setMultiValues, resetForm } = useForm({
      initialValues: {},
      validationSchema: {
         name: Yup.string().required(),
         assignType: Yup.object().nullable().required('Field is required.'),
         assignTypeAnswer: Yup.object().nullable().required('Field is required.'),
         description: Yup.string().nullable(),
         dueAt: Yup.date().nullable(),
      },
      onSubmit: handleSaveOneOffTask,
   });

   useEffect(() => {
      if (modalOpen && !!Object.keys(initValues)?.length) {
         setMultiValues({
            id: initValues?.id,
            name: initValues?.name || initValues?.taskOnProduct?.productTask?.name,
            description: initValues?.description || initValues?.taskOnProduct?.productTask?.description,
            dueAt: initValues?.dueAt,
            assignType: { key: 'user', name: null },
            assignTypeAnswer: {
               emailAddress: initValues?.assignedTo?.emailAddress,
               fullName: initValues?.assignedTo?.fullName,
               id: initValues?.assignedToId,
            },
         });
         setModalSearchVal(initValues?.assignedTo?.fullName);
      }
   }, [initValues, modalOpen]);

   useDebounce(
      () => {
         const isValidStrLength = modalSearchVal && modalSearchVal?.length >= 2;
         const queryRoles = values?.assignType?.key === 'role';
         const queryUsers = values?.assignType?.key === 'user';

         const runAsync = async (url: string) => {
            const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` };
            const results = await fetchDbApi(url, { method: 'GET', headers: headers }).catch((err: any) => {
               console.log('err querying on search...:', err);
            });

            setModalSearchResults(results);
         };

         if (isValidStrLength && queryRoles) runAsync(`/api/v2/roles/query?name=${modalSearchVal}`);
         else if (isValidStrLength && queryUsers) runAsync(`/api/v2/users/query?fullName=${modalSearchVal}`);
      },
      [modalSearchVal],
      500
   );

   return (
      <>
         <Modal
            zIndex={100}
            isOpen={modalOpen}
            title='Add Task'
            onClose={(e: any) => {
               setModalOpen(false);
               resetForm();
               setModalSearchVal(undefined);
               setModalSearchResults([]);
            }}
            primaryButtonCallback={handleSubmit}>
            <Grid rowGap={10}>
               <Grid columnCount={2}>
                  <Input
                     data-test={'name'}
                     name='name'
                     label='Task Name'
                     value={values?.name || ''}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     placeholder={'Ex) Call Sherly Temple'}
                     errorMessage={errors?.name}
                     disabled={!!initValues?.taskOnProductId}
                     required
                  />
                  <DatePicker
                     name={'dueAt'}
                     label={'Task Due At'}
                     date={values?.dueAt}
                     onDateSelect={(date: any, dateStr: string) => {
                        handleChange({ target: { type: 'text', name: 'dueAt', value: dateStr } });
                     }}
                     dateFormat={'Y-m-d H:i:S'}
                     errorMessage={errors?.dueAt}
                  />
               </Grid>
               {!values?.id ? (
                  <Grid columnCount={2}>
                     <DropDown
                        label={'Assign Type'}
                        selectedValues={values?.assignType ? [values?.assignType] : []}
                        onBlur={handleBlur}
                        placeholder='Ex) Role - Round Robin'
                        options={[
                           { name: 'Role - Round Robin', key: 'role', roundRobin: true },
                           { name: 'Role - Random', key: 'role', roundRobin: false },
                           { name: 'User', key: 'user', roundRobin: false },
                           { name: `Me (${user?.fullName})`, key: 'me', roundRobin: false },
                           { name: `Agent (${order?.owner?.fullName})`, key: 'agent', roundRobin: false },
                        ]}
                        onOptionSelect={(e: any, selectedVal: any) => {
                           const needToResetAnswer = values?.assignType?.key !== selectedVal?.key;
                           if (needToResetAnswer) {
                              setModalSearchVal(undefined);
                              setModalSearchResults([]);
                              setMultiValues({ assignTypeAnswer: undefined });
                           }
                           handleChange({ target: { type: 'text', value: selectedVal, name: 'assignType' } });

                           const obj =
                              selectedVal?.key === 'me' ? user : selectedVal?.key === 'agent' ? order?.owner : null;
                           if (obj) {
                              const val = { id: obj?.id, emailAddress: obj?.emailAddress, fullName: obj?.fullName };
                              setMultiValues({ assignTypeAnswer: val });
                              setModalSearchVal(val?.fullName);
                           }
                        }}
                        keyPath={['name']}
                        required
                        name='assignType'
                        errorMessage={errors?.assignType}
                     />
                     <SearchBar
                        // iconName={'Calendar'}
                        label={values?.assignType?.key === 'role' ? 'Role' : 'User'}
                        placeholder='Start Typing to populate results...'
                        searchValue={modalSearchVal || ''}
                        searchResults={modalSearchResults}
                        isLoading={
                           modalSearchVal && modalSearchVal?.length && !modalSearchResults?.length ? true : false
                        }
                        onSelectSearchResult={(e: any, selectedVal: any) => {
                           let val: any = { id: selectedVal?.id };
                           if (values?.assignType?.key === 'role') {
                              val = { ...val, name: selectedVal?.name, description: selectedVal?.description };
                              setModalSearchVal(selectedVal?.name);
                           } else if (values?.assignType?.key === 'user') {
                              val = {
                                 ...val,
                                 fullName: selectedVal?.fullName,
                                 emailAddress: selectedVal?.emailAddress,
                              };
                              setModalSearchVal(selectedVal?.fullName);
                           }

                           handleChange({ target: { type: 'text', value: val, name: 'assignTypeAnswer' } });
                        }}
                        keyPath={values?.assignType?.key === 'role' ? ['name'] : ['fullName']}
                        handleChange={(e: any) => {
                           setModalSearchVal(e.target.value);
                        }}
                        handleBlur={handleBlur}
                        name='assignTypeAnswer'
                        errorMessage={errors?.assignTypeAnswer}
                        disabled={
                           !values?.assignType ||
                           values?.assignType?.key === 'me' ||
                           values?.assignType?.key === 'agent'
                        }
                        required
                     />
                  </Grid>
               ) : (
                  // if in edit mode... there is an id
                  // we can only change who the task is assigned to... that's it
                  <Grid columnCount={2}>
                     <SearchBar
                        label={'Assign To'}
                        placeholder='Start Typing to populate results...'
                        searchValue={modalSearchVal || ''}
                        searchResults={modalSearchResults}
                        onSelectSearchResult={(e: any, selectedVal: any) => {
                           // KEY WILL ALWAYS BE 'user' RIGHT NOW
                           let val: any = { id: selectedVal?.id };
                           if (values?.assignType?.key === 'role') {
                              val = { ...val, name: selectedVal?.name, description: selectedVal?.description };
                              setModalSearchVal(selectedVal?.name);
                           } else if (values?.assignType?.key === 'user') {
                              val = {
                                 ...val,
                                 fullName: selectedVal?.fullName,
                                 emailAddress: selectedVal?.emailAddress,
                              };
                              setModalSearchVal(selectedVal?.fullName);
                           }
                           handleChange({ target: { type: 'text', value: val, name: 'assignTypeAnswer' } });
                        }}
                        keyPath={['fullName']}
                        handleChange={(e: any) => {
                           setModalSearchVal(e.target.value);
                        }}
                        handleBlur={handleBlur}
                        name='assignTypeAnswer'
                        errorMessage={errors?.assignedTo}
                        required
                     />
                  </Grid>
               )}
               <Textarea
                  data-test={'description'}
                  label='Description'
                  name='description'
                  value={values?.description || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={'She really wants to know the latest on Solar trends in her nearby area.'}
                  errorMessage={errors?.description}
                  disabled={!!initValues?.taskOnProductId}
                  isRequired
               />
            </Grid>
         </Modal>
         <LoadingBackdrop isOpen={isSaving} zIndex={101} />
      </>
   );
};

export default TaskModal;
