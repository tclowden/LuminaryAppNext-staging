import { AutomationActionDataType, AutomationActionProps } from '../actions';

export interface ActionProps
   extends AutomationActionProps<{
   }> {}

const actionData:AutomationActionDataType= {
   types: ['operations'],
   name: 'update_field',
   prettyName: 'Update Field',
   description: 'Change the value of a field with work order.',
   iconName: '',
};

export default actionData;
