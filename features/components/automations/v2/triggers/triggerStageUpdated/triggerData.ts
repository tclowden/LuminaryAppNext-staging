'use both'
import { AutomationTriggerDataType, AutomationTriggerProps } from '../triggers';

export interface TriggerProps
   extends AutomationTriggerProps<{
      selectedProduct: any;
      selectedStage: any;
   }> {}

const triggerData: AutomationTriggerDataType = {
   types: ['operations'],
   name: 'stage_updated',
   prettyName: 'Stage Updated',
   description: 'Run automation whenever selected field is updated.',
   iconName: '',
};

export default triggerData;
