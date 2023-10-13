'use both'
import { AutomationActionDataType, AutomationActionProps } from '../actions';

export interface ActionProps
   extends AutomationActionProps<{
      days: number;
      hours: number;
      minutes: number;
   }> {}

const actionData: AutomationActionDataType = {
   hidden: true,
   types: ['workflow'],
   name: 'wait',
   prettyName: 'Wait',
   description: 'Pause flow for a set amount of time or until conditions are met.',
   iconName: 'Clock',
};

export default actionData;
