import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DropDown from '../../../../../common/components/drop-down/DropDown';
import Grid from '../../../../../common/components/grid/Grid';
import Input from '../../../../../common/components/input/Input';
import Modal from '../../../../../common/components/modal/Modal';
import useForm, { YupSchemaObject } from '../../../../../common/hooks/useForm';
import { LeadSource } from '../../../../../common/types/Leads';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { setAddToast } from '../../../../../store/slices/toast';
import { selectUser } from '../../../../../store/slices/user';
import { fetchDbApi, revalidate } from '@/serverActions';

const newLeadValidationSchema: YupSchemaObject<any> = {
   'First Name': Yup.string(),
   'Last Name': Yup.string(),
   'Phone Number': Yup.string().required('Phone number is required'),
   'Lead Source': Yup.object().required('Lead source is required'),
};

type Props = {
   isOpen: boolean;
   setIsOpen: (state: boolean) => void;
};

const NewLeadModal = ({ isOpen, setIsOpen }: Props) => {
   const router = useRouter();
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   const [leadSources, setLeadSources] = useState<Array<LeadSource>>([]);

   useEffect(() => {
      fetch(`/api/v2/lead-sources`, {
         method: 'GET',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user.token}` },
      })
         .then(async (res) => {
            const results = await res.json();
            if (results.error) throw new Error(results.error.errorMessage);
            setLeadSources(results);
         })
         .catch((err) => console.error('err:', err));
   }, []);

   const handleAddLead = () => {
      const formDataCopy = { ...values };

      const newLead = {
         leadSourceId: formDataCopy['Lead Source']?.id,
         createdById: user.id,
         firstName: formDataCopy['First Name'],
         lastName: formDataCopy['Last Name'],
         phoneNumber: formDataCopy['Phone Number'],
      };

      fetchDbApi(`/api/v2/leads`, {
         method: 'POST',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user.token}` },
         body: JSON.stringify(newLead),
      })
         .then(async (res) => {
            const result = res;
            if (result.error) throw new Error(result.error.errorMessage);

            const url = `/marketing/leads/${result?.id}`;
            revalidate({ path: url });
            router.push(url);
            dispatch(
               setAddToast({
                  iconName: 'CheckMarkCircle',
                  details: [{ label: 'Success', text: 'New Lead Created!' }],
                  variant: 'success',
                  autoCloseDelay: 5,
               })
            );
            setIsOpen(false);
         })
         .catch((err) => {
            console.error(err);
            dispatch(
               setAddToast({
                  iconName: 'XMarkCircle',
                  details: [{ label: 'Error', text: 'Lead Was Not Created' }],
                  variant: 'danger',
                  autoCloseDelay: 5,
               })
            );
         });
   };

   const { values, handleChange, handleBlur, handleSubmit, resetValues, errors, resetErrors, resetTouched } = useForm({
      initialValues: {},
      validationSchema: newLeadValidationSchema,
      onSubmit: handleAddLead,
   });

   return (
      <Modal
         title='Create New Lead'
         isOpen={isOpen}
         onClose={(e: any) => {
            resetValues();
            resetTouched();
            resetErrors();
            setIsOpen(false);
         }}
         secondaryButtonText='Cancel'
         primaryButtonText='Save'
         primaryButtonCallback={handleSubmit}
         disablePrimaryButton={
            !!(!values['Lead Source'] || !values['Phone Number'] || errors['Lead Source'] || errors['Phone Number'])
         }>
         <Grid>
            <Grid columnCount={2}>
               <Input
                  name={'First Name'}
                  label={'First Name'}
                  placeholder={'John'}
                  value={values['First Name'] || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={errors['First Name']}
               />
               <Input
                  name={'Last Name'}
                  label={'Last Name'}
                  placeholder={'Doe'}
                  value={values['Last Name'] || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={errors['Last Name']}
               />
               <Input
                  name={'Phone Number'}
                  label={'Phone Number'}
                  placeholder={'+12223334444'}
                  value={values['Phone Number'] || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={errors['Phone Number']}
               />
            </Grid>
            <Grid>
               {!!leadSources && (
                  <DropDown
                     searchable
                     name='Lead Source'
                     label='Lead Source'
                     placeholder='Select Lead Source'
                     required
                     selectedValues={values['Lead Source'] ? [values['Lead Source']] : []}
                     keyPath={['name']}
                     options={leadSources}
                     onBlur={handleBlur}
                     onOptionSelect={(e: any, selectedFieldType: any) => {
                        handleChange({ target: { type: 'text', value: selectedFieldType, name: 'Lead Source' } });
                     }}
                     errorMessage={errors['Lead Source']}
                  />
               )}
            </Grid>
         </Grid>
      </Modal>
   );
};

export default NewLeadModal;
