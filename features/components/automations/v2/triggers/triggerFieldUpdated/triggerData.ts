'use both'
import { AutomationTriggerDataType, AutomationTriggerProps } from '../triggers';

export interface TriggerProps
   extends AutomationTriggerProps<{
   }> {}

const triggerData: AutomationTriggerDataType = {
   types: ['operations'],
   name: 'field_updated',
   prettyName: 'Field Updated',
   description: 'Run automation whenever selected field is updated.',
   iconName: '',
};

export default triggerData;
