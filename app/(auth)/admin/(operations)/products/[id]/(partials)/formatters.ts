export const formatTasksOnProduct = (tasksOnProduct: Array<any>, taskDueDateTypes: Array<any>) => {
   if (!tasksOnProduct) return [];
   return [...tasksOnProduct].map((taskOnProd: any) => ({
      ...taskOnProd,
      // will need to add icon config for timeframe here
      // hard code this for now
      daysToComplete: 0,
      taskDueDateType: taskDueDateTypes[0],
      taskDueDateTypesLookupId: taskDueDateTypes[0]?.id,
   }));
};

export const formatCoordinatorsOnProduct = (coordinatorsOnProduct: Array<any>) => {
   if (!coordinatorsOnProduct) return [];

   const getRolesNamesString = (roles: Array<any>) => {
      let roleNames = '';
      roles?.forEach((role: any) => (roleNames += role.name + ', '));
      return roleNames.substring(0, roleNames.length - 2);
   };

   // loop through and create a string of all the roles for each coordinator on product
   return [...coordinatorsOnProduct].map((coordOnProd: any) => ({
      ...coordOnProd,
      productCoordinator: {
         ...coordOnProd?.productCoordinator,
         // remove the space & comma at the end
         roleNames: getRolesNamesString(coordOnProd?.productCoordinator?.roles),
      },
   }));
};

export const formatFieldsOnProduct = (fieldsOnProduct: Array<any>) => {
   if (!fieldsOnProduct) return [];
   return [...fieldsOnProduct].map((fieldOnProd: any) => {
      return {
         ...fieldOnProd,
         productField: {
            ...fieldOnProd.productField,
            typeIcon: {
               value: fieldOnProd.productField?.fieldType?.name,
               iconConfig: {
                  name: fieldOnProd.productField?.fieldType?.iconName,
                  color: fieldOnProd.productField?.fieldType?.iconColor,
               },
            },
         },
         hidden: fieldOnProd?.hidden || false,
         hideOnCreate: fieldOnProd?.hideOnCreate || false,
         required: fieldOnProd?.required || false,
      };
   });
};

export const formatStagesOnProduct = (
   stagesOnProduct: Array<any>,
   fieldsOnProduct?: Array<any>,
   tasksOnProduct?: Array<any>
) => {
   if (!stagesOnProduct) return [];
   return [...stagesOnProduct].map((stageOnProd: any) => {
      let requiredFieldsOnProduct = [];
      let requiredTasksOnProduct = [];

      if (fieldsOnProduct?.length) {
         requiredFieldsOnProduct = fieldsOnProduct.filter(
            (fieldOnProduct: any) => fieldOnProduct?.stageOnProductConstraintId === stageOnProd?.id
         );
      }

      if (tasksOnProduct?.length) {
         requiredTasksOnProduct = tasksOnProduct.filter(
            (taskOnProduct: any) => taskOnProduct?.stageOnProductConstraintId === stageOnProd?.id
         );
      }

      return {
         ...stageOnProd,
         requiredFieldsOnProduct,
         requiredTasksOnProduct,
      };
   });
};
