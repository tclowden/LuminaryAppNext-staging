'use both'
import { AutomationTriggerDataType, AutomationTriggerProps } from '../triggers';

export interface TriggerProps
   extends AutomationTriggerProps<{
      selectedStatusType: any;
   }> {}

const triggerData: AutomationTriggerDataType = {
   types: ['marketing'],
   name: 'assigned_status_type',
   prettyName: 'Assigned a Status Type',
   description: 'Run automation whenever selected status type is assigned.',
   iconName: '',
};

export default triggerData;
