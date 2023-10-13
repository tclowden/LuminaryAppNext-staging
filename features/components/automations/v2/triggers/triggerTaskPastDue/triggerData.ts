'use both'
import { AutomationTriggerDataType, AutomationTriggerProps } from '../triggers';

export interface TriggerProps
   extends AutomationTriggerProps<{
   }> {}

const triggerData: AutomationTriggerDataType = {
   types: ['operations'],
   name: 'task_past_due',
   prettyName: 'Task is Past Due',
   description: 'Run automation whenever selected task is past due.',
   iconName: '',
};

export default triggerData;
