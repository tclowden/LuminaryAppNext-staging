import { AutomationActionDataType, AutomationActionProps } from '../actions';

export interface ActionProps
   extends AutomationActionProps<{
      selectedProduct: any;
      selectedTask: any;
      howToAssign: any;
      selectedCoordinatorRole: any;
      selectedRole: any;
      selectedUser: any;
   }> {}

const actionData: AutomationActionDataType = {
   types: ['operations'],
   name: 'assign_task',
   prettyName: 'Create & Assign Task',
   description: 'Create a task for work order.',
   iconName: '',
};

export default actionData;
