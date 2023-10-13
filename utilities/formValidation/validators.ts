import { LengthConfig, ParamConfig } from './types';

// Validators return false, indicating that there is no error

export const required = (field: string, value: any, paramConfig: ParamConfig): string | boolean => {
   if (value === null || typeof value === 'undefined' || value.length === 0) {
      return paramConfig?.errorMessage || `${field} is required.`;
   } else return false;
};

export const email = (field: string, value: any, paramConfig: ParamConfig) => {
   if (!new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(value)) {
      return paramConfig?.errorMessage || `Must be a valid email address.`;
   } else return false;
};

export const confirmPassword = (field: any, value: any, paramConfig: ParamConfig, pwToCompare: any) => {
   if (value !== pwToCompare) {
      return paramConfig?.errorMessage || `Passwords must match.`;
   } else return false;
};

export const string = (field: string, value: any, paramConfig: ParamConfig) => {
   // make sure to double check the value isn't equal to empty string
   if (typeof value !== 'string' || value === '') {
      return paramConfig?.errorMessage || `Must be of type string.`;
   } else return false;
};

export const phone = (field: string, value: any, paramConfig: ParamConfig) => {
   // Will pass if formatted like:
   //~ 1234564567, 11234564567, +11234564567
   //~ (123)456-4567, 1(123)4564567, +1(123)4564567
   //~ 123-456-4567, 1-123-456-4567, +1-123-456-4567
   //~ 123 456 4567, 1 123 456 4567, +1 123 456 4567

   // valid --> +11234564567
   // pretty --> (123) 456-4567
   if (!new RegExp(/^(\+?\s?\d{1})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/).test(value)) {
      return paramConfig?.errorMessage || `Must be a valid phone number.`;
   } else return false;
};

export const url = (field: string, value: any, paramConfig: ParamConfig) => {
   // Will pass if formatted like:
   //~ checks one or none of the following: `ftp://`, `http://`, or `https://`
   //~ optional `www.`
   //~ checks for any number of valid characters
   //~ checks for domain & that domain is at least 2 characters
   if (!new RegExp(/^((ftp|http|https):\/\/)?([A-z]+)\.([A-z]{2,})/).test(value)) {
      return paramConfig?.errorMessage || `Must be a valid url.`;
   } else return false;
};

export const number = (field: string, value: any, paramConfig: ParamConfig) => {
   if (isNaN(+value)) {
      return paramConfig?.errorMessage || `${field} must be of type number.`;
   } else return false;
};

// works for datetime as well
export const date = (field: string, value: any, paramConfig: ParamConfig) => {
   if (isNaN(Date.parse(value))) {
      return paramConfig?.errorMessage || `Must be a proper date.`;
   } else return false;
};

export const time = (field: string, value: any, paramConfig: ParamConfig) => {
   if (!new RegExp(/^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/).test(value)) {
      return paramConfig?.errorMessage || `Must be a proper time.`;
   } else return false;
};

export const minLength = (field: string, value: any, paramConfig: LengthConfig) => {
   // subtracting 2 because of the quotes with JSON.stringify()
   if (JSON.stringify(value).length - 2 < (paramConfig?.value || paramConfig)) {
      return paramConfig.errorMessage || `Must be minimum of ${paramConfig?.value || paramConfig} characters.`;
   } else return false;
};

export const maxLength = (field: string, value: any, paramConfig: LengthConfig) => {
   // subtracting 2 because of the quotes with JSON.stringify()
   if (JSON.stringify(value).length - 2 > (paramConfig?.value || paramConfig)) {
      return paramConfig.errorMessage || `Must be maximum of ${paramConfig.value || paramConfig} characters.`;
   } else return false;
};

export const isObject = (field: string, value: any, paramConfig: ParamConfig) => {
   if (!(typeof value === 'object' && !Array.isArray(value) && value !== null)) {
      return paramConfig?.errorMessage || `Must be of type object.`;
   } else return false;
};

export const isArrayType = (field: string, value: any, paramConfig: ParamConfig) => {
   if (!Array.isArray(value)) {
      return paramConfig.errorMessage || `${field} must be of type array.`;
   } else return false;
};
