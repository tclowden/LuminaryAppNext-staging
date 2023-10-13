'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Grid from '../../../../../../../common/components/grid/Grid';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import { fetchDbApi } from '@/serverActions';
import LoadingSpinner from '@/common/components/loaders/loading-spinner/LoadingSpinner';
import MemoizedInput from './(fields-on-order-controlled-components)/MemoizedInput';
import MemoizedDropdown from './(fields-on-order-controlled-components)/MemoizedDropdown';
import MemoizedCheckbox from './(fields-on-order-controlled-components)/MemoizedCheckbox';
import { selectPageContext } from '@/store/slices/pageContext';
import MemoizedDatePicker from './(fields-on-order-controlled-components)/MemoizedDatePicker';

interface Props {
   handleChange: (e: any) => void;
   handleBlur: (e: any) => void;
   editOrderConfig: any;
   editOrderConfigErrors: any;
   resetTouched: () => void;
   setDebouncingValue: (bool: boolean) => void;
}

const FieldsOnOrder = ({
   handleChange,
   handleBlur,
   resetTouched,
   editOrderConfig,
   editOrderConfigErrors,
   setDebouncingValue,
}: Props) => {
   const user = useAppSelector(selectUser);
   const contextData = useAppSelector(selectPageContext);
   const { lead } = contextData;
   const [mountingData, setMountingData] = useState<boolean>(false);

   const { fieldsOnOrder, product } = editOrderConfig;
   const { fieldsOnProduct } = product;

   const fetchFieldsOnProd: any = async (productId: string, hideOnCreate?: boolean) => {
      const token = user?.token;
      const fieldsOnProductRes = await fetchDbApi(
         `/api/v2/products/${productId}/fields?hidden=false${hideOnCreate ? `&hideOnCreate=${hideOnCreate}` : ''}`,
         {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
         }
      );

      // create a new map of the fields that need configured list options
      const configuredListFieldsOnProducts = new Map();
      fieldsOnProductRes.forEach((fOO: any, i: number) => {
         if (fOO?.productField?.configuredList) configuredListFieldsOnProducts.set(i, fOO);
      });

      // loop through each field that needs configured list options
      for (const [key, value] of configuredListFieldsOnProducts) {
         const { productField } = value;
         const tableName = productField?.configuredList?.tableName;
         let body: any = {};
         let where = productField.whereCondition ? JSON.parse(productField?.whereCondition) : null;

         // some tables have special cases
         // for ex) proposalOptions need to only be pulled tied together by lead...
         // don't wanna pull down 80,000 proposal options lol
         if (tableName === 'proposalOptions' && where) {
            // parse out the '%' and replace with leadId
            if (Object.keys(where)[0] === 'leadId')
               body = { where: { leadId: lead?.id }, order: [['createdAt', 'DESC']] };
         } else if (tableName === 'users' && where) {
            // users need to be attached by the role selected when configuring the field
            // don't need to replace anything here... already saved with the proper roleIds
            body = { include: [{ model: 'roles', where: { id: where['roleId'] } }], order: [['firstName', 'ASC']] };
         } else body = { order: [['createdAt', 'DESC']] };

         // delete unncessary keys
         if (!body?.where) delete body['where'];
         if (!body?.include) delete body['include'];

         // fetch the data for the configured list
         const productFieldConfigurableListOptions = await fetchDbApi(
            `/api/v2/configured-lists/data/query?tableName=${tableName}`,
            {
               method: 'POST',
               headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
               body: JSON.stringify({ ...body, limit: 400 }),
            }
         );

         // using the key of the map, replace the ['productField']['productFieldConfigurableListOptions'] key in the original object within the original array
         fieldsOnProductRes[key]['productField']['productFieldConfigurableListOptions'] =
            productFieldConfigurableListOptions;
      }

      // return back the result
      return fieldsOnProductRes;
   };

   const fetchFieldsOnOrder: any = async (orderId: string) => {
      const token = user?.token;
      return await fetchDbApi(`/api/v2/orders/${orderId}/fields`, {
         method: 'GET',
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
   };

   // once heere... get the fields on product / fields on order
   useEffect(() => {
      type FieldOnOrder = {
         answer: any;
         id: string;
         oldId: number;
         orderId: string;
         productField: any;
         productFieldId: string;
      };

      type FieldOnProduct = {
         displayOrder: any;
         hidden: boolean;
         hideOnCreate: boolean;
         id: string;
         oldId: number;
         productField: any;
         productFieldId: string;
         required: boolean;
         stageOnProductConstraintId: string;
      };

      // get fields on product
      const runAsync = async () => {
         setMountingData(true);
         let tempFieldsOnProd: any = [];
         let tempFieldsOnOrder: any = [];

         if (editOrderConfig?.product) {
            tempFieldsOnProd = await fetchFieldsOnProd(
               editOrderConfig.product.id,
               editOrderConfig?.id ? undefined : true
            );
         }

         const fieldOnOrderTemplate = {
            fieldOnProduct: {},
            fieldOnProductId: null,
            answer: '',
            id: null,
            orderId: null,
            // productField: {},
            // productFieldId: null,
         };

         // on load, either pull in existing fields on order or copy the fieldOnProduct to the fieldOnOrder
         if (editOrderConfig?.editMode && editOrderConfig?.id) {
            // editing order
            tempFieldsOnOrder = await fetchFieldsOnOrder(editOrderConfig.id);

            // populate the rest of the fieldsOnOrder with fieldOnProduct that didn't get saved
            // due to migration or the answer being null, no reason to save the field on order
            const otherFieldsOnOrders = [...tempFieldsOnProd]
               .map((fieldOnProd: any) => {
                  const foundFieldOnOrder = tempFieldsOnOrder?.find(
                     (fieldOnOrder: any) => fieldOnOrder?.fieldOnProductId === fieldOnProd?.id
                  );
                  if (foundFieldOnOrder) {
                     // if found, all the fieldOnProd to the foundFieldOnOrder
                     return {
                        ...foundFieldOnOrder,
                        fieldOnProduct: fieldOnProd,
                     };
                  } else {
                     // create default fieldOnOrder obj
                     const copy = { ...fieldOnOrderTemplate };
                     copy['fieldOnProduct'] = { ...fieldOnProd };
                     copy['fieldOnProductId'] = fieldOnProd?.id;
                     // copy['productField'] = { ...fieldOnProd.productField };
                     // copy['productFieldId'] = fieldOnProd.productFieldId;
                     return copy;
                  }
               })
               .filter((fieldOnProd: any) => fieldOnProd);
            // const otherFieldsOnOrders = [...tempFieldsOnProd]
            //    .map((fieldOnProd: any) => {
            //       const foundFieldOnOrder = tempFieldsOnOrder?.find(
            //          (fieldOnOrder: any) => fieldOnOrder.productFieldId === fieldOnProd.productFieldId
            //       );
            //       if (foundFieldOnOrder) {
            //          // if found, all the fieldOnProd to the foundFieldOnOrder
            //          return {
            //             ...foundFieldOnOrder,
            //             fieldOnProduct: fieldOnProd,
            //          };
            //       } else {
            //          // create default fieldOnOrder obj
            //          const copy = { ...fieldOnOrderTemplate };
            //          copy['fieldOnProduct'] = { ...fieldOnProd };
            //          copy['productField'] = { ...fieldOnProd.productField };
            //          copy['productFieldId'] = fieldOnProd.productFieldId;
            //          return copy;
            //       }
            //    })
            //    .filter((fieldOnProd: any) => fieldOnProd);

            // add other fields on orders to final fields on order array
            // sort them by field on product display order
            if (!!otherFieldsOnOrders?.length) tempFieldsOnOrder = [...otherFieldsOnOrders];
         } else {
            tempFieldsOnOrder = [...tempFieldsOnProd].map((fieldOnProd: any) => ({
               fieldOnProduct: { ...fieldOnProd },
               fieldOnProductId: fieldOnProd?.id,
               answer: '',
               id: null,
               orderId: null,
               // productField: { ...fieldOnProd?.productField },
               // productFieldId: fieldOnProd?.productFieldId,
            }));
         }

         // set fields on product
         handleChange({
            target: {
               type: 'text',
               name: 'product',
               value: { ...editOrderConfig?.product, fieldsOnProduct: tempFieldsOnProd },
            },
         });

         // here fetch all the necessary configured list data for the fields on order
         // HANDLE:
         // -- proposal options related to the lead
         // -- users that we want to show... don't wanna grab all the users
         // -- essentially, on the product field level... wanna add more configuration for the configured lists

         // const fieldsNeedingConfiguredListsData = tempFieldsOnOrder.filter(
         //    (fOO: any) => fOO.fieldOnProduct.productField.configuredList
         // );
         // if (!!fieldsNeedingConfiguredListsData?.length) {
         //    const fetchConfiguredListData = async (fieldsOnOr: Array<any>) => {
         //       for (const fieldOnOrder of fieldsOnOr) {
         //          console.log('fieldOnOrder:', fieldOnOrder);
         //          const config = fieldOnOrder?.productField?.configuredList;
         //          const body = {
         //             include: [
         //                {
         //                   model: `${config?.tableName}`,
         //                   required: false,
         //                   ...(config?.tableName === 'proposalOptions' && { where: { leadId: lead?.id } }),
         //                },
         //             ],
         //          };

         //          let where = null;
         //          if (config?.tableName === 'proposalOptions') {
         //             where = { leadId: lead?.id };
         //          } else if (config?.tableName === '')

         //          // let res = await fetchDbApi(`/api/v2/configuredLists/query`, {
         //          //    method: 'POST',
         //          //    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
         //          //    body: JSON.stringify(body),
         //          // });
         //       }
         //    };
         //    await fetchConfiguredListData(fieldsNeedingConfiguredListsData);
         // }

         tempFieldsOnOrder = handleFieldValidationSetup(tempFieldsOnOrder, tempFieldsOnProd);

         const sortedFieldsOnOrder = tempFieldsOnOrder.sort(
            (a: any, b: any) => a.fieldOnProduct.displayOrder - b.fieldOnProduct.displayOrder
         );
         // setCurrFieldsOnOrder(sortedFieldsOnOrder);
         handleChange({
            target: {
               type: 'text',
               name: 'fieldsOnOrder',
               value: sortedFieldsOnOrder,
            },
         });

         setMountingData(false);
      };

      runAsync();

      // only fire use effect wenever the product changes... don't wanna keep fetching the fields unless new product
   }, [editOrderConfig?.product?.id]);

   const handleFieldValidationSetup = (fieldsOnOrder: Array<any>, fieldsOnProduct: Array<any>) => {
      // default fieldsOnOrder to save to config object
      let tempFieldsOnOrder: Array<any> = [];

      if (!!fieldsOnOrder?.length) {
         tempFieldsOnOrder = [...fieldsOnOrder].map((fieldOnOrder: any) => {
            // const foundFieldOnProduct = fieldsOnProduct.find(
            //    (fieldOnProd: any) => fieldOnProd?.productFieldId === fieldOnOrder?.productFieldId
            // );
            const foundFieldOnProduct = fieldsOnProduct.find(
               (fieldOnProd: any) => fieldOnProd?.id === fieldOnOrder?.fieldOnProductId
            );
            return {
               ...fieldOnOrder,
               // fieldOnProductId: foundFieldOnProduct?.id,
               answerIsRequired: foundFieldOnProduct.required,
               answer: fieldOnOrder?.answer !== null ? fieldOnOrder?.answer : '',
            };
         });
      } else {
         fieldsOnProduct?.forEach((fieldOnProd: any, i: number) => {
            tempFieldsOnOrder.push({
               answer: '',
               answerIsRequired: fieldOnProd.required,
               id: null,
               fieldOnProduct: { ...fieldOnProd },
               fieldOnProductId: fieldOnProd.id,
            });
         });
      }

      resetTouched();
      return tempFieldsOnOrder;
   };

   const handleInputChange = useCallback(
      (value: any, index: number) => {
         const fieldsOnOr = [...fieldsOnOrder];
         fieldsOnOr[index]['answer'] = value;
         handleChange({
            target: { type: 'text', value: fieldsOnOr, name: 'fieldsOnOrder' },
         });
      },
      [fieldsOnOrder]
   );

   return (
      <Grid columnCount={2} responsive breakPoint='sm'>
         {!mountingData && !!fieldsOnOrder?.length ? (
            fieldsOnOrder.map((fieldOnOrder: any, i: number) => {
               // const fieldTypeName = fieldOnOrder.productField.fieldType.name;
               const fieldTypeName = fieldOnOrder?.fieldOnProduct?.productField?.fieldType?.name;
               const isInput = fieldTypeName === 'Text' || fieldTypeName === 'Currency' || fieldTypeName === 'Number';
               // fieldTypeName === 'Date'

               // normal dropdowns use the productFieldOptionsTable
               // configurableLists use productFieldConfigurableListOptions which is configured from a table of all rows
               // for example... pulling all rows from financiers, utility compnaies, users... etc

               // the migration didn't handle converting dropdown to configurable list field type... so i added the or check
               const isConfigurableList =
                  fieldTypeName === 'Configurable List' || fieldOnOrder?.fieldOnProduct?.productField?.configuredListId;
               const isDropdown = fieldTypeName === 'Dropdown' && !isConfigurableList;
               const isCheckbox = fieldTypeName === 'Checkbox';
               const isDate = fieldTypeName === 'Date';

               let inputType = 'text';
               let isCurrencyInputType = false;
               if (isInput) {
                  // switch (fieldOnOrder.productField.fieldType.name) {
                  switch (fieldOnOrder?.fieldOnProduct?.productField?.fieldType?.name) {
                     case 'Text':
                        inputType = 'text';
                        break;
                     case 'Currency':
                        isCurrencyInputType = true;
                        inputType = 'number';
                        break;
                     case 'Number':
                        inputType = 'number';
                        break;
                     // case 'Date':
                     //    inputType = 'date';
                     //    break;
                     default:
                        console.log('no input type... hmm...');
                        break;
                  }
               }

               // restructure the name to be camelCase
               // const label = fieldOnOrder.productField?.label || '';
               const label = fieldOnOrder?.fieldOnProduct?.productField?.label || '';
               const configurableListKeyPath = [fieldOnOrder?.fieldOnProduct?.productField?.configuredList?.keyPath];

               // const configurableListOptions =
               //    fieldOnOrder?.productField?.label === 'State'
               //       ? [...fieldOnOrder?.fieldOnProduct?.productField?.productFieldConfigurableListOptions].filter(
               //            (option: any) => option.supported
               //         )
               //       : fieldOnOrder?.fieldOnProduct?.productField?.productFieldConfigurableListOptions;

               const configurableListOptions =
                  fieldOnOrder?.fieldOnProduct?.productField?.productFieldConfigurableListOptions;

               return (
                  <React.Fragment key={i}>
                     <Grid>
                        {isInput && (
                           <>
                              <MemoizedInput
                                 inputType={inputType}
                                 name={`fieldsOnOrder[${i}].answer`}
                                 label={label}
                                 answer={fieldOnOrder?.answer || ''}
                                 onChange={(value: any) => {
                                    handleInputChange(value, i);
                                 }}
                                 onBlur={handleBlur}
                                 required={fieldOnOrder?.fieldOnProduct?.required}
                                 errorMessage={editOrderConfigErrors[`fieldsOnOrder[${i}].answer`]}
                                 setDebouncingValue={setDebouncingValue}
                              />
                              {/* <Input
                                    type={inputType}
                                    name={`fieldsOnOrder[${i}].answer`}
                                    label={label}
                                    value={fieldOnOrder?.answer || ''}
                                    onChange={(e: any) => {
                                       fieldOnOrder.answer = e.target.value;
                                       // handleInputChange(e.target.value, i);
                                       handleChange({
                                          target: { type: 'text', value: fieldsOnOrder, name: 'fieldsOnOrder' },
                                       });
                                    }}
                                    onBlur={handleBlur}
                                    required={fieldOnOrder?.fieldOnProduct?.required}
                                    errorMessage={editOrderConfigErrors[`fieldsOnOrder[${i}].answer`]}
                                 /> */}
                           </>
                        )}
                        {isDropdown && (
                           <>
                              <MemoizedDropdown
                                 name={`fieldsOnOrder[${i}].answer`}
                                 label={label}
                                 options={fieldOnOrder?.fieldOnProduct?.productField?.productFieldOptions}
                                 keyPath={['value']}
                                 selectedValue={fieldOnOrder}
                                 selectedValueKeyPath={['answer']}
                                 onBlur={handleBlur}
                                 onChange={(selectedProductFieldOption: any) => {
                                    handleInputChange(selectedProductFieldOption?.answer, i);
                                 }}
                                 required={fieldOnOrder?.fieldOnProduct?.required}
                                 errorMessage={editOrderConfigErrors[`fieldsOnOrder[${i}].answer`]}
                                 setDebouncingValue={setDebouncingValue}
                              />
                              {/* <DropDown
                                 name={`fieldsOnOrder[${i}].answer`}
                                 label={label}
                                 options={fieldOnOrder.productField.productFieldOptions}
                                 keyPath={['value']}
                                 selectedValues={[fieldOnOrder]}
                                 selectedValueKeyPath={['answer']}
                                 onBlur={handleBlur}
                                 onOptionSelect={(e: any, selectedProductFieldOption: any) => {
                                    fieldOnOrder.answer = selectedProductFieldOption.value;
                                    // handleInputChange(selectedProductFieldOption.value, i);
                                    handleChange({
                                       target: { type: 'text', value: fieldsOnOrder, name: 'fieldsOnOrder' },
                                    });
                                 }}
                                 required={fieldOnOrder?.fieldOnProduct?.required}
                                 errorMessage={editOrderConfigErrors[`fieldsOnOrder[${i}].answer`]}
                              /> */}
                           </>
                        )}
                        {isConfigurableList && (
                           <>
                              <MemoizedDropdown
                                 type='configured-list'
                                 name={`fieldsOnOrder[${i}].answer`}
                                 label={label}
                                 options={configurableListOptions || []}
                                 keyPath={configurableListKeyPath}
                                 selectedValue={fieldOnOrder}
                                 selectedValueKeyPath={['answer']}
                                 onBlur={handleBlur}
                                 onChange={(selectedProductFieldOption: any) => {
                                    handleInputChange(selectedProductFieldOption?.answer, i);
                                 }}
                                 required={fieldOnOrder?.fieldOnProduct?.required}
                                 errorMessage={editOrderConfigErrors[`fieldsOnOrder[${i}].answer`]}
                                 setDebouncingValue={setDebouncingValue}
                              />

                              {/* <DropDown
                                    name={`fieldsOnOrder[${i}].answer`}
                                    label={label}
                                    options={configurableListOptions || []}
                                    keyPath={configurableListKeyPath}
                                    selectedValues={[fieldOnOrder]}
                                    selectedValueKeyPath={['answer']}
                                    onBlur={handleBlur}
                                    onOptionSelect={(e: any, selectedConfigurableListOption: any) => {
                                       const answer = getObjectProp(
                                          selectedConfigurableListOption,
                                          configurableListKeyPath
                                       );
                                       fieldOnOrder.answer = answer;
                                       handleChange({
                                          target: { type: 'text', value: fieldsOnOrder, name: 'fieldsOnOrder' },
                                       });
                                       // handleInputChange(answer, i);
                                    }}
                                    required={fieldOnOrder?.fieldOnProduct?.required}
                                    // errorMessage={editOrderConfigErrors[`fieldsOnOrder[${i}].answer`]}
                                 /> */}
                           </>
                        )}
                        {isDate && (
                           <>
                              <MemoizedDatePicker
                                 name={`fieldsOnOrder[${i}].answer`}
                                 label={label}
                                 answer={fieldOnOrder?.answer}
                                 onChange={(selectedDate: any) => {
                                    console.log('selectedDate:', selectedDate);
                                    handleInputChange(selectedDate, i);
                                 }}
                                 onBlur={handleBlur}
                                 errorMessage={editOrderConfigErrors[`fieldsOnOrder[${i}].answer`]}
                                 required={fieldOnOrder?.fieldOnProduct?.required}
                                 setDebouncingValue={setDebouncingValue}
                              />
                              {/* <DatePicker
                                 name={`fieldsOnOrder[${i}].answer`}
                                 label={label}
                                 date={fieldOnOrder?.answer}
                                 onDateSelect={(date: any, dateStr: string) => {
                                    console.log('date:', date);
                                    console.log('dateStr:', dateStr);
                                    //  handleChange({ target: { type: 'text', name: 'dueAt', value: dateStr } });
                                    handleInputChange(dateStr, i);
                                 }}
                                 dateFormat={'Y-m-d H:i:S'}
                                 errorMessage={editOrderConfigErrors[`fieldsOnOrder[${i}].answer`]}
                                 required={fieldOnOrder?.fieldOnProduct?.required}
                              /> */}
                           </>
                        )}
                        {isCheckbox && (
                           <>
                              <MemoizedCheckbox
                                 name={`fieldsOnOrder[${i}].answer`}
                                 label={label}
                                 onChange={(checked: boolean) => {
                                    fieldOnOrder.answer = checked;
                                    handleChange({
                                       target: { type: 'text', value: fieldsOnOrder, name: 'fieldsOnOrder' },
                                    });
                                    // handleInputChange(e.target.checked, i);
                                 }}
                                 checked={fieldOnOrder?.answer || false}
                                 required={fieldOnOrder?.fieldOnProduct?.required}
                                 setDebouncingValue={setDebouncingValue}
                              />

                              {/* <Checkbox
                                    name={`fieldsOnOrder[${i}].answer`}
                                    label={label}
                                    onChange={(e: any) => {
                                       fieldOnOrder.answer = e.target.checked;
                                       handleChange({
                                          target: { type: 'text', value: fieldsOnOrder, name: 'fieldsOnOrder' },
                                       });
                                       // handleInputChange(e.target.checked, i);
                                    }}
                                    checked={fieldOnOrder?.answer || false}
                                    required={fieldOnOrder?.fieldOnProduct?.required}
                                 /> */}
                           </>
                        )}
                     </Grid>
                  </React.Fragment>
               );
            })
         ) : mountingData ? (
            <LoadingSpinner size={40} isOpen />
         ) : (
            <div>No fields for this product.</div>
         )}
      </Grid>
   );
};

export default FieldsOnOrder;
