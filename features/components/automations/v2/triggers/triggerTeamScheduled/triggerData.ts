'use both'
import { AutomationTriggerDataType, AutomationTriggerProps } from '../triggers';

export interface TriggerProps
   extends AutomationTriggerProps<{
   }> {}

const triggerData: AutomationTriggerDataType = {
   types: ['operations'],
   name: 'team_scheduled',
   prettyName: 'Team is Scheduled',
   description: 'Run automation whenever selected team is scheduled.',
   iconName: '',
};

export default triggerData;
