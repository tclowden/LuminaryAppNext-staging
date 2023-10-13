'use client';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import React, { useEffect, useState } from 'react';
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
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { setAddToast } from '../../../../../../store/slices/toast';
import { selectUser } from '../../../../../../store/slices/user';
import MoreConfiguration from './(partials)/MoreConfiguration';
import { fetchDbApi, revalidate } from '@/serverActions';
import { LumError } from '@/utilities/models/LumError';

const configureFieldValidationSchema: YupSchemaObject<any> = {
   fieldType: Yup.object().nullable().required('Field type is required'),
   label: Yup.string().required('Label is required'),
   placeholder: Yup.string().required('Placeholder is required'),
   configuredList: Yup.object().when('fieldType', {
      is: (fieldType: any) => fieldType && fieldType.name === 'Configurable List',
      then: (schema: any) => Yup.object().nullable().required('Configured list is required'),
      otherwise: (schema) => Yup.object().nullable(),
   }),
   // whereCondition: Yup.object({ roles: Yup.array().of(Yup.object()) }).when('configuredList', {
   //    is: (configuredList: any) => configuredList,
   //    then: (schema: any) =>
   //       Yup.object({
   //          roles: Yup.array().of(Yup.object()).min(1).required(`At least 1 role required`),
   //       }).required('Field is required'),
   //    otherwise: (schema: any) => Yup.object().nullable(),
   // }),
};

const sortList = (arr: Array<any>, key: string) => {
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

interface Props {
   field: any;
   fieldTypes: Array<any>;
   configuredLists: Array<any>;
   roles: Array<any>;
   showOptionsDefault: boolean;
}

const FieldClient = ({ field, fieldTypes, showOptionsDefault, configuredLists, roles }: Props) => {
   const router = useRouter();
   const [showOptions, setShowOptions] = useState<boolean>(showOptionsDefault);
   const [yupSchema, setYupSchema] = useState<YupSchemaObject<any>>(configureFieldValidationSchema);
   const [moreConfiguration, setMoreConfiguration] = useState<boolean>(false);
   const [isSaving, setIsSaving] = useState<boolean>(false);
   const user: any = useAppSelector(selectUser);
   const dispatch = useAppDispatch();

   useEffect(() => {
      if (values?.productFieldOptions && !!values?.productFieldOptions.length) {
         const tempOptions = sortList(values.productFieldOptions, 'displayOrder');
         setValue('productFieldOptions', tempOptions);
         setShowOptions(true);
      }
   }, []);

   const handleFieldSave = async (e: any, updatedValues: any) => {
      setIsSaving(true);
      const dataToSave = { ...updatedValues };

      const userAuthToken = user.token;

      // see if configuredListId exists in the obj...
      // if it doesn't, add the key 'configuredListId' & set it to null
      if (!dataToSave?.configuredListId) dataToSave['configuredListId'] = null;

      // see if dataToSave.fieldTypeId is 'Dropdown' or 'Checkbox' type
      const selectedFieldType = fieldTypes.find((fieldType: any) => fieldType.id === dataToSave.fieldTypeId);
      if (!selectedFieldType) {
         console.log('hmmm.. selectedFieldType does not exist.');
         return;
      }

      // handle productFieldOptions
      const fieldTypeShouldHaveOptions: boolean =
         selectedFieldType.name === 'Dropdown' || selectedFieldType.name === 'Checkbox';
      const productFieldCurrentlyHasOptions =
         dataToSave?.productFieldOptions && dataToSave?.productFieldOptions.length > 0;

      if (!fieldTypeShouldHaveOptions && productFieldCurrentlyHasOptions) {
         // if the field type should NOT have options and the productFieldOptions key is an array of options
         // append the { "delete": true } to each object in array to delete from the db
         dataToSave['productFieldOptions'] = [...dataToSave.productFieldOptions].map(
            (prodFieldOption: any, i: number) => {
               if (prodFieldOption?.actionsConfig) delete prodFieldOption['actionsConfig'];
               return { ...prodFieldOption, archived: true };
            }
         );
      } else if (fieldTypeShouldHaveOptions && productFieldCurrentlyHasOptions) {
         // if the field type should have options & the productFieldOptionsKey is an array of options
         // sort by the displayOrder && remap the displayOrder to not skip any number...
         // [e.g] -> [1,4,5,8] to [1,2,3,4]
         dataToSave['productFieldOptions'] = [...dataToSave.productFieldOptions]
            .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
            // don't save any values that are empty
            .filter((prodFieldOption: any) => prodFieldOption?.value?.length > 0)
            .map((prodFieldOption: any, i: number) => {
               if (prodFieldOption?.actionsConfig) delete prodFieldOption['actionsConfig'];
               return {
                  ...prodFieldOption,
                  displayOrder: i + 1,
               };
            });
      }
      //? this should already be covered because the original object for productFieldOptions is an empty array... (e.g -> [])
      // else if (!fieldTypeShouldHaveOptions && !productFieldCurrentlyHasOptions) {}
      //? this should already be covered because the productFieldOptions array will be populated everytime there is an option added
      // else if (fieldTypeShouldHaveOptions && !productFieldCurrentlyHasOptions) {}

      // delete anything unneccessary
      // delete dataToSave['configuredList'];
      delete dataToSave['fieldType'];

      const buildWhereCondition = (configObj: any) => {
         const { listType } = configObj;
         if (listType === 'users') {
            if (!configObj?.roles?.length) return null;
            // const whereCondition = { roleId: { '[Op.in]': configObj?.roles?.map((role: any) => role?.id) } };
            const whereCondition = { roleId: configObj?.roles?.map((role: any) => role?.id) };
            return whereCondition;
         } else if (listType === 'proposalOptions') {
            const key = configObj?.fkToGroupBy?.name === 'Lead' ? 'leadId' : null;
            if (!key) return null;
            const whereCondition = { [key]: `%${key}%` };
            return whereCondition;
         }
      };

      console.log('dataToSave:', dataToSave);
      if (dataToSave?.whereCondition) dataToSave['whereCondition'] = buildWhereCondition(dataToSave?.whereCondition);

      try {
         let result = null;

         // need to check if creating a new task or updating an existing
         if (dataToSave?.id) {
            const url = `/api/v2/products/fields/${dataToSave.id}`;
            result = await fetchDbApi(url, {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userAuthToken}` },
               body: JSON.stringify(dataToSave),
            });
         } else {
            const url = `/api/v2/products/fields`;
            result = await fetchDbApi(url, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userAuthToken}` },
               body: JSON.stringify(dataToSave),
            });
         }

         if (!result?.errors?.length) {
            // need to add ?_ at the end of the route because nextjs only provides soft navigation with the router
            // with soft navigation, it won't rehit the page.tsx file to refetch all the updated data
            const url = `/admin/product-fields`;
            await revalidate({ path: url });
            router.push(url);
            setTimeout(() => {
               setIsSaving(false);
               dispatch(
                  setAddToast({
                     details: [{ label: 'Success', text: 'Field Successfully Saved' }],
                     iconName: 'CheckMarkCircle',
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
            }, 500);
            // hard navigate
            // window.location.href = '/admin/fields';
         } else throw new LumError(400, result?.errors[0] || result?.message);
      } catch (err: any) {
         console.log('err:', err);
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

   const handleFieldTypeSelect = (e: any, selectedFieldType: any) => {
      handleChange({ target: { type: 'text', value: selectedFieldType.id, name: 'fieldTypeId' } });
      handleChange({ target: { type: 'text', value: selectedFieldType, name: 'fieldType' } });
      setShowOptions(selectedFieldType.name === 'Dropdown' || selectedFieldType.name === 'Checkbox' ? true : false);
   };

   const handleConfiguredListSelect = (e: any, selectedConfiguredList: any) => {
      handleChange({ target: { type: 'text', value: selectedConfiguredList.id, name: 'configuredListId' } });
      handleChange({ target: { type: 'text', value: selectedConfiguredList, name: 'configuredList' } });
   };

   const handleArchiveFieldOption = async (item: any) => {
      // instead of filtering out the one to archive... just add "archived": true to it & don't display that option if true
      const tempOptions = [...values.productFieldOptions].map((option: any) => {
         return {
            ...option,
            ...(option.displayOrder === item.displayOrder && { archived: true }),
         };
      });
      setValue('productFieldOptions', tempOptions);
   };

   const handleActionClick = ({ actionKey, item, newData }: any) => {
      switch (actionKey) {
         case 'moveup':
         case 'movedown':
            setValue('productFieldOptions', [...newData]);
            break;
         case 'delete':
            handleArchiveFieldOption(item);
            break;
         default:
            console.log('Action not recognized');
            break;
      }
   };

   const handleOptionInputChange = ({ event, item, column }: any) => {
      const tempOptions = [...values.productFieldOptions];
      const optionIndexToEdit = tempOptions.findIndex((op: any) => op.displayOrder === item.displayOrder);
      tempOptions[optionIndexToEdit].value = event.target.value;
      setValue('productFieldOptions', [...tempOptions]);
   };

   const handleAddOption = (e: any) => {
      const tempArr = [...values.productFieldOptions];
      const maxVal = tempArr.reduce((acc: any, val: any) => (acc = acc > val.displayOrder ? acc : val.displayOrder), 0);
      const newOption = [
         ...tempArr,
         { value: '', displayOrder: maxVal + 1, actionsConfig: { delete: true, moveup: true, movedown: false } },
      ];
      const tempOptions = sortList(newOption, 'displayOrder');
      setValue('productFieldOptions', [...tempOptions]);
   };

   const {
      handleSubmit,
      handleChange,
      handleBlur,
      values,
      setValue,
      errors,
      // setFormData,
      // formErrors,
   } = useForm({
      initialValues: field,
      validationSchema: yupSchema,
      onSubmit: handleFieldSave,
   });

   // hanlde showing the more configuration explainer
   useEffect(() => {
      if (values?.configuredList) {
         switch (values?.configuredList?.name) {
            case 'Users':
            case 'Proposals':
            case 'Proposal Options':
               setMoreConfiguration(true);
               break;
            default:
               setMoreConfiguration(false);
               break;
         }
      }

      if (moreConfiguration && values?.configuredList?.tableName === 'users') {
         setYupSchema((prevState: any) => ({
            ...prevState,
            whereCondition: Yup.object({ roles: Yup.array().of(Yup.object()) }).when('configuredList', {
               is: (configuredList: any) => configuredList,
               then: (schema: any) =>
                  Yup.object({
                     roles: Yup.array()
                        .of(Yup.object())
                        .min(1, `At least 1 role required`)
                        .max(5, `5 roles max`)
                        .required(`At least 1 role required`),
                  }).required('Field is required'),
               otherwise: (schema: any) => Yup.object().nullable(),
            }),
         }));
      } else if (moreConfiguration && values?.configuredList?.tableName === 'proposalOptions') {
         setYupSchema((prevState: any) => ({
            ...prevState,
            whereCondition: Yup.object({ fkToGroupBy: Yup.object() }).when('configuredList', {
               is: (configuredList: any) => configuredList,
               then: (schema: any) =>
                  Yup.object({
                     fkToGroupBy: Yup.object().required(`Must choose foreign key to group proposal options by.`),
                  }).required('Field is required'),
               otherwise: (schema: any) => Yup.object().nullable(),
            }),
         }));
      }
   }, [values?.configuredList, moreConfiguration]);

   const options = values?.productFieldOptions.length
      ? sortList(
           values.productFieldOptions.filter((option: any) => !option.archived),
           'displayOrder'
        )
      : [];

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Button data-test={'submitBtn'} color='blue' onClick={handleSubmit}>
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
               <Explainer description='Select input type. Then configure your input with a name, optional placeholder etc.'>
                  <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Configure Field</div>
                  <Grid>
                     <Grid columnCount={2} responsive>
                        <DropDown
                           data-test={'fieldType'}
                           label='Input Type'
                           options={fieldTypes || []}
                           // selectedValues={ formData?.fieldTypeId ? [fieldTypes.find((f: any) => f.id === formData.fieldTypeId)] : [] }
                           selectedValues={values?.fieldType && values?.fieldType?.name ? [values.fieldType] : []}
                           placeholder='Select Input Field Type'
                           keyPath={['name']}
                           // name is for error validation when using the useForm hook
                           name='fieldType'
                           onOptionSelect={handleFieldTypeSelect}
                           onBlur={handleBlur}
                           errorMessage={errors?.fieldType}
                           required
                        />
                        {values?.fieldType && values?.fieldType.name === 'Configurable List' && (
                           <DropDown
                              data-test={'configuredList'}
                              label='Configured List'
                              options={configuredLists || []}
                              // selectedValues={ formData?.fieldTypeId ? [fieldTypes.find((f: any) => f.id === formData.fieldTypeId)] : [] }
                              selectedValues={values?.configuredList?.name ? [values.configuredList] : []}
                              placeholder='Select Configurable List'
                              keyPath={['name']}
                              // name is for error validation when using the useForm hook
                              name='configuredList'
                              onOptionSelect={handleConfiguredListSelect}
                              onBlur={handleBlur}
                              errorMessage={errors?.configuredList}
                              required
                           />
                        )}
                     </Grid>
                     <Grid columnCount={2} responsive>
                        <Input
                           data-test={'label'}
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
                           data-test={'placeholder'}
                           name='placeholder'
                           label='Field Placeholder'
                           value={values?.placeholder || ''}
                           onChange={handleChange}
                           onBlur={handleBlur}
                           placeholder={'Enter Field Placeholder'}
                           errorMessage={errors?.placeholder}
                           required
                        />
                     </Grid>
                     {/* if there are options */}
                     {showOptions && (
                        <>
                           <div className='mt-2 text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>
                              {values?.fieldType?.name} Options
                              {/* {fieldTypes.find((fieldType: any) => fieldType.id === field.fieldTypeId)?.name} Options */}
                           </div>
                           <Grid>
                              <TableList
                                 data={options}
                                 columns={columns}
                                 rowReorder
                                 rowReorderKeyPath={['displayOrder']}
                                 onCellEvent={handleOptionInputChange}
                                 showChildButton
                                 childButtonCallback={handleAddOption}
                                 childButtonText='Add Selection'
                                 childButtonIconName='Plus'
                                 childButtonIconColor='gray'
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

               {/* <Explainer description='Share field across products and leads.'>
                  <Grid>
                     <ToggleSwitch
                        label='Make Lead Field'
                        name={'shareField'}
                        onChange={handleChange}
                        checked={values?.shareField}
                     />
                  </Grid>
               </Explainer> */}

               {/* If there are more configuration to be done... specifically for confiugred lists */}
               {moreConfiguration && (
                  <MoreConfiguration
                     originalWhereCondition={field?.whereCondition}
                     values={values}
                     handleChange={handleChange}
                     handleBlur={handleBlur}
                     errors={errors}
                     roles={roles}
                  />
               )}
            </Grid>
         </PageContainer>
         <LoadingBackdrop isOpen={isSaving} zIndex={101} />
      </>
   );
};

export default FieldClient;
