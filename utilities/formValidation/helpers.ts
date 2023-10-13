export const touchErrors = (errors: {}) => {
   return Object.entries(errors).reduce((acc: any, [field, fieldError]: any) => {
      acc[field] = { ...fieldError, touched: true };
      return acc;
   }, {});
};
