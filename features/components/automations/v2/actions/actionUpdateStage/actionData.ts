import { AutomationActionDataType, AutomationActionProps } from '../actions';

export interface ActionProps
   extends AutomationActionProps<{
      selectedProduct: any;
      selectedStage: any;
   }> {}

const actionData: AutomationActionDataType = {
   hidden: true,
   types: ['operations'],
   name: 'update_stage',
   prettyName: 'Update To Stage',
   description: 'Change the value of a stage with work order.',
   iconName: 'Clock',
};

export default actionData;
