'use both'
import { AutomationTriggerDataType, AutomationTriggerProps } from '../triggers';

export interface TriggerProps
   extends AutomationTriggerProps<{
      selectedStatus: any;
   }> {}

const triggerData: AutomationTriggerDataType = {
   types: ['marketing'],
   name: 'assigned_status',
   prettyName: 'Assigned a Status',
   description: 'Run automation whenever status is assigned to a lead.',
   iconName: '',
};

export default triggerData;
