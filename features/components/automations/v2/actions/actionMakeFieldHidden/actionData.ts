import { AutomationActionDataType, AutomationActionProps } from '../actions';

export interface ActionProps
   extends AutomationActionProps<{
      selectedProduct: any;
      selectedField: any;
      hiddenStatus: any;
   }> {}

const actionData: AutomationActionDataType = {
   types: ['operations'],
   name: 'make_field_hidden',
   prettyName: 'Change Field: Hidden',
   description: 'Change a field to Hidden or Not Hidden.',
   iconName: '',
};

export default actionData;
