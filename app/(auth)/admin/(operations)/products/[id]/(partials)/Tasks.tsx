'use client';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import DropDown from '../../../../../../../common/components/drop-down/DropDown';
import Grid from '../../../../../../../common/components/grid/Grid';
import Input from '../../../../../../../common/components/input/Input';
import Modal from '../../../../../../../common/components/modal/Modal';
import Panel from '../../../../../../../common/components/panel/Panel';
import Table from '../../../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../../../common/components/table/tableTypes';
import useForm, { YupSchemaObject } from '../../../../../../../common/hooks/useForm';
import { useAppDispatch, useAppSelector } from '../../../../../../../store/hooks';
import { selectUser } from '../../../../../../../store/slices/user';
import ConfirmModal from '../../../../../../../common/components/confirm-modal/ConfirmModal';
import { selectPageContext, setPageContext } from '@/store/slices/pageContext';
import { fetchTaskDueDateTypes, fetchTasks, fetchTasksOnProduct, handleResults } from './utilities';
import { formatTasksOnProduct } from './formatters';

const configureActions = (arr: Array<any>) => {
   // separate out the archived:true objects
   const itemsToIgnore = [...arr].filter((obj: any) => obj.archived);
   const copy = [...arr].filter((obj: any) => !obj.archived);

   // sort by displayOrder
   // create the actionsConfig
   const configuredArr = copy
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
      .map((obj: any, i: number) => {
         // const tempId = Math.random().toString(36).substring(2, 10);
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

   // combine back the arrays
   return [...configuredArr, ...itemsToIgnore];
};

const configTaskValidationSchema: YupSchemaObject<any> = {
   productTask: Yup.object().required(),
   taskDueDateType: Yup.object().required(),
   hoursToComplete: Yup.number(),
   daysToComplete: Yup.number(),
   fieldOnProduct: Yup.object(),
};

const columns: ColumnType[] = [
   { keyPath: ['productTask', 'name'], title: 'Task Name', colSpan: 1 },
   { keyPath: ['productTask', 'description'], title: 'Task Description', colSpan: 2 },
   { keyPath: ['taskDueDateType', 'name'], title: 'Time Frame', colSpan: 1 },
];

interface Props {
   tasksOnProduct: Array<any>;
   tasksOnProductCount: number;
   setValue: (name: string, value: any) => void;
   setMultiValues: (values: any) => void;
   fieldsOnProduct: Array<any>;
   stagesOnProductOther: Array<any>;
   stagesOnProductRequired: Array<any>;
}

const initEditTaskConfig = { daysToComplete: 0, editMode: false };

const Tasks = ({
   tasksOnProduct,
   tasksOnProductCount,
   fieldsOnProduct,
   setValue,
   setMultiValues,
   stagesOnProductOther,
   stagesOnProductRequired,
}: Props) => {
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   const { product, tasks, taskDueDateTypes } = useAppSelector(selectPageContext);

   const [fetchDataInit, setFetchDataInit] = useState<boolean>(false);
   const [openAddTaskModal, setOpenAddTaskModal] = useState<boolean>(false);
   const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
   const [taskToRemove, setTaskToRemove] = useState<any>({});
   // const [taskSearchVal, setTaskSearchVal] = useState<string>('');
   // const [editTaskConfig, setEditTaskConfig] = useState<any>({});

   useEffect(() => {
      const runAsync = async () => {
         // fetch all tasks
         // doing this on the client for speed purposes
         if (!tasks.fetched && fetchDataInit) {
            console.log('fetching tasks...');

            let tempTasks: any = fetchTasks(user?.token || undefined);

            let tempTaskDueDateTypes: any = [];
            if (taskDueDateTypes?.fetched) tempTaskDueDateTypes = [...taskDueDateTypes?.data];
            else tempTaskDueDateTypes = fetchTaskDueDateTypes(user?.token || undefined);

            let tempTasksOnProduct: any = [];
            const tasksOnProductAlreadyFetched = !!tasksOnProduct?.length;

            if (tasksOnProductAlreadyFetched) tempTasksOnProduct = [...tasksOnProduct];
            else tempTasksOnProduct = fetchTasksOnProduct(user?.token || undefined, product?.id);

            [tempTasks, tempTaskDueDateTypes, tempTasksOnProduct] = await Promise.allSettled([
               tempTasks,
               tempTaskDueDateTypes,
               tempTasksOnProduct,
            ])
               .then(handleResults)
               .catch((err) => {
                  console.log('err', err);
               });

            tempTasksOnProduct = formatTasksOnProduct(tempTasksOnProduct, tempTaskDueDateTypes);

            console.log('tempTaskDueDateTypes:', tempTaskDueDateTypes);
            dispatch(
               setPageContext({
                  tasks: { data: tempTasks, fetched: true },
                  ...(!taskDueDateTypes?.fetched && {
                     taskDueDateTypes: { data: tempTaskDueDateTypes, fetched: true },
                  }),
               })
            );
            setValue('tasksOnProduct', configureActions(tempTasksOnProduct));
         }
      };

      runAsync();
   }, [fetchDataInit, tasks]);

   const handleDeleteTask = (item: any) => {
      // whenever a task is removed,
      // need to go through everything dependant on the task & remove it from that list as well
      // dependants --> stages

      // remove the task from the product
      let taskOnProdIndex: number;
      const tempTasksOnProd = [...tasksOnProduct].map((taskOnProd: any, i: number) => {
         const copy = { ...taskOnProd };
         if (taskOnProd.productTaskId === item.productTaskId) {
            taskOnProdIndex = i;
            copy['archived'] = true;
         }
         return copy;
      });
      const tempStagesOnProd = [...stagesOnProductRequired, ...stagesOnProductOther].map((stage: any) => ({
         ...stage,
         requiredTasksOnProduct: [...stage.requiredTasksOnProduct].map((reqTask: any) => {
            const copy = { ...reqTask };
            const found =
               typeof taskOnProdIndex !== undefined &&
               tempTasksOnProd[taskOnProdIndex].productTaskId === reqTask.productTaskId;
            if (found) copy['archived'] = true;
            return copy;
         }),
      }));
      // refilter the required from other stages
      const tempStagesOnProdRequired = tempStagesOnProd.filter((stageOnProd: any) => stageOnProd.required);
      const tempStagesOnProdOther = tempStagesOnProd.filter((stageOnProd: any) => !stageOnProd.required);
      setMultiValues({
         tasksOnProduct: configureActions(tempTasksOnProd),
         stagesOnProductRequired: tempStagesOnProdRequired,
         stagesOnProductOther: tempStagesOnProdOther,
      });
   };

   const handleActionClick = ({ actionKey, item, newData }: any) => {
      switch (actionKey) {
         case 'moveup':
         case 'movedown':
            if (!!!newData.length) return;
            setValue('tasksOnProduct', [...newData]);
            // setFormData((prevState: any) => ({
            //    ...prevState,
            //    tasksOnProduct: newData,
            // }));
            break;
         case 'edit':
            // open the modal
            // populate the edit task config
            setEditTaskConfig({ ...item, editMode: true });
            setOpenAddTaskModal(true);
            break;
         case 'delete':
            setOpenConfirmModal(true);
            setTaskToRemove(item);
            // handleDeleteTask(item);
            break;
         default:
            break;
      }
   };

   const handleAddTask: any = (e: any, taskOnProdToAdd: any) => {
      // here, add the new configed task to the tasksOnProducts Array
      // make a copy
      const tempTasksOnProducts = [...tasksOnProduct];
      let tempStagesOnProd = [...stagesOnProductRequired, ...stagesOnProductOther];

      // configure the object to save... don't want anything in there that's not necessary
      if (taskOnProdToAdd.taskDueDateTypesLookupId === 1) delete taskOnProdToAdd['fieldOnProduct'];
      else if (taskOnProdToAdd.taskDueDateTypesLookupId === 2) delete taskOnProdToAdd['hours'];
      else if (taskOnProdToAdd.taskDueDateTypesLookupId === 3) {
         delete taskOnProdToAdd['fieldOnProduct'];
         delete taskOnProdToAdd['hours'];
      }

      if (taskOnProdToAdd.editMode) {
         // if editing a task on product
         // get the index of the task to edit
         let taskOnProdToEditIndex = tempTasksOnProducts.findIndex(
            (taskOnProd: any) => taskOnProd.productTaskId === taskOnProdToAdd.productTaskId
         );
         if (taskOnProdToEditIndex === -1) {
            // if it doens't exist... recurse this function, but change editMode to fasle
            taskOnProdToAdd['editMode'] = false;
            return handleAddTask(e, taskOnProdToAdd);
         }

         // need to archive the previous task out of the requiredTasksOnProduct array within the stage constraint it belongs to
         tempStagesOnProd = tempStagesOnProd.map((stage: any) => ({
            ...stage,
            requiredTasksOnProduct: [...stage.requiredTasksOnProduct].map((reqTask: any) => {
               const copy = { ...reqTask };
               const found = tempTasksOnProducts[taskOnProdToEditIndex].productTaskId === reqTask.productTaskId;
               if (found) copy['archived'] = true;
               return copy;
            }),
         }));

         // just set the taskOnProdToEdit equal to the taskOnProdToAdd to get all the updated data
         tempTasksOnProducts[taskOnProdToEditIndex] = taskOnProdToAdd;
         // set the productTaskId
         tempTasksOnProducts[taskOnProdToEditIndex].productTaskId = taskOnProdToAdd.productTask.id;
      } else {
         // if creating a task on product
         // add the productTaskId
         taskOnProdToAdd['productTaskId'] = taskOnProdToAdd.productTask.id;
         // get the max displayOrder value
         const maxOrderVal = tempTasksOnProducts.reduce(
            (acc: any, val: any) => (acc = acc > val.displayOrder ? acc : val.displayOrder),
            0
         );
         // set displayOrder to the object
         taskOnProdToAdd['displayOrder'] = maxOrderVal + 1;
         // add the object to the end of the array
         tempTasksOnProducts.push(taskOnProdToAdd);
      }

      // remove the editMode key value
      delete taskOnProdToAdd['editMode'];

      // refilter the required from other stages
      const tempStagesOnProdRequired = tempStagesOnProd.filter((stageOnProd: any) => stageOnProd.required);
      const tempStagesOnProdOther = tempStagesOnProd.filter((stageOnProd: any) => !stageOnProd.required);
      setMultiValues({
         tasksOnProduct: configureActions(tempTasksOnProducts),
         stagesOnProductRequired: tempStagesOnProdRequired,
         stagesOnProductOther: tempStagesOnProdOther,
      });

      // close modal
      setOpenAddTaskModal(false);
      // reset the obj
      // setEditTaskConfig(initEditTaskConfig);
      resetEditTaskConfig(initEditTaskConfig);
   };

   // create a filtered array for the products tasks to select to add to product
   const productTasksNotUsed = [...tasks?.data].filter((prodTask: any) => {
      const taskExists = tasksOnProduct?.find((tp: any) => tp.productTaskId === prodTask?.id && !tp.archived);
      if (!taskExists) return prodTask;
   });

   // useForm here to validate the add task modal before saving...
   // want to make sure everything is valid before adding to the product form data
   const {
      values: editTaskConfig,
      handleChange,
      handleBlur,
      handleSubmit,
      setMultiValues: setEditTaskConfig,
      resetValues: resetEditTaskConfig,
      errors: editTaskConfigErrors,
   } = useForm({
      initialValues: initEditTaskConfig,
      validationSchema: configTaskValidationSchema,
      onSubmit: handleAddTask,
   });

   return (
      <>
         <Panel
            title={`Tasks (${tasksOnProductCount})`}
            collapsible
            isCollapsed
            onCollapseBtnClick={() => {
               setFetchDataInit(true);
            }}
            // isCollapsed={typeof containersCollapsed === 'boolean' ? containersCollapsed : false}
            // onCollapseBtnClick={() => onContainerCollapse(!containersCollapsed)}
            showChildButton={tasks?.fetched}
            disableChildButton={!!!productTasksNotUsed.length}
            childButtonText={'Add Task'}
            childButtonCallback={(e: any) => {
               // add the default taskDueDateType to the editTaskConfig... why?
               // right now we are only handling one... so there is no reason to make them pick
               setEditTaskConfig({
                  taskDueDateType: taskDueDateTypes?.data[0],
                  taskDueDateTypesLookupId: taskDueDateTypes?.data[0]?.id,
               });
               setOpenAddTaskModal(!openAddTaskModal);
            }}>
            <Table
               theme='secondary'
               isLoading={!tasks?.fetched}
               loadingTableHeight={160}
               hideHeader={!tasks?.fetched || !tasksOnProduct?.filter((t: any) => !t.archived)?.length}
               columns={columns}
               data={tasksOnProduct?.filter((task: any) => !task.archived)}
               rowReorder
               rowReorderKeyPath={['displayOrder']}
               actions={[
                  { icon: 'UnionUp', actionKey: 'moveup', toolTip: 'Move Up', callback: handleActionClick },
                  { icon: 'UnionDown', actionKey: 'movedown', toolTip: 'Move Down', callback: handleActionClick },
                  { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Coordinator', callback: handleActionClick },
                  {
                     icon: 'TrashCan',
                     actionKey: 'delete',
                     toolTip: 'Delete Coordinator',
                     callback: handleActionClick,
                  },
               ]}
            />
         </Panel>

         {/* Add Task Modal */}
         <Modal
            isOpen={openAddTaskModal}
            onClose={(e: any) => {
               // warning close modal here...
               setOpenAddTaskModal(false);
               resetEditTaskConfig(initEditTaskConfig);
            }}
            size='default'
            zIndex={100}
            title={'Add Task to Product'}
            primaryButtonText={editTaskConfig?.editMode ? 'Update' : 'Save'}
            primaryButtonCallback={handleSubmit}>
            <Grid>
               <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Select Task</div>
               <DropDown
                  label='Task'
                  options={productTasksNotUsed}
                  selectedValues={editTaskConfig?.productTask ? [editTaskConfig.productTask] : []}
                  keyPath={['name']}
                  name='productTask'
                  placeholder='Select Task'
                  onOptionSelect={(e: any, selectedProductTask: any) => {
                     handleChange({ target: { type: 'text', name: 'productTask', value: selectedProductTask } });
                     // setEditTaskConfig((prevState: any) => ({ ...prevState, task: selectedProductTask }));
                  }}
                  onBlur={handleBlur}
                  errorMessage={editTaskConfigErrors?.productTask}
                  required
                  disabled={!!!productTasksNotUsed.length}
               />
               <Grid columnCount={2} responsive>
                  <DropDown
                     label='Time Frame'
                     options={taskDueDateTypes?.data}
                     // default the selected value
                     selectedValues={
                        editTaskConfig?.taskDueDateType
                           ? [editTaskConfig?.taskDueDateType]
                           : [taskDueDateTypes?.data[0]]
                     }
                     keyPath={['name']}
                     name={'taskDueDateType'}
                     placeholder={'Select Time Frame'}
                     onOptionSelect={(e: any, selectedType: any) => {
                        handleChange({
                           target: { type: 'text', name: 'taskDueDateTypesLookupId', value: selectedType.id },
                        });
                        handleChange({ target: { type: 'text', name: 'taskDueDateType', value: selectedType } });
                     }}
                     onBlur={handleBlur}
                     errorMessage={editTaskConfigErrors?.taskDueDateType}
                     required
                     disabled
                  />

                  {editTaskConfig?.taskDueDateType && (
                     <Input
                        label='Days'
                        type={'number'}
                        placeholder={'Days'}
                        onChange={(e: any) => {
                           e.target.valueAsNumber;
                           handleChange(e);
                        }}
                        name='daysToComplete'
                        value={editTaskConfig?.daysToComplete || 0}
                        onBlur={handleBlur}
                        errorMessage={editTaskConfigErrors?.daysToComplete}
                        required
                     />
                  )}

                  {/* DO NOT DELETE... THIS IS FOR WHEN WE OFFER MORE 'taskDueDateTypes' */}
                  {/* {editTaskConfig?.taskDueDateType?.name === 1 && (
                     <Input
                        label='Hours'
                        type={'number'}
                        placeholder={'Hours'}
                        onChange={(e: any) => {
                           e.target.valueAsNumber;
                           handleChange(e);
                           // setEditTaskConfig((prevState: any) => ({ ...prevState, hours: e.target.value }));
                        }}
                        name='hoursToComplete'
                        value={editTaskConfig?.hoursToComplete || 0}
                        onBlur={handleBlur}
                        errorMessage={
                           editTaskConfigErrors?.hoursToComplete?.errorMessage && editTaskConfigErrors?.hoursToComplete?.touched
                              ? editTaskConfigErrors?.hoursToComplete?.errorMessage
                              : undefined
                        }
                        required
                     />
                  )}

                  {editTaskConfig?.taskDueDateType?.id === 2 && (
                     <DropDown
                        label='Field'
                        options={fieldsOnProduct.filter((field: any) => !field.archived)}
                        selectedValues={editTaskConfig?.fieldOnProduct ? [editTaskConfig?.fieldOnProduct] : []}
                        placeholder={'Select Product Field'}
                        keyPath={['productField', 'label']}
                        name={'fieldOnProduct'}
                        onOptionSelect={(e: any, selectedFieldOnProduct: any) => {
                           handleChange({
                              target: { type: 'text', value: selectedFieldOnProduct, name: 'fieldOnProduct' },
                           });
                        }}
                        onBlur={handleBlur}
                        errorMessage={
                           editTaskConfigErrors?.fieldOnProduct?.errorMessage &&
                           editTaskConfigErrors?.fieldOnProduct?.touched
                              ? editTaskConfigErrors?.fieldOnProduct?.errorMessage
                              : undefined
                        }
                        required
                     />
                  )} */}
               </Grid>
            </Grid>
         </Modal>
         <ConfirmModal
            zIndex={101}
            open={openConfirmModal}
            handleOnClose={(e: any) => {
               setOpenConfirmModal(!openConfirmModal);
            }}
            handleOnConfirm={(e: any) => {
               setOpenConfirmModal(false);
               handleDeleteTask(taskToRemove);
            }}
            value={'task, "' + taskToRemove?.productTask?.name + '"'}
         />
      </>
   );
};

export default Tasks;
