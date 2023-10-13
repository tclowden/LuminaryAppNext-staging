import { AutomationActionDataType, AutomationActionProps } from '../actions';

export interface ActionProps
   extends AutomationActionProps<{
      // userId: string;
      // userObject: any;
      selectedUser: any
      selectedValue: any;
   }> {}

const actionData: AutomationActionDataType = {
   types: ['marketing'],
   name: 'make_owned',
   prettyName: 'Make Owned',
   description: 'Set owner of this lead.',
   iconName: 'Clock',
};

export default actionData;
