import { AutomationActionDataType, AutomationActionProps } from '../actions';

export interface ActionProps
   extends AutomationActionProps<{
   }> {}

const actionData:AutomationActionDataType= {
   types: ['operations'],
   name: 'archive_tasks',
   prettyName: 'Archive All Tasks',
   description: `Mark all tasks associated with this order as 'archived'`,
   iconName: 'Clock',
};

export default actionData;
