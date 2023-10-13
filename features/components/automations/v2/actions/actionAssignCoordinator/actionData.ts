import { AutomationActionDataType, AutomationActionProps } from '../actions';

export interface ActionProps
   extends AutomationActionProps<{
      selectedProduct: any;
      selectedCoordinatorRole: any;
      howToAssign: any;
      selectedRole: any;
      selectedUser: any;
   }> {}

const actionData: AutomationActionDataType = {
   types: ['operations'],
   name: 'assign_coordinator',
   prettyName: 'Assign Coordinator',
   description: 'Assign a coordinator to work order.',
   iconName: '',
};

export default actionData;
