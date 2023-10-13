'use both'
import { AutomationTriggerDataType, AutomationTriggerProps } from '../triggers';

export interface TriggerProps
   extends AutomationTriggerProps<{
   }> {}

const triggerData: AutomationTriggerDataType = {
   types: ['operations'],
   name: 'order_created',
   prettyName: 'Order Created',
   description: 'Run automation whenever an order is created.',
   iconName: '',
};

export default triggerData;
