import { AutomationActionDataType, AutomationActionProps } from '../actions';

export interface ActionProps
   extends AutomationActionProps<{
   }> {}

const actionData:AutomationActionDataType= {
   types: ['marketing'],
   name: 'remove_owner',
   prettyName: 'Remove Owner',
   description: 'Remove the owner of this lead.',
   iconName: 'Clock',
};

export default actionData;
