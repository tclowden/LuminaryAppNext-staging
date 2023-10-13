import { AutomationActionDataType, AutomationActionProps } from '../actions';

export interface ActionProps extends AutomationActionProps<{
   filterData: any;
}> {}

const actionData: AutomationActionDataType = {
   hidden: true,
   types: ['workflow'],
   name: 'conditional',
   prettyName: 'Conditional',
   description: 'Split the flow based on selected condition.',
   iconName: '',
};

export default actionData;
