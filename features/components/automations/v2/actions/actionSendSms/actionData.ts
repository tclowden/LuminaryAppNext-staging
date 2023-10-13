import { AutomationActionDataType, AutomationActionProps } from '../actions';

export interface ActionProps
   extends AutomationActionProps<{
      smsRecipientType: any;
      selectedProduct: any;
      selectedCoordinatorRole: any;
      selectedRole: any;
      selectedUser: any;
      toSms: any;
      message: any;
   }> {}

const actionData: AutomationActionDataType = {
   types: ['notification'],
   name: 'send_sms',
   prettyName: 'Send SMS',
   description: 'Send an automated SMS Message.',
   iconName: 'MessageBubble',
};

export default actionData;
