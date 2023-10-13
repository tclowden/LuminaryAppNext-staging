'use client';
import React, { useEffect, useState } from 'react';
import Table from '../../../../../../../common/components/table/Table';
import { ColumnType, SortingConfiguration, SortingType } from '../../../../../../../common/components/table/tableTypes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPageContext, setPageContext } from '@/store/slices/pageContext';
import { fetchDbApi, triggerAutomation } from '@/serverActions';
import { selectUser } from '@/store/slices/user';
import { formatPostgresTimestamp, getObjectProp } from '@/utilities/helpers';
import { setAddToast } from '@/store/slices/toast';
import { LumError } from '@/utilities/models/LumError';
import TaskModal from './(modal-partials)/TaskModal';

const columns: ColumnType[] = [
   {
      keyPath: ['taskOnProduct', 'productTask', 'name'],
      title: 'Task Name',
      colSpan: 2,
      sortable: true,
      ellipsis: false,
      render: ({ column, item, callback }) => {
         const keyPathOptions = [['taskOnProduct', 'productTask', 'name'], ['name']];
         let val = getObjectProp(item, keyPathOptions[0] as any);
         if (!val) val = getObjectProp(item, keyPathOptions[1] as any);
         return (
            <>
               {val}
               {item?.requiredThisStage && !item?.completed && <span className='text-lum-red-500'> (REQUIRED)</span>}
            </>
         );
      },
   },
   {
      keyPath: [],
      title: 'Description',
      colSpan: 1,
      render: ({ item }) => {
         const keyPathOptions = [['taskOnProduct', 'productTask', 'description'], ['description']];
         let val = getObjectProp(item, keyPathOptions[0] as any);
         if (!val) val = getObjectProp(item, keyPathOptions[1] as any);
         return <>{val}</>;
      },
   },
   { keyPath: ['assignedTo', 'fullName'], title: 'Coordinator', colSpan: 1 },
   {
      keyPath: [],
      title: 'Due Date & Time',
      colSpan: 1,
      render: ({ item }) => <>{formatPostgresTimestamp(item?.dueAt)}</>,
   },
];

interface Props {
   modalOpen: boolean;
   setModalOpen: (bool: boolean) => void;
}

const Tasks = ({ modalOpen, setModalOpen }: Props) => {
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const { order, currStageOnProduct } = useAppSelector(selectPageContext);

   const [todoTasks, setTodoTasks] = useState<Array<any>>([]);
   const [doneTasks, setDoneTasks] = useState<Array<any>>([]);

   // this is the initial state for editing or creating a one-off task
   // OR, when a task is checked or unchecked... will update this object and save it
   const [taskConfig, setTaskConfig] = useState<any>({});

   const [toDoSortingConfig, setToDoSortConfig] = useState<SortingConfiguration>();
   const [doneSortingConfig, setDoneSortConfig] = useState<SortingConfiguration>();

   useEffect(() => {
      // wheneevr all tasks change, refilter the two types of tasks
      if (order?.tasksOnOrder?.length) {
         let tasksForStage = [...order?.tasksOnOrder]
            .map((taskOnOrder: any) => {
               // right now, if the one off ask is incomplete... it's required on any stage...
               // if there is an issue with that and only want it required on the stage it's created... need to handle that eventually
               const isOneOffTask = !taskOnOrder?.taskOnProductId;
               taskOnOrder['actionsConfig'] = { edit: true, delete: true };

               const taskOnOrderHasConstraint =
                  taskOnOrder?.taskOnProduct?.stageOnProductConstraintId === currStageOnProduct?.id;
               if ((currStageOnProduct && taskOnOrderHasConstraint) || isOneOffTask) {
                  taskOnOrder['requiredThisStage'] = true;
                  return taskOnOrder;
               } else if (!taskOnOrder?.taskOnProduct?.stageOnProductConstraintId) return taskOnOrder;
            })
            .filter((taskOnOrder: any) => taskOnOrder);

         setTodoTasks([...tasksForStage].filter((taskOnOrder) => !taskOnOrder?.completed));
         setDoneTasks([...tasksForStage].filter((taskOnOrder) => taskOnOrder?.completed));
      }
   }, [order?.tasksOnOrder]);

   const handleSaveTaskOnOrder = async (taskOnOrderToSave: any) => {
      let url = `/api/v2/orders/${order?.id}/tasks/${taskOnOrderToSave?.id}`;
      let method = `PUT`;

      if (taskOnOrderToSave?.completed) {
         taskOnOrderToSave['completedById'] = user?.id;
         taskOnOrderToSave['completedAt'] = new Date().toISOString();
      } else {
         taskOnOrderToSave['completedById'] = null;
         taskOnOrderToSave['completedAt'] = null;
      }

      // delete unneccary keys
      delete taskOnOrderToSave['taskOnProduct'];
      delete taskOnOrderToSave['actionsConfig'];
      delete taskOnOrderToSave['requiredThisStage'];
      delete taskOnOrderToSave['assignedTo'];

      taskOnOrderToSave['assignType'] = null;
      taskOnOrderToSave['assignTypeAnswer'] = null;

      taskOnOrderToSave['updatedById'] = user?.id;

      return await fetchDbApi(url, {
         method: method,
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
         body: JSON.stringify(taskOnOrderToSave),
      })
         .then((res: any) => {
            if (!res?.errors?.length) {
               dispatch(
                  setAddToast({
                     details: [{ label: 'Success', text: 'Task Updated!' }],
                     iconName: 'CheckMarkCircle',
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
            } else throw new LumError(400, res?.errors[0] || res?.message);
         })
         .catch((err: any) => {
            console.log('error saving task on order:', err);
            dispatch(
               setAddToast({
                  iconName: 'XMarkCircle',
                  details: [{ label: 'Error', text: err || 'Error: Changes Not Saved' }],
                  variant: 'danger',
                  autoCloseDelay: 5,
               })
            );
         });
   };

   const handleRowsSelect = (e: any, rowsSelected: Array<any>, allRowsChecked: any) => {
      const selectedRow = rowsSelected[0];
      const tempAllTasks = [...todoTasks, ...doneTasks]
         .map((task: any) => ({
            ...task,
            ...(selectedRow?.id === task?.id && {
               completed: !task?.completed,
            }),
         }))
         .sort((a: any, b: any) => a.displayOrder - b.displayOrder);

      handleSaveTaskOnOrder({ ...selectedRow, completed: !selectedRow?.completed }).then((res: any) => {
         dispatch(setPageContext({ order: { ...order, tasksOnOrder: tempAllTasks } }));
         setTodoTasks(tempAllTasks.filter((taskOnOrder) => !taskOnOrder.completed));
         setDoneTasks(tempAllTasks.filter((taskOnOrder) => taskOnOrder.completed));
      });
      
      
      triggerAutomation.fire('task_completed', {
         leadId: order?.leadId,
         executorId: user?.id,
         newValue: `${!selectedRow?.completed}`,
         prevValue: `${selectedRow?.completed}`,
         orderId: order?.id,
      })
   };

   useEffect(() => {
      // reset the task object whenever the modal closes...
      if (!modalOpen) setTaskConfig({});
   }, [modalOpen]);

   const handleActionClick = ({ actionKey, item }: any) => {
      switch (actionKey) {
         case 'edit':
            setTaskConfig(item);
            setModalOpen(true);
            break;
         default:
            break;
      }
   };

   return (
      <>
         {/* TO DO */}
         <Table
            theme='secondary'
            selectableRowsKey={'completed'}
            tableTitle='TO DO'
            tableTitleClassName={'text-[12px] text-lum-gray-450'}
            data={todoTasks}
            columns={columns}
            sortingConfig={toDoSortingConfig}
            emptyStateDisplayText='No More Tasks To do'
            onTableSort={(column: ColumnType, direction: SortingType, sortedData: any[]) => {
               setToDoSortConfig({ column: column, sortType: direction });
               setTodoTasks(sortedData);
            }}
            selectableRows
            onRowsSelect={(e: any, rowsSelected: Array<any>, allRowsChecked?: boolean) => {
               handleRowsSelect(e, rowsSelected, allRowsChecked);
            }}
            actions={[{ icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Section', callback: handleActionClick }]}
         />

         {/* COMPLETE */}
         <Table
            theme='secondary'
            selectableRowsKey={'completed'}
            tableTitle='COMPLETE'
            tableTitleClassName={'text-[12px] text-lum-gray-450'}
            data={doneTasks}
            columns={columns}
            sortingConfig={doneSortingConfig}
            emptyStateDisplayText='No Completed Tasks'
            onTableSort={(column: ColumnType, direction: SortingType, sortedData: any[]) => {
               setDoneSortConfig({ column: column, sortType: direction });
               setDoneTasks(sortedData);
            }}
            selectableRows
            onRowsSelect={handleRowsSelect}
         />

         <TaskModal modalOpen={modalOpen} setModalOpen={setModalOpen} initValues={taskConfig || {}} />
      </>
   );
};

export default Tasks;
