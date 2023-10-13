'use both'
import { AutomationTriggerDataType, AutomationTriggerProps } from '../triggers';

export interface TriggerProps
   extends AutomationTriggerProps<{
   }> {}

const triggerData: AutomationTriggerDataType = {
   hidden: true,
   types: ['workflow'],
   name: 'inbound_webhook',
   prettyName: 'Inbound Webhook Triggered',
   description: 'Run automation whenever selected inblund webhook is triggered.',
   iconName: '',
};

export default triggerData;
