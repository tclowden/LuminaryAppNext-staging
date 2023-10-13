'use both'
import { AutomationActionDataType, AutomationActionProps } from '../actions';

export interface ActionProps
   extends AutomationActionProps<{
      filterData: any[];
   }> {}

const actionData: AutomationActionDataType = {
   types: ['workflow'], 
   name: 'filter',
   prettyName: 'Filter',
   description: 'Check conditions to see if the automation should continue.',
   iconName: 'Filter',
};

export default actionData;
