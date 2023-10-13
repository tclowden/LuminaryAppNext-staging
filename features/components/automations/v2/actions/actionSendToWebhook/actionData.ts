import { AutomationActionDataType, AutomationActionProps } from '../actions';

export interface ActionProps
   extends AutomationActionProps<{
      // webhookType: any;
      webhookName: any;
      webhookUrl: any;
      // webhookMethod: any;
      webhookDescription: any;
      // selectedWebhook: any;
   }> {}

const actionData: AutomationActionDataType = {
   types: ['notification'],
   name: 'webhook',
   prettyName: 'Send to Webhook',
   description: 'Send data to an external service via webhook.',
   iconName: '',
};

export default actionData;
