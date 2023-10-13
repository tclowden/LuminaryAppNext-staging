'use both'
import { AutomationTriggerDataType, AutomationTriggerProps } from '../triggers';

export interface TriggerProps
   extends AutomationTriggerProps<{
   }> {}

const triggerData: AutomationTriggerDataType = {
   types: ['operations'],
   name: 'task_completed',
   prettyName: 'Task Completed',
   description: 'Run automation whenever selected task is completed.',
   iconName: '',
};

export default triggerData;
