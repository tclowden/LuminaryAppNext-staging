'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import ChipButton from '../../../../../../../common/components/chip-button/ChipButton';
import Chip from '../../../../../../../common/components/chip/Chip';
import DropDown from '../../../../../../../common/components/drop-down/DropDown';
import Grid from '../../../../../../../common/components/grid/Grid';
import Input from '../../../../../../../common/components/input/Input';
import Modal from '../../../../../../../common/components/modal/Modal';
import Panel from '../../../../../../../common/components/panel/Panel';
import Table from '../../../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../../../common/components/table/tableTypes';
import ToggleSwitch from '../../../../../../../common/components/toggle-switch/ToggleSwitch';
import useForm, { YupSchemaObject } from '../../../../../../../common/hooks/useForm';
import { useAppDispatch, useAppSelector } from '../../../../../../../store/hooks';
import { selectUser } from '../../../../../../../store/slices/user';
import ConfirmModal from '../../../../../../../common/components/confirm-modal/ConfirmModal';
import { selectPageContext, setPageContext } from '@/store/slices/pageContext';

import {
   fetchFieldsOnProduct,
   fetchRoles,
   fetchStages,
   fetchStagesOnProduct,
   fetchTaskDueDateTypes,
   fetchTasksOnProduct,
   handleResults,
} from './utilities';
import { formatStagesOnProduct, formatTasksOnProduct } from './formatters';
import { setAddToast } from '@/store/slices/toast';

const configureActions = (arr: Array<any>) => {
   // separate out the archived:true objects
   const itemsToIgnore = [...arr].filter((obj: any) => obj.archived);
   // need to separate required & not required
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
               edit: true,
               delete: true,
               moveup: obj.displayOrder === minVal ? false : true,
               movedown: obj.displayOrder === maxVal ? false : true,
            },
         };
      });

   return [...configuredArr, ...itemsToIgnore];
};

const configStageValidationSchema: YupSchemaObject<any> = {
   productStage: Yup.object().required(),
   daysToComplete: Yup.number(),
   scheduled: Yup.string().required(),
};

const columns: ColumnType[] = [
   { keyPath: ['productStage', 'name'], title: 'Stage Name', colSpan: 1 },
   {
      keyPath: ['daysToCompleteString'],
      title: 'Estimated Completion',
      colSpan: 1,
   },
   { keyPath: ['requirementCount'], title: 'Requirements', colSpan: 1 },
   {
      keyPath: ['scheduled'],
      title: 'Scheduled Stage?',
      colSpan: 1,
      render: ({ item }: any) => (item.scheduled ? 'Yes' : 'No'),
   },
];

const initEditStageConfig = {
   scheduled: false,
   daysToComplete: 0,
   requiredTasksOnProduct: [],
   requiredFieldsOnProduct: [],
   excludedRoles: [],
   editMode: false,
   required: false,
};

interface Props {
   stagesOnProduct: Array<any>;
   stagesOnProductCount: number;
   stagesOnProductRequiredCount: number;
   stagesOnProductOtherCount: number;
   stagesOnProductRequired: Array<any>;
   stagesOnProductOther: Array<any>;
   setValue: (name: string, value: any) => void;
   setMultiValues: (values: any) => void;
   tasksOnProduct: Array<any>;
   fieldsOnProduct: Array<any>;
}
const Stages = ({
   stagesOnProduct,
   stagesOnProductRequiredCount,
   stagesOnProductOtherCount,
   stagesOnProductOther,
   stagesOnProductRequired,
   setValue,
   setMultiValues,
   tasksOnProduct,
   fieldsOnProduct,
}: Props) => {
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   const { product, stages, roles, taskDueDateTypes } = useAppSelector(selectPageContext);

   const [fetchDataInit, setFetchDataInit] = useState<boolean>(false);
   const [openAddStageModal, setOpenAddStageModal] = useState<boolean>(false);
   const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
   const [stageToRemove, setStageToRemove] = useState<any>({});

   useEffect(() => {
      const runAsync = async () => {
         if (!stages?.fetched && fetchDataInit) {
            console.log('fetching stages...');

            let tempStages: any = fetchStages(user?.token || undefined);
            let tempRoles: any = fetchRoles(user?.token || undefined);
            let tempTasksDueDateTypes: any = [];

            const taskDueDateTypesAlreadyFetched = taskDueDateTypes?.fetched;
            if (taskDueDateTypesAlreadyFetched) tempTasksDueDateTypes = [...taskDueDateTypes?.data];
            else tempTasksDueDateTypes = fetchTaskDueDateTypes(user?.token || undefined);

            let tempStagesOnProduct: any = [];
            let tempFieldsOnProduct: any = [];
            let tempTasksOnProduct: any = [];

            const fieldsOnProductAlreadyFetched = !!fieldsOnProduct?.length;
            const tasksOnProductAlreadyFetched = !!tasksOnProduct?.length;

            if (product?.id) {
               if (!!stagesOnProduct?.length) tempStagesOnProduct = [...stagesOnProduct];
               else tempStagesOnProduct = fetchStagesOnProduct(user?.token || undefined, product?.id);

               if (fieldsOnProductAlreadyFetched) tempFieldsOnProduct = [...fieldsOnProduct];
               else tempFieldsOnProduct = fetchFieldsOnProduct(user?.token || undefined, product?.id);

               if (tasksOnProductAlreadyFetched) tempTasksOnProduct = [...tasksOnProduct];
               else tempTasksOnProduct = fetchTasksOnProduct(user?.token || undefined, product?.id);
            }

            [
               tempStages,
               tempRoles,
               tempStagesOnProduct,
               tempFieldsOnProduct,
               tempTasksOnProduct,
               tempTasksDueDateTypes,
            ] = await Promise.allSettled([
               tempStages,
               tempRoles,
               tempStagesOnProduct,
               tempFieldsOnProduct,
               tempTasksOnProduct,
               tempTasksDueDateTypes,
            ])
               .then(handleResults)
               .catch((err) => {
                  console.log('err', err);
               });

            if (product?.id) {
               tempTasksOnProduct = formatTasksOnProduct(tempTasksOnProduct, tempTasksDueDateTypes);
               console.log('tempFieldsOnProduct:', tempFieldsOnProduct);
               tempStagesOnProduct = formatStagesOnProduct(
                  tempStagesOnProduct,
                  tempFieldsOnProduct,
                  tempTasksOnProduct
               );
            } else {
               // // default a stage on product (beginning stage)
               // const beginningStage = tempStages.find((stage: any) => stage?.name === 'Beginning Stage');
               // tempStagesOnProduct = formatStagesOnProduct([
               //    {
               //       displayOrder: 1,
               //       excludedRoles: [],
               //       productStage: beginningStage,
               //       productStageId: beginningStage?.id,
               //       required: false,
               //       scheduled: false,
               //       timeline: '0',
               //    },
               // ]);
            }

            // split array into 2 arrays... 1 required, 1 not required
            const copyRequiredStagesOnProd = tempStagesOnProduct.filter((stageOnProd: any) => stageOnProd.required);
            const copyOtherStagesOnProd = tempStagesOnProduct.filter((stageOnProd: any) => !stageOnProd.required);

            const dataToStoreInProductObj = {
               stagesOnProductRequired: configureActions(copyRequiredStagesOnProd),
               stagesOnProductOther: configureActions(copyOtherStagesOnProd),
               ...(!fieldsOnProductAlreadyFetched && !!product?.id && { fieldsOnProduct: tempFieldsOnProduct }),
               ...(!tasksOnProductAlreadyFetched && !!product?.id && { tasksOnProduct: tempTasksOnProduct }),
            };

            dispatch(
               setPageContext({
                  roles: { fetched: true, data: tempRoles },
                  stages: { fetched: true, data: tempStages },
                  ...(!taskDueDateTypesAlreadyFetched && {
                     taskDueDateTypes: { fetched: true, data: tempTasksDueDateTypes },
                  }),
               })
            );
            setMultiValues(dataToStoreInProductObj);
         }
      };

      runAsync();
   }, [fetchDataInit, stages]);

   const handleDeleteStage = (item: any, keyString: string) => {
      // whenever a stage is removed,
      // need to go through the tasks & fields with that stage constraint & remove the constraint
      // the server is deleting the fieldsOnProduct & tasksOnProduct rows... so for now, we don't have to do anything
      // need to alter the fields & coordinators tho... if a stage gets deleted, wanna make sure to change the field & coord to allowed to be selected by another stage
      // add the archived:true to requiredFieldsOnProudct, requiredTasksOnProduct, & excludedRoles related to the stage

      const obj = {
         stagesOnProductRequired: [...stagesOnProductRequired],
         stagesOnProductOther: [...stagesOnProductOther],
      };

      // remove the stage from the product
      const arrCopy = [...obj[keyString as keyof object]].map((stage: any) => {
         return {
            ...stage,
            ...(stage.productStageId === item.productStageId && {
               archived: true,
               requiredFieldsOnProduct: [...stage.requiredFieldsOnProduct].map((reqFieldOnProd: any) => ({
                  ...reqFieldOnProd,
                  archived: true,
               })),
               requiredTasksOnProduct: [...stage.requiredTasksOnProduct].map((reqTaskOnProd: any) => ({
                  ...reqTaskOnProd,
                  archived: true,
               })),
            }),
         };
      });
      setValue(`${keyString}`, configureActions(arrCopy));
   };

   const handleActionClick = ({ actionKey, item, newData, table }: any) => {
      const keyString = table === 'required' ? 'stagesOnProductRequired' : 'stagesOnProductOther';
      switch (actionKey) {
         case 'moveup':
         case 'movedown':
            if (!!!newData.length) return;
            setValue(`${keyString}`, [...newData]);
            break;
         case 'edit':
            console.log('item:', item);
            setEditStageConfig({ ...item, editMode: true });
            setOpenAddStageModal(true);
            break;
         case 'delete':
            // setOpenConfirmModal
            setOpenConfirmModal(true);
            setStageToRemove({ ...item, keyString: keyString });
            break;
         default:
            break;
      }
   };

   const handleAddStage: any = (e: any, stageOnProdToAdd: any) => {
      // mkae a copy
      let tempStagesOnProduct = [...stagesOnProductRequired, ...stagesOnProductOther];

      const dataToWrite = { ...stageOnProdToAdd };

      // add more details to the object for the table
      dataToWrite['daysToCompleteString'] = `${dataToWrite.daysToComplete} days`;
      dataToWrite['requirementCount'] =
         dataToWrite.requiredFieldsOnProduct.filter((rf: any) => !rf.archived).length +
         dataToWrite.requiredTasksOnProduct.filter((rt: any) => !rt.archived).length;

      if (dataToWrite.editMode) {
         // if editing a stage on product
         // get the index of the stage to edit
         let stageOnProdToEditIndex = tempStagesOnProduct.findIndex(
            (stageOnProd: any) => stageOnProd.productStageId === dataToWrite.productStageId
         );

         // if it doesn't exist... recurse this function, but change editMode to false
         if (stageOnProdToEditIndex === -1) {
            dataToWrite['editMode'] = false;
            return handleAddStage(e, dataToWrite);
         }

         // just set the task on stageOnProdToEditIndex to the stageOnProdToAdd to get all the updated data
         tempStagesOnProduct[stageOnProdToEditIndex] = dataToWrite;
         tempStagesOnProduct[stageOnProdToEditIndex].productStageId = dataToWrite.productStage.id;
      } else {
         // if creating a stage
         // add the productStageId
         dataToWrite['productStageId'] = dataToWrite.productStage.id;
         // get the max displayOrder value
         const maxOrderVal = tempStagesOnProduct.reduce(
            (acc: any, val: any) => (acc = acc > val.displayOrder ? acc : val.displayOrder),
            0
         );

         // set the displayOrder to the object
         dataToWrite['displayOrder'] = maxOrderVal + 1;

         // add the object to the end of the array
         tempStagesOnProduct.push(dataToWrite);
      }

      // remove the editMode key value
      delete dataToWrite['editMode'];
      // setValue(`${keyString}`, configureActions(tempStagesOnProduct));

      // split array into 2 arrays... 1 required, 1 not required
      const copyRequiredStagesOnProd = tempStagesOnProduct.filter((stageOnProd: any) => stageOnProd.required);
      const copyOtherStagesOnProd = tempStagesOnProduct.filter((stageOnProd: any) => !stageOnProd.required);
      setMultiValues({
         stagesOnProductRequired: configureActions(copyRequiredStagesOnProd),
         stagesOnProductOther: configureActions(copyOtherStagesOnProd),
      });

      // close modal
      setOpenAddStageModal(false);
      // reset the obj
      // setEditStageConfig(initEditStageConfig);
      resetEditStageConfig(initEditStageConfig);
   };

   const handleAddChip = (objToAdd: any, arrayKey: string, alreadyExistsIndex: number) => {
      // make a copy
      const arrCopy = [...editStageConfig[arrayKey]];
      // make a copy of the object...
      // if you don't it will update the original object which will cause errors
      const dataToWrite = { ...objToAdd };

      // change the archived key value from the obj to false
      dataToWrite['archived'] = false;
      // // remove the delete:true key value from the obj
      // delete dataToWrite['delete'];

      if (alreadyExistsIndex !== -1) {
         // if already exists in the array, splice it out of the original array
         arrCopy.splice(alreadyExistsIndex, 1)[0];
      }
      // push the item to the end of the array
      arrCopy.push(dataToWrite);
      setEditStageConfig({ [arrayKey]: arrCopy });
   };

   const handleRemoveChip = (arrayKey: string, objIndex: number) => {
      // get copy of array
      const arrCopy = [...editStageConfig[arrayKey]];
      arrCopy[objIndex]['archived'] = true;
      setEditStageConfig({ [arrayKey]: arrCopy });
   };

   const {
      values: editStageConfig,
      handleChange,
      handleBlur,
      handleSubmit,
      setMultiValues: setEditStageConfig,
      errors: editStageConfigErrors,
      resetValues: resetEditStageConfig,
   } = useForm({
      initialValues: initEditStageConfig,
      validationSchema: configStageValidationSchema,
      onSubmit: handleAddStage,
   });

   // find all the tasks on product that aren't currently selected for the required tasks on stage
   const tasksOnProductChipButtonOptions = tasksOnProduct?.filter((task: any) => {
      const found = editStageConfig.requiredTasksOnProduct?.find(
         (rt: any) => rt.productTaskId === task.productTaskId && !rt.archived
      );
      const usedOnAnotherStage = [...stagesOnProductRequired, ...stagesOnProductOther].some((sop: any) =>
         sop.requiredTasksOnProduct?.find((rtop: any) => rtop.productTaskId === task.productTaskId && !rtop.archived)
      );
      return !found && !usedOnAnotherStage && !task.archived;
   });

   // find all the fields on product that aren't currently selected for the required fields on stage
   const fieldsOnProductChipButtonOptions = fieldsOnProduct?.filter((field: any) => {
      const found = editStageConfig.requiredFieldsOnProduct?.find(
         (rf: any) => rf.productFieldId === field.productFieldId && !rf.archived
      );
      const usedOnAnotherStage = [...stagesOnProductRequired, ...stagesOnProductOther].some((sop: any) =>
         sop.requiredFieldsOnProduct?.find(
            (rfop: any) => rfop.productFieldId === field.productFieldId && !rfop.archived
         )
      );
      return !found && !usedOnAnotherStage && !field.archived;
   });

   // find all the roles that aren't currently selected for the excluded roles on stage
   const rolesChipButtonOptions = roles?.data?.filter(
      (role: any) => !editStageConfig.excludedRoles?.find((rf: any) => rf.roleId === role.id && !rf.archived)
   );

   // create a filtered array for the products stages to select to add to product
   const productStagesNotUsed = [...stages?.data]?.filter((prodStage: any) => {
      const stageExists = [...stagesOnProductRequired, ...stagesOnProductOther]?.find(
         (sp: any) => sp.productStageId === prodStage.id && !sp.archived
      );
      if (!stageExists) return prodStage;
   });

   // const requiredStages = stagesOnProductRequired?.filter((stage: any) => !stage.archived);
   const otherStages = stagesOnProductOther?.filter((stageOnProd: any) => !stageOnProd.archived);

   return (
      <>
         {/* REQUIRED STAGES */}
         <>
            {/* <Panel
            title={`Required Stages (${stagesOnProductRequiredCount ?? 0})`}
            collapsible
            // isCollapsed={requiredCollapsed}
            // onCollapseBtnClick={() => onContainerCollapse(!requiredCollapsed, 'required')}
            isCollapsed
            onCollapseBtnClick={() => {
               setFetchDataInit(true);
            }}
            showChildButton={stages?.fetched}
            disableChildButton={!!!productStagesNotUsed?.length}
            childButtonText={'Add Required Stage'}
            childButtonCallback={(e: any) => {
               // setEditStageConfig((prevState: any) => ({ ...prevState, required: true }));
               setEditStageConfig({ required: true });
               setOpenAddStageModal(!openAddStageModal);
            }}>
            <Table
               theme='secondary'
               isLoading={!stages?.fetched}
               loadingTableHeight={160}
               hideHeader={!stages?.fetched || !requiredStages?.length}
               columns={columns}
               data={requiredStages}
               rowReorder
               rowReorderKeyPath={['displayOrder']}
               actions={[
                  {
                     icon: 'UnionUp',
                     actionKey: 'moveup',
                     toolTip: 'Move Up',
                     callback: (args: any) => handleActionClick({ ...args, table: 'required' }),
                  },
                  {
                     icon: 'UnionDown',
                     actionKey: 'movedown',
                     toolTip: 'Move Down',
                     callback: (args: any) => handleActionClick({ ...args, table: 'required' }),
                  },
                  {
                     icon: 'Edit',
                     actionKey: 'edit',
                     toolTip: 'Edit Stage',
                     callback: (args: any) => handleActionClick({ ...args, table: 'required' }),
                  },
                  {
                     icon: 'TrashCan',
                     actionKey: 'delete',
                     toolTip: 'Delete Stage',
                     callback: (args: any) => handleActionClick({ ...args, table: 'required' }),
                  },
               ]}
            />
         </Panel> */}
         </>
         {/* OTHER STAGES */}
         <Panel
            title={`Stages (${stagesOnProductOtherCount})`}
            collapsible
            // isCollapsed={otherCollapsed}
            // onCollapseBtnClick={() => onContainerCollapse(!otherCollapsed, 'other')}
            isCollapsed
            onCollapseBtnClick={() => {
               setFetchDataInit(true);
            }}
            showChildButton={stages?.fetched}
            disableChildButton={!!!productStagesNotUsed?.length}
            childButtonText={'Add Other Stage'}
            childButtonCallback={(e: any) => {
               setEditStageConfig((prevState: any) => ({ ...prevState, required: false }));
               setOpenAddStageModal(!openAddStageModal);
            }}>
            <Table
               theme='secondary'
               hideHeader={!stages?.fetched || !otherStages?.length}
               isLoading={!stages?.fetched}
               loadingTableHeight={160}
               columns={columns}
               data={otherStages}
               rowReorder
               rowReorderKeyPath={['displayOrder']}
               actions={[
                  {
                     icon: 'UnionUp',
                     actionKey: 'moveup',
                     toolTip: 'Move Up',
                     callback: (args: any) => handleActionClick({ ...args, table: 'other' }),
                  },
                  {
                     icon: 'UnionDown',
                     actionKey: 'movedown',
                     toolTip: 'Move Down',
                     callback: (args: any) => handleActionClick({ ...args, table: 'other' }),
                  },
                  {
                     icon: 'Edit',
                     actionKey: 'edit',
                     toolTip: 'Edit Stage',
                     callback: (args: any) => handleActionClick({ ...args, table: 'other' }),
                  },
                  {
                     icon: 'TrashCan',
                     actionKey: 'delete',
                     toolTip: 'Delete Stage',
                     callback: (args: any) => handleActionClick({ ...args, table: 'other' }),
                  },
               ]}
            />
         </Panel>

         {/* Add Stage Modal */}
         <Modal
            isOpen={openAddStageModal}
            onClose={(e: any) => {
               // warning close modal here...

               setOpenAddStageModal(false);
               // setEditStageConfig(initEditStageConfig);
               resetEditStageConfig(initEditStageConfig);
            }}
            size={'default'}
            zIndex={100}
            title={`Add ${editStageConfig.required ? 'Required' : 'Other'} Stage to Product`}
            primaryButtonText={editStageConfig?.editMode ? 'Update' : 'Save'}
            primaryButtonCallback={handleSubmit}>
            <Grid>
               <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Select Stage</div>
               <Grid columnCount={3} responsive>
                  <DropDown
                     label='Stage'
                     description={`Beginning Stage is the default stage for an order once created.`}
                     options={productStagesNotUsed}
                     selectedValues={editStageConfig?.productStage ? [editStageConfig?.productStage] : []}
                     keyPath={['name']}
                     name={'productStage'}
                     placeholder='Select Stage'
                     onOptionSelect={(e: any, selectedProductStage: any) => {
                        handleChange({ target: { type: 'text', name: 'productStage', value: selectedProductStage } });
                     }}
                     onBlur={handleBlur}
                     errorMessage={editStageConfigErrors?.productStage}
                     required
                     disabled={!!!productStagesNotUsed.length}
                     // disabled={
                     //    !!!productStagesNotUsed.length || editStageConfig?.productStage?.name === 'Beginning Stage'
                     // }
                  />
                  <Input
                     label='Estimated Time to Complete (Days)'
                     type={'number'}
                     name={'daysToComplete'}
                     placeholder='How many days to complete?'
                     onChange={handleChange}
                     onBlur={handleBlur}
                     value={editStageConfig.daysToComplete}
                     // there won't be errors, cause 0 is the default value... but just in case
                     errorMessage={editStageConfigErrors?.daysToComplete}
                     required
                  />
                  <ToggleSwitch
                     textOptions='yes/no'
                     checked={editStageConfig.scheduled}
                     onChange={handleChange}
                     label='Scheduled Stage?'
                     name='scheduled'
                  />
               </Grid>
               <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Requirements for Stage</div>
               <Grid>
                  <span className='text-[12px] text-lum-gray-500 dark:text-lum-gray-300'>Required Tasks</span>
                  <div className='flex flex-wrap gap-x-1'>
                     {!!editStageConfig?.requiredTasksOnProduct?.length &&
                        editStageConfig.requiredTasksOnProduct.map((taskOnProd: any, i: number) => {
                           if (!taskOnProd.archived) {
                              return (
                                 <Chip
                                    key={i}
                                    color={'blue'}
                                    value={taskOnProd.productTask.name}
                                    onClick={(e: any, valueToRemove: string | number) => {
                                       const indexToRemove = editStageConfig.requiredTasksOnProduct.findIndex(
                                          (rt: any) => rt.productTaskId === taskOnProd.productTaskId
                                       );
                                       handleRemoveChip('requiredTasksOnProduct', indexToRemove);
                                    }}
                                 />
                              );
                           }
                        })}

                     <ChipButton
                        chipBtnText='+ Required Task'
                        options={tasksOnProductChipButtonOptions}
                        textKeyPath={['productTask', 'name']}
                        onOptionSelect={(e: any, taskOnProdToAdd: any) => {
                           const alreadyExistsIndex = editStageConfig.requiredTasksOnProduct.findIndex(
                              (rt: any) => rt.productTaskId === taskOnProdToAdd.productTaskId
                           );
                           handleAddChip(taskOnProdToAdd, 'requiredTasksOnProduct', alreadyExistsIndex);
                        }}
                     />
                  </div>
               </Grid>
               <Grid>
                  <span className='text-[12px] text-lum-gray-500 dark:text-lum-gray-300'>Required Fields</span>
                  <div className='flex flex-wrap gap-x-1'>
                     {!!editStageConfig?.requiredFieldsOnProduct?.length &&
                        editStageConfig.requiredFieldsOnProduct.map((field: any, i: number) => {
                           if (!field.archived) {
                              return (
                                 <Chip
                                    key={i}
                                    color={'blue'}
                                    value={field.productField.label}
                                    onClick={(e: any, fieldOnProdToRemove: string | number) => {
                                       const indexToRemove = editStageConfig.requiredFieldsOnProduct.findIndex(
                                          (rf: any) => rf.productFieldId === field.productFieldId
                                       );
                                       handleRemoveChip('requiredFieldsOnProduct', indexToRemove);
                                    }}
                                 />
                              );
                           }
                        })}
                     <ChipButton
                        chipBtnText='+ Required Field'
                        options={fieldsOnProductChipButtonOptions}
                        textKeyPath={['productField', 'label']}
                        onOptionSelect={(e: any, fieldToAdd: any) => {
                           const alreadyExistsIndex = editStageConfig.requiredFieldsOnProduct.findIndex(
                              (rf: any) => rf.productFieldId === fieldToAdd.productFieldId
                           );
                           handleAddChip(fieldToAdd, 'requiredFieldsOnProduct', alreadyExistsIndex);
                        }}
                     />
                  </div>
               </Grid>
               <Grid>
                  <span className='text-[12px] text-lum-gray-500 dark:text-lum-gray-300'>Excluded Roles</span>
                  <div className='flex flex-wrap gap-x-1'>
                     {!!editStageConfig?.excludedRoles?.length &&
                        editStageConfig.excludedRoles.map((prodRoleConstraint: any, i: number) => {
                           if (!prodRoleConstraint.archived) {
                              return (
                                 <Chip
                                    key={i}
                                    value={prodRoleConstraint.role.name}
                                    color={'blue'}
                                    onClick={(e: any, valueToRemove: string | number) => {
                                       const indexToRemove = editStageConfig.excludedRoles.findIndex(
                                          (excludedRole: any) => excludedRole.roleId === prodRoleConstraint.role.id
                                       );
                                       handleRemoveChip('excludedRoles', indexToRemove);
                                    }}
                                 />
                              );
                           }
                        })}

                     <ChipButton
                        chipBtnText='+ Excluded Role'
                        options={rolesChipButtonOptions}
                        textKeyPath={['name']}
                        onOptionSelect={(e: any, selectedRoleToExclude: any) => {
                           console.log('selectedRoleToExclude:', selectedRoleToExclude);
                           console.log('editStageConfig.excludedRoles:', editStageConfig.excludedRoles);
                           const alreadyExistsIndex = editStageConfig.excludedRoles.findIndex(
                              (excludedRole: any) => excludedRole.role.id === selectedRoleToExclude.id
                           );
                           handleAddChip(
                              { roleId: selectedRoleToExclude?.id, role: selectedRoleToExclude },
                              'excludedRoles',
                              alreadyExistsIndex
                           );
                        }}
                     />
                  </div>
               </Grid>
            </Grid>
         </Modal>
         <ConfirmModal
            open={openConfirmModal}
            handleOnClose={(e: any) => {
               setOpenConfirmModal(!openConfirmModal);
            }}
            handleOnConfirm={(e: any) => {
               setOpenConfirmModal(false);
               const item = { ...stageToRemove };
               delete item['keyString'];
               handleDeleteStage(item, stageToRemove.keyString);
            }}
            value={'stage, "' + stageToRemove?.productStage?.name + '"'}
         />
      </>
   );
};

export default Stages;
