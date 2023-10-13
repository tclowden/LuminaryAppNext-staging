import { AutomationActionDataType, AutomationActionProps } from '../actions';

export interface ActionProps
   extends AutomationActionProps<{
      selectedProduct: any;
      selectedField: any;
      requiredStatus: any;
   }> {}

const actionData: AutomationActionDataType = {
   types: ['operations'],
   name: 'make_field_required',
   prettyName: 'Change Field: Required',
   description: 'Change a field to Required or Not Required.',
   iconName: '',
};

export default actionData;
