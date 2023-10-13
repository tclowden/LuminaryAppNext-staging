import { AutomationActionDataType, AutomationActionProps } from '../actions';

export interface ActionProps
   extends AutomationActionProps<{
      emailRecipientType:  { id: string, status: string };
      selectedProduct: any;
      selectedCoordinatorRole: any;
      selectedRole: any;
      fromName: any;
      fromEmail: any;
      toEmail: any;
      subject: any;
      message: any;
      ccEmail: any;
   }> {}

const actionData: AutomationActionDataType = {
   types: ['notification'],
   name: 'send_email',
   prettyName: 'Send Email',
   description: 'Send an automated email.',
   iconName: 'Mail',
};

export default actionData;
