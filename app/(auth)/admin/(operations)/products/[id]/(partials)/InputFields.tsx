'use client';
import React, { useEffect, useState } from 'react';
import Panel from '../../../../../../../common/components/panel/Panel';
import SearchBar from '../../../../../../../common/components/search-bar/SearchBar';
import Table from '../../../../../../../common/components/table/Table';
// import Table from '../../../../../../../common/components/table-copy/Table';
import { ColumnType } from '../../../../../../../common/components/table/tableTypes';
import { useAppDispatch, useAppSelector } from '../../../../../../../store/hooks';
import { selectUser } from '../../../../../../../store/slices/user';
import ConfirmModal from '../../../../../../../common/components/confirm-modal/ConfirmModal';
import { selectPageContext, setPageContext } from '@/store/slices/pageContext';
import { fetchFieldsOnProduct, fetchProductFields, handleResults } from './utilities';
import { formatFieldsOnProduct } from './formatters';
import MemoizedCheckbox from './MemoizedCheckbox';
import { getObjectProp, setObjectProp } from '@/utilities/helpers';

const configureActions = (arr: Array<any>) => {
   // separate out the archived:true objects
   const itemsToIgnore = [...arr].filter((obj: any) => obj.archived);
   const copy = [...arr].filter((obj: any) => !obj.archived);

   // sort by displayOrder
   // create the actionsConfig
   const configuredArr = copy
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
      .map((obj: any, i: number) => {
         const initVal = copy[0].displayOrder;
         const maxVal = copy.reduce((acc: any, val: any) => {
            return (acc = acc > val.displayOrder ? acc : val.displayOrder);
         }, initVal);
         const minVal = copy.reduce((acc: any, val: any) => {
            return (acc = acc < val.displayOrder ? acc : val.displayOrder);
         }, initVal);
         return {
            ...obj,
            actionsConfig: {
               delete: true,
               moveup: obj.displayOrder === minVal ? false : true,
               movedown: obj.displayOrder === maxVal ? false : true,
            },
         };
      });

   // combine back the arrays
   return [...configuredArr, ...itemsToIgnore];
};

const columns: ColumnType[] = [
   { keyPath: ['productField', 'typeIcon'], title: 'Input Type', colSpan: 1 },
   { keyPath: ['productField', 'label'], title: 'Field Label', colSpan: 2 },
   { keyPath: ['productField', 'placeholder'], title: 'Placeholder Text', colSpan: 1 },
   {
      keyPath: ['required'],
      title: 'Required',
      colSpan: 1,
      ellipsis: false,
      render: ({ item, callback }: any) => {
         return <MemoizedCheckbox name='required' isChecked={item?.required} callback={callback} />;
      },
   },
   {
      keyPath: ['hidden'],
      title: 'Hidden',
      colSpan: 1,
      ellipsis: false,
      render: ({ item, callback }: any) => {
         return <MemoizedCheckbox name='hidden' isChecked={item?.hidden} callback={callback} />;
      },
   },
   {
      keyPath: ['hideOnCreate'],
      title: 'Hide On Create',
      colSpan: 1,
      ellipsis: false,
      render: ({ item, callback }: any) => {
         return <MemoizedCheckbox name='hideOnCreate' isChecked={item?.hideOnCreate} callback={callback} />;
      },
   },
];

interface Props {
   fieldsOnProduct: Array<any>;
   fieldsOnProductCount: number;
   stagesOnProductOther: Array<any>;
   stagesOnProductRequired: Array<any>;
   setValue: (name: string, value: any) => void;
   setMultiValues: (values: any) => void;
}

const InputFields = ({
   fieldsOnProduct,
   fieldsOnProductCount,
   stagesOnProductOther,
   stagesOnProductRequired,
   setValue,
   setMultiValues,
}: Props) => {
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);

   const { product, fields } = useAppSelector(selectPageContext);

   const [fetchDataInit, setFetchDataInit] = useState<boolean>(false);
   const [openAddFieldOptions, setOpenAddFieldOptions] = useState<boolean>(false);
   const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
   const [fieldToRemove, setFieldToRemove] = useState<any>({});
   const [fieldSearchVal, setFieldSearchVal] = useState<string>('');

   useEffect(() => {
      const runAsync = async () => {
         // fetch all product fields
         // doing this on client for speed purposes
         // if (!fields.fetched && !containersCollapsed) {
         if (!fields.fetched && fetchDataInit) {
            console.log('fetching fields...');

            let tempFields: any = fetchProductFields(user?.token || undefined);

            let tempFieldsOnProduct: any = [];
            const fieldsOnProductAlreadyFetched = !!fieldsOnProduct?.length;

            if (fieldsOnProductAlreadyFetched) tempFieldsOnProduct = [...fieldsOnProduct];
            else tempFieldsOnProduct = fetchFieldsOnProduct(user?.token || undefined, product?.id);

            [tempFields, tempFieldsOnProduct] = await Promise.allSettled([tempFields, tempFieldsOnProduct])
               .then(handleResults)
               .catch((err) => {
                  console.log('err', err);
               });

            tempFieldsOnProduct = formatFieldsOnProduct(tempFieldsOnProduct);

            dispatch(setPageContext({ fields: { data: tempFields, fetched: true } }));
            setValue('fieldsOnProduct', configureActions(tempFieldsOnProduct));
         }
      };

      runAsync();
      // }, [containersCollapsed, fields]);
   }, [fetchDataInit, fields]);

   const handleDeleteField = (item: any) => {
      // whenever a field is removed,
      // need to go through everything dependant on the field & remove it from that list as well
      // dependants --> stages

      // remove the field from the product
      let fieldOnProdIndex: number;
      const tempFieldsOnProd = [...fieldsOnProduct].map((field: any, i: any) => {
         const copy = { ...field };
         if (field.productFieldId === item.productFieldId) {
            fieldOnProdIndex = i;
            copy['archived'] = true;
         }
         return copy;
      });
      const tempStagesOnProd = [...stagesOnProductRequired, ...stagesOnProductOther].map((stage: any) => ({
         ...stage,
         requiredFieldsOnProduct: [...stage.requiredFieldsOnProduct].map((reqField: any) => {
            const copy = { ...reqField };
            const found =
               typeof fieldOnProdIndex !== undefined &&
               tempFieldsOnProd[fieldOnProdIndex].productFieldId === reqField.productFieldId;
            if (found) copy['archived'] = true;
            return copy;
         }),
      }));
      // refilter the required from other stages
      const tempStagesOnProdRequired = tempStagesOnProd.filter((stageOnProd: any) => stageOnProd.required);
      const tempStagesOnProdOther = tempStagesOnProd.filter((stageOnProd: any) => !stageOnProd.required);
      setMultiValues({
         fieldsOnProduct: configureActions(tempFieldsOnProd),
         stagesOnProductRequired: tempStagesOnProdRequired,
         stagesOnProductOther: tempStagesOnProdOther,
      });
   };

   const handleActionClick = ({ actionKey, item, newData }: any) => {
      switch (actionKey) {
         case 'moveup':
         case 'movedown':
            if (!!!newData.length) return;
            setValue('fieldsOnProduct', [...newData]);
            break;
         case 'delete':
            setOpenConfirmModal(true);
            setFieldToRemove(item);
            // handleDeleteField(item);
            break;
         default:
            break;
      }
   };

   const handleAddField = (e: any, fieldToAdd: any) => {
      // make a copy
      let tempFieldsOnProduct = [...fieldsOnProduct];
      // see if the field existed at one point within the product
      // e.g. they deleted the field then added it back
      const fieldFoundIndex = tempFieldsOnProduct.findIndex(
         (fieldOnProd: any) => fieldOnProd.productFieldId === fieldToAdd.id
      );
      // get the max displayOrder value
      const maxOrderVal = tempFieldsOnProduct.reduce(
         (acc: any, val: any) => (acc = acc > val.displayOrder ? acc : val.displayOrder),
         0
      );
      if (fieldFoundIndex !== -1) {
         // if found...
         // grab the element & splice it out of origianl array
         const tempField = tempFieldsOnProduct.splice(fieldFoundIndex, 1)[0];
         // set the archived key from the obj to false
         tempField['archived'] = false;
         // // remove the archived:true key from the obj
         // delete tempField['archived'];
         // change displayOrder
         tempField['displayOrder'] = maxOrderVal + 1;

         // currently, most using this is sorting by display order... but for now, i'll still add to the end of the array
         // might want to change this to not add to the end of the array if already exists... but for now, i think it's fine
         // move the item to the end of the array
         tempFieldsOnProduct.push(tempField);
      } else {
         // if not found... add the object
         tempFieldsOnProduct.push({
            displayOrder: maxOrderVal + 1,
            hidden: false,
            hideOnCreate: false,
            required: false,
            productFieldId: fieldToAdd.id,
            productField: {
               ...fieldToAdd,
               typeIcon: {
                  value: fieldToAdd.fieldType.name,
                  iconConfig: { name: fieldToAdd.fieldType.iconName, color: fieldToAdd.fieldType.iconColor },
               },
            },
         });
      }
      setValue('fieldsOnProduct', configureActions(tempFieldsOnProduct));
      setOpenAddFieldOptions(false);
      setFieldSearchVal('');
   };

   const handleCellEvent = ({ event, item, column }: any) => {
      const tempFieldsOnProd = [...fieldsOnProduct].map((fieldOnProd: any) => ({
         ...fieldOnProd,
         ...(item.productFieldId === fieldOnProd.productFieldId && { [event.target.name]: event.target.checked }),
      }));
      setValue('fieldsOnProduct', tempFieldsOnProd);
   };

   // create a filtered array for the fields to select to add to product
   const fieldSearchResults = [...fields?.data].filter((field: any) => {
      const coordExists = fieldsOnProduct?.find((cp: any) => cp.productFieldId === field.id && !cp.archived);
      if (!coordExists) return field.label.toLowerCase().includes(fieldSearchVal?.toLowerCase());
   });

   return (
      <>
         <Panel
            title={`Input Fields (${fieldsOnProductCount})`}
            collapsible
            // isCollapsed={typeof containersCollapsed === 'boolean' ? containersCollapsed : false}
            // onCollapseBtnClick={() => onContainerCollapse(!containersCollapsed)}
            isCollapsed
            onCollapseBtnClick={() => {
               setFetchDataInit(true);
            }}
            showChildButton={fields?.fetched}
            childBtnDataTestAttribute='addFieldChildBtn'
            disableChildButton={!!!fieldSearchResults.length}
            childButtonText={openAddFieldOptions ? 'Close' : 'Add Input Field'}
            childButtonCallback={(e: any) => {
               setOpenAddFieldOptions(!openAddFieldOptions);
               setFieldSearchVal('');
            }}
            childButtonChildren={
               <>
                  {openAddFieldOptions && (
                     <SearchBar
                        placeholder='Search'
                        handleChange={(e: any) => {
                           setFieldSearchVal(e.target.value);
                        }}
                        searchResults={fieldSearchResults}
                        searchValue={fieldSearchVal}
                        keyPath={['label']}
                        onSelectSearchResult={handleAddField}
                        defaultShowOptions
                        listContainerMaxHeight={200}
                     />
                  )}
               </>
            }>
            {/* {fieldsOnProduct.map((fieldOnProd: any, i: number) => {
               return (
                  <div
                     onClick={() => {
                        console.log('clicked');
                        const copy = JSON.parse(JSON.stringify(fieldsOnProduct));
                        // reorder it
                        const currPositionIndex = i;
                        const otherIndexDiff = 1;
                        const otherPosIndex = currPositionIndex + otherIndexDiff;

                        console.log('currPositionIndex:', currPositionIndex);
                        console.log('otherPosIndex:', otherPosIndex);

                        // get the two values to change
                        const val1 = getObjectProp(copy[otherPosIndex], ['displayOrder']);
                        const val2 = getObjectProp(copy[currPositionIndex], ['displayOrder']);

                        // change the data array to match
                        setObjectProp(copy[currPositionIndex], ['displayOrder'], val1);
                        setObjectProp(copy[otherPosIndex], ['displayOrder'], val2);

                        console.log('copy[currPositionIndex]:', copy[currPositionIndex]);
                        console.log('copy[otherPosIndex]:', copy[otherPosIndex]);

                        const temp = copy[currPositionIndex];
                        copy[currPositionIndex] = copy[otherPosIndex];
                        copy[otherPosIndex] = temp;

                        setValue('fieldsOnProduct', configureActions(copy));
                     }}>
                     {fieldOnProd.productField?.label}
                  </div>
               );
            })} */}
            <Table
               theme='secondary'
               isLoading={!fields?.fetched}
               loadingTableHeight={160}
               hideHeader={!fields?.fetched || !fieldsOnProduct?.filter((f: any) => !f.archived).length}
               columns={columns}
               data={fieldsOnProduct?.filter((coord: any) => !coord.archived)}
               // data={fieldsOnProduct}
               rowReorder
               rowReorderKeyPath={['displayOrder']}
               onCellEvent={handleCellEvent}
               actions={[
                  { icon: 'UnionUp', actionKey: 'moveup', toolTip: 'Move Up', callback: handleActionClick },
                  { icon: 'UnionDown', actionKey: 'movedown', toolTip: 'Move Down', callback: handleActionClick },
                  {
                     icon: 'TrashCan',
                     actionKey: 'delete',
                     toolTip: 'Delete Field',
                     callback: handleActionClick,
                  },
               ]}
            />
         </Panel>
         <ConfirmModal
            open={openConfirmModal}
            handleOnClose={(e: any) => {
               setOpenConfirmModal(!openConfirmModal);
            }}
            handleOnConfirm={(e: any) => {
               setOpenConfirmModal(false);
               handleDeleteField(fieldToRemove);
            }}
            value={'input field, "' + fieldToRemove?.productField?.label + '"'}
         />
      </>
   );
};

export default InputFields;
