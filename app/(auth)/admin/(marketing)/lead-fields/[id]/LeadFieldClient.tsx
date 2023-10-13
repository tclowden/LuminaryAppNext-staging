'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '../../../../../../common/components/button/Button';
import DropDown from '../../../../../../common/components/drop-down/DropDown';
import Explainer from '../../../../../../common/components/explainer/Explainer';
import Grid from '../../../../../../common/components/grid/Grid';
import Input from '../../../../../../common/components/input/Input';
import LoadingBackdrop from '../../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';
import PageContainer from '../../../../../../common/components/page-container/PageContainer';
import TableList from '../../../../../../common/components/table-list/TableList';
import { ColumnType } from '../../../../../../common/components/table/tableTypes';
import useForm, { YupSchemaObject } from '../../../../../../common/hooks/useForm';
import { LeadFieldOption } from '../../../../../../common/types/Leads';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { setAddToast } from '../../../../../../store/slices/toast';
import { selectUser } from '../../../../../../store/slices/user';
import * as Yup from 'yup';
import { fetchDbApi } from '@/serverActions';

const configureFieldValidationSchema: YupSchemaObject<any> = {
   fieldType: Yup.object().required('Input Type is required'),
   label: Yup.string().required('Label is required'),
   placeholder: Yup.string(),
};

const sortList = (arr: Array<LeadFieldOption>, key: string) => {
   const maxVal = [...arr].reduce((acc: any, val: any) => (acc = acc > val[key] ? acc : val[key]), 0);
   return [...arr]
      .sort((a: any, b: any) => a[key] - b[key])
      .map((val: any, i: number) => {
         return {
            ...val,
            actionsConfig: {
               ...val.actionsConfig,
               moveup: i === 0 ? false : true,
               movedown: val[key] === maxVal ? false : true,
            },
         };
      });
};

const columns: ColumnType[] = [
   {
      render: ({ item, callback }) => {
         return <Input value={item.value} onChange={callback} />;
      },
   },
];

type Props = {
   leadField: any;
   fieldTypes: Array<any>;
};

const LeadFieldClient = ({ leadField, fieldTypes }: Props) => {
   const dispatch = useAppDispatch();
   const router = useRouter();
   const user = useAppSelector(selectUser);

   const [isSaving, setIsSaving] = useState<boolean>(false);

   const handleFieldTypeSelect = (e: any, selectedFieldType: any) => {
      handleChange({ target: { type: 'text', value: selectedFieldType.id, name: 'fieldTypeId' } });
      handleChange({ target: { type: 'text', value: selectedFieldType, name: 'fieldType' } });
   };

   const handleActionClick = ({ actionKey, item, newData }: any) => {
      switch (actionKey) {
         case 'moveup':
         case 'movedown':
            const archivedOptions = values?.leadFieldOptions.filter((option: LeadFieldOption) => option?.archived);
            setMultiValues({
               ...values,
               leadFieldOptions: [...newData].concat(archivedOptions),
            });
            break;
         case 'delete':
            const tempOptions = [...values.leadFieldOptions];
            const foundOptionIndex = tempOptions.findIndex((option) => option.displayOrder === item.displayOrder);

            if (foundOptionIndex >= 0) {
               // If option has id, update archived property to true, else remove the option from the formData leadFieldOptions State array
               if (tempOptions[foundOptionIndex]?.id) {
                  tempOptions[foundOptionIndex]['archived'] = true;
               } else {
                  tempOptions.splice(foundOptionIndex, 1);
               }
            }

            setMultiValues({
               ...values,
               leadFieldOptions: tempOptions,
            });
            break;
         default:
            console.log('Action not recognized');
            break;
      }
   };

   const handleOptionInputChange = ({ event, item }: any) => {
      const tempOptions = [...values.leadFieldOptions];
      const optionIndexToEdit = tempOptions.findIndex((op: any) => op.displayOrder === item.displayOrder);
      tempOptions[optionIndexToEdit].value = event.target.value;
      setMultiValues({
         ...values,
         leadFieldOptions: [...tempOptions],
      });
   };

   const handleAddOption = () => {
      const tempArr = values?.leadFieldOptions ? [...values?.leadFieldOptions] : [];
      const maxVal = tempArr.reduce((acc: any, val: any) => (acc = acc > val.displayOrder ? acc : val.displayOrder), 0);
      const newOption = [
         ...tempArr,
         { value: '', displayOrder: maxVal + 1, actionsConfig: { delete: true, moveup: true, movedown: false } },
      ];
      const tempOptions = sortList(newOption, 'displayOrder');
      setMultiValues({
         ...values,
         leadFieldOptions: [...tempOptions],
      });
   };

   const handleSuccessToast = (msg: string) => {
      dispatch(
         setAddToast({
            iconName: 'CheckMarkCircle',
            details: [{ label: 'Success', text: msg }],
            variant: 'success',
            autoCloseDelay: 5,
         })
      );
   };

   const handleErrorToast = (msg: string) => {
      dispatch(
         setAddToast({
            iconName: 'XMarkCircle',
            details: [{ label: 'Error', text: msg }],
            variant: 'danger',
            autoCloseDelay: 5,
         })
      );
   };

   const handleSave = async () => {
      const newLeadFieldData = { ...values };

      setIsSaving(true);

      if (newLeadFieldData?.id) {
         fetchDbApi(`/api/v2/leads/lead-fields/${newLeadFieldData.id}`, {
            method: 'PUT',
            body: JSON.stringify(newLeadFieldData),
         })
            .then(() => {
               setIsSaving(false);
               router.push('/admin/lead-fields');
               handleSuccessToast('Lead Field Was Updated');
            })
            .catch((err) => {
               console.error('handleSave -> Error:', err);
               setIsSaving(false);
               handleErrorToast('Could Not Update Lead Field');
            });
      } else {
         fetchDbApi(`/api/v2/leads/lead-fields`, {
            method: 'POST',
            body: JSON.stringify(newLeadFieldData),
         })
            .then(() => {
               setIsSaving(false);
               router.push('/admin/lead-fields');
               handleSuccessToast('Lead Field Was Created');
            })
            .catch((err) => {
               console.error('handleSave -> Error:', err);
               setIsSaving(false);
               handleErrorToast('Could Not Create Lead Field');
            });
      }
   };

   const { handleSubmit, handleChange, handleBlur, values, setMultiValues, errors } = useForm({
      initialValues: leadField,
      validationSchema: configureFieldValidationSchema,
      onSubmit: handleSave,
   });

   const options = values?.leadFieldOptions?.length
      ? sortList(
           values.leadFieldOptions.filter((option: LeadFieldOption) => !option?.archived),
           'displayOrder'
        )
      : [];

   // If fieldType is of type Dropdown, make sure it has at least one option.
   // Verifies that the fieldType and label have no form errors as well
   const isSaveDisabled =
      values?.fieldType?.name === 'Dropdown'
         ? !!(
              !values?.label ||
              !values?.leadFieldOptions?.filter((option: LeadFieldOption) => !option?.archived)?.length
           )
         : !!(!values?.fieldType || !values?.label || errors?.fieldType || errors?.label);

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Button color='blue' onClick={handleSubmit} disabled={isSaveDisabled}>
                     Save
                  </Button>
                  <Button color='white' onClick={() => router.back()}>
                     Cancel
                  </Button>
               </>
            }
            breadcrumbsTitle={leadField?.label}>
            <Explainer description='Select input type. Then configure your input with a name, optional placeholder etc.'>
               <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Configure Field</div>
               <Grid>
                  <Grid columnCount={2} responsive>
                     <DropDown
                        label='Input Type'
                        options={fieldTypes || []}
                        selectedValues={values?.fieldType ? [values.fieldType] : []}
                        placeholder='Select Input Field Type'
                        keyPath={['name']}
                        name='fieldType'
                        onOptionSelect={handleFieldTypeSelect}
                        onBlur={handleBlur}
                        errorMessage={errors?.fieldType}
                        required
                     />
                  </Grid>
                  <Grid columnCount={2} responsive>
                     <Input
                        name='label'
                        label='Field Label'
                        value={values?.label || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={'Enter Field Label'}
                        errorMessage={errors?.label}
                        required
                     />
                     <Input
                        name='placeholder'
                        label='Field Placeholder'
                        value={values?.placeholder || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={'Enter Field Placeholder'}
                        errorMessage={errors?.placeholder}
                     />
                  </Grid>
                  {values?.fieldType?.name === 'Dropdown' && (
                     <>
                        <div className='mt-2 text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>
                           {values?.fieldType?.name} Options
                        </div>
                        <Grid>
                           <TableList
                              data={options.filter((option) => !option?.archived)}
                              columns={columns}
                              rowReorder
                              rowReorderKeyPath={['displayOrder']}
                              onCellEvent={handleOptionInputChange}
                              showChildButton
                              childButtonCallback={handleAddOption}
                              childButtonText='Add Selection'
                              childButtonIconName='Plus'
                              childButtonIconColor='gray'
                              showEmptyState={false}
                              actions={[
                                 {
                                    icon: 'UnionUp',
                                    actionKey: 'moveup',
                                    toolTip: 'Move Up',
                                    callback: handleActionClick,
                                 },
                                 {
                                    icon: 'UnionDown',
                                    actionKey: 'movedown',
                                    toolTip: 'Move Down',
                                    callback: handleActionClick,
                                 },
                                 {
                                    icon: 'TrashCan',
                                    actionKey: 'delete',
                                    toolTip: 'Delete Coordinator',
                                    callback: handleActionClick,
                                 },
                              ]}
                           />
                        </Grid>
                     </>
                  )}
               </Grid>
            </Explainer>
         </PageContainer>
         <LoadingBackdrop isOpen={isSaving} zIndex={101} />
      </>
   );
};

export default LeadFieldClient;
