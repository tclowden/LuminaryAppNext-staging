'use both'
import { AutomationTriggerDataType, AutomationTriggerProps } from '../triggers';

export interface TriggerProps
   extends AutomationTriggerProps<{
   }> {}

const triggerData: AutomationTriggerDataType = {
   types: ['marketing'],
   name: 'lead_created',
   prettyName: 'Lead Created',
   description: 'Run automation whenever a lead is created.',
   iconName: '',
};

export default triggerData;
