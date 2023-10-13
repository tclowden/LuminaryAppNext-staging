import React, { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';

export type InputTypes = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
export type ErrorFields<T> = Partial<Record<keyof T, string>>;
export type TouchedFields<T> = Partial<Record<keyof T, boolean>>;
export type YupSchemaObject<T> = Record<keyof T, yup.AnySchema>;

const isValidationError = (err: any): err is yup.ValidationError => 'inner' in err;
function serializeYupErrors<T>(err: yup.ValidationError, touchedFields: TouchedFields<T> = {}) {
   return err?.inner?.reduce((acc: ErrorFields<T>, val: yup.ValidationError) => {
      const fieldName = val.path as keyof T | undefined;
      // only display error if it's been touched
      if (fieldName && touchedFields[fieldName]) acc[fieldName] = val.message;
      // else if (fieldName) acc[fieldName] = val.message;
      return acc;
   }, {});
}

// touch all based on values
// NOT BEING USED
const touchAll = (values: any) => {
   const newObj: any = {};
   let copy = JSON.parse(JSON.stringify(values));
   const recurse = (obj: any, parentKey?: string) => {
      for (let key of Object.keys(obj)) {
         const newKey = parentKey ? `${parentKey}.${key}` : key;
         const value = obj[key];
         // if the value of the key is an array type...
         if (Array.isArray(value)) {
            // loop through the array
            value.forEach((val: any, index: number) => {
               recurse(val, `${newKey}[${index}]`);
            });
         } else if (typeof value === 'object' && value !== null) {
            newObj[newKey] = true;
            recurse(value, newKey);
         } else {
            newObj[newKey] = true;
         }
      }
   };
   recurse(copy);
   return newObj;
};

// this will touch all fields based on the validaiton schema...
const touchAllBasedOnValSchema = (valSchema: any, values: any) => {
   const newObj: any = {};
   let copy = JSON.parse(JSON.stringify(valSchema));

   const recurse = (obj: any, parentKey?: string) => {
      Object.keys(obj).forEach((fieldKey: any, index: number) => {
         const newKey = parentKey ? `${parentKey}.${fieldKey}` : fieldKey;
         const sch = obj[fieldKey];
         if (sch.type === 'array' && sch.innerType && sch.innerType.fields) {
            newObj[newKey] = true;
            if (!values[fieldKey]) {
               // if no values... how to know what to force touch?
               // recurse(sch.innerType.fields, `${newKey}`);
            } else {
               const arrayValues = values[fieldKey];
               Object.keys(arrayValues).forEach((fk: any) => {
                  recurse(sch.innerType.fields, `${newKey}[${fk}]`);
               });
            }
            // Object.keys(sch.innerType.fields).forEach((fk: any, i: number) => {
            //    recurse(sch.innerType.fields, `${newKey}[${i}]`);
            // });
         } else if (sch.type === 'object' && sch.fields) {
            // console.log('sch:', sch);
            newObj[newKey] = true;
            recurse(sch.fields, newKey);
         } else {
            newObj[newKey] = true;
         }
      });
   };

   recurse(copy);

   return newObj;
};

const getInputValue = (input: EventTarget & HTMLInputElement) => {
   switch (input.type) {
      case 'file':
         return input.files;
      case 'checkbox':
         return input.checked;
      case 'content-editable':
         return input.innerHTML;
      default:
         return input.value;
   }
};

interface Props {
   initialValues: any;
   onSubmit: (event: any, data: any) => any;
   validationSchema?: YupSchemaObject<any>;
}
const useForm = ({ initialValues, onSubmit, validationSchema }: Props) => {
   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
   const [validateForm, setValidationForm] = useState<boolean>(false);

   const [values, setValues] = useState<any>(initialValues);
   const [errors, setErrors] = useState<ErrorFields<any>>({});
   const [touched, setTouched] = useState<TouchedFields<any>>({});

   const [errorAfterSubmit, setErrorAfterSubmit] = useState<string>();

   useEffect(() => {
      // if touched, values, or validationSchema changes...
      // if validateForm is true
      if (validateForm) validate();
   }, [touched, values, validationSchema, validateForm]);

   const validate = useCallback(
      async (options?: any) => {
         const valSchema = options?.valSchema || validationSchema;
         const updatedValues = options?.updatedValues || values;
         const updatedTouchedValues = options?.updatedTouchedValues || touched;

         if (valSchema) {
            const schema = yup.object().shape(valSchema);
            return await schema
               .validate(updatedValues, { abortEarly: false, stripUnknown: true })
               .then((res) => {
                  // if here, that means there are no errors
                  setErrors({});
                  setValidationForm(false);
                  return true;
               })
               .catch((err: any) => {
                  // if here, that means there are errors.... updated the formErrors
                  const validationErrors = serializeYupErrors(err, updatedTouchedValues);
                  setErrors(validationErrors);
                  setValidationForm(false);
                  return false;
               });
         }
      },
      [errors, values, validationSchema, touched]
   );

   const handleChange = useCallback(
      (event: any) => {
         const { target } = event;
         const input = target as EventTarget & HTMLInputElement;
         const val = getInputValue(input);
         setValues((prevState: any) => ({
            ...prevState,
            [input.name]: val,
         }));
         setValidationForm(true);
      },
      [errors]
   );

   const handleBlur = useCallback(
      (event: any) => {
         const { target: input } = event;
         if (!touched[input.name]) {
            setTouched((prevState) => ({
               ...prevState,
               [input.name]: true,
            }));
            setValidationForm(true);
         }
      },
      [touched, validate]
   );

   const handleSubmit = useCallback(
      async (event: any) => {
         event.preventDefault();

         // force touch all fields based on values obj
         // issued with this is what if the values object doens't have the existing key yet?
         // the only way around that would be to populate the object before loading the page would could be annoying
         // const updatedTouched = touchAll(values);

         // forced touch based on validation schema...
         // if an array type, using the key grab the count of elements from the values object under the same key
         // if having array, make sure to populate the values object with null values or something for this to work properly
         // look at `marketing/leads/[id]/(partials)/Orders.tsx file for an example
         const updatedTouched = touchAllBasedOnValSchema(validationSchema, values);
         setTouched((prevState: any) => {
            return {
               ...prevState,
               ...updatedTouched,
            };
         });

         try {
            setIsSubmitting(true);
            const formIsValid = await validate({ updatedTouchedValues: updatedTouched });
            if (formIsValid && onSubmit) await onSubmit(event, values);
            setIsSubmitting(false);
         } catch (err) {
            console.log('err:', err);
            setIsSubmitting(false);
            console.log('err in catch block of handleSubmit inside useForm hook');
            // const validationErrors = isValidationError(err) ? serializeYupErrors<any>(err) : {};
            // setErrors(validationErrors);
         }
      },
      [initialValues, validate, values, onSubmit]
   );

   const setMultiValues = useCallback((values: any) => {
      setValues((prevState: any) => ({ ...prevState, ...values }));
   }, []);

   const setMultiErrors = useCallback((errors: ErrorFields<any>) => {
      const touchedFields = touchAll(errors);
      setTouched((prevState: any) => ({ ...prevState, ...touchedFields }));
      setErrors((prevState) => ({ ...prevState, ...errors }));
   }, []);

   const setValue = useCallback((name: string, value: unknown) => {
      setValues((prevState: any) => ({ ...prevState, [name]: value }));
   }, []);

   const setError = useCallback((name: string, value: string) => {
      setTouched((prevState) => ({ ...prevState, [name]: true }));
      setErrors((prevState) => ({ ...prevState, [name]: value }));
   }, []);

   const resetTouched = useCallback(() => {
      setTouched({});
   }, []);

   const resetValues = useCallback((values: any = {}) => {
      setValues({ ...values });
   }, []);

   const resetErrors = useCallback(() => {
      setErrors({});
   }, []);

   const resetForm = useCallback((values: any = {}) => {
      setValues({ ...values });
      setErrors({});
      setTouched({});
   }, []);

   // all useForm props
   return {
      values,
      errors,
      touched,
      handleSubmit,
      handleChange,
      handleBlur,

      // pass key:value to add to the values/errors object
      setValue,
      setError,

      // pass an object to set to the values/errors object
      setMultiValues,
      setMultiErrors,

      // reset the state obj
      resetValues,

      // reset all the touched fields
      resetTouched,

      // reset error state obj
      resetErrors,

      // reset the form (values, errors, & touched)
      resetForm,

      // boolean to let you know the handleSubmit function has been fired & still is firing
      isSubmitting,

      // after submitting the form, you may get an error...
      // use these props
      errorAfterSubmit,
      setErrorAfterSubmit: (errorMessage: string) => {
         setErrorAfterSubmit(errorMessage);
      },
   };
};

export default useForm;

// OLD USEFORM
// 'use client';
// import React, { useEffect, useState } from 'react';
// import { touchErrors } from '../../utilities/formValidation/helpers';
// import {
//    confirmPassword,
//    date,
//    email,
//    isObject,
//    // isArrayType,
//    maxLength,
//    minLength,
//    number,
//    phone,
//    required,
//    string,
//    time,
//    url,
// } from '../../utilities/formValidation/validators';

// interface FormDataState {
//    [key: string]: any;
// }

// interface FormErrorState {
//    [key: string]: {
//       touched: boolean;
//       valid: boolean;
//       errorMessage: string;
//    };
// }

// interface Props {
//    initialValues: FormDataState;
//    validationSchema?: object;
//    onSubmit?: (e: any, formData: FormDataState) => void;
// }

// const useForm = ({ initialValues, validationSchema, onSubmit }: Props) => {
//    const [formData, setFormData] = useState<FormDataState>({ ...initialValues });
//    const [formErrors, setFormErrors] = useState<FormErrorState>({});
//    const [submitFormError, setSubmitFormError] = useState<string>();
//    const [formNeedsValidation, setFormNeedsValidation] = useState<boolean>(false);

//    useEffect(() => {
//       // build formErrors object on load & if validationSchema changes
//       if (validationSchema) {
//          setFormErrors((prevState: FormErrorState) => {
//             // let state = { ...prevState };
//             let state: any = {};
//             Object.keys(validationSchema).forEach((key: string) => {
//                state[key as keyof FormErrorState] = { touched: false, valid: false, errorMessage: '' };
//             });
//             return state;
//          });
//       }
//    }, [validationSchema]);

//    // use effect to revalidate the form everytime it's set to true
//    useEffect(() => {
//       // if true, validate form then set to false
//       if (formNeedsValidation) {
//          validateForm(formErrors, formData);
//          setFormNeedsValidation(false);
//       }
//    }, [formNeedsValidation]);

//    const validateForm = (updatedErrorData: FormErrorState, updatedFormData: FormDataState): boolean => {
//       let formIsValid = true;

//       // if no validation schema
//       if (!validationSchema) return formIsValid;

//       Object.entries(validationSchema).forEach((validationEntry: Array<any>) => {
//          const [field, validationParams] = validationEntry;
//          const value = updatedFormData[field as keyof object];

//          let errors: Array<string> = [];
//          Object.entries(validationParams).forEach((param: Array<any>) => {
//             const [key, paramConfig] = param;
//             if (!paramConfig) return;
//             let err: string | boolean = false;

//             switch (key) {
//                case 'required':
//                   err = required(field, value, paramConfig);
//                   break;
//                case 'email':
//                   // if there is no value, don't validate it
//                   // if it's required, then the required 'key' will validate it
//                   if (value === null || typeof value === 'undefined') err = false;
//                   else err = email(field, value, paramConfig);
//                   break;
//                case 'string':
//                   // if there is no value, don't validate it
//                   // if it's required, then the required 'key' will validate it
//                   if (value === null || typeof value === 'undefined') err = false;
//                   else err = string(field, value, paramConfig);
//                   break;
//                case 'phone':
//                   // if there is no value, don't validate it
//                   // if it's required, then the required 'key' will validate it
//                   if (value === null || typeof value === 'undefined') err = false;
//                   else err = phone(field, value, paramConfig);
//                   break;
//                case 'url':
//                   // if there is no value, don't validate it
//                   // if it's required, then the required 'key' will validate it
//                   if (value === null || typeof value === 'undefined') err = false;
//                   else err = url(field, value, paramConfig);
//                   break;
//                case 'number':
//                   // if there is no value, don't validate it
//                   // if it's required, then the required 'key' will validate it
//                   if (value === null || typeof value === 'undefined') err = false;
//                   else err = number(field, value, paramConfig);
//                   break;
//                case 'time':
//                   // if there is no value, don't validate it
//                   // if it's required, then the required 'key' will validate it
//                   if (value === null || typeof value === 'undefined') err = false;
//                   else err = time(field, value, paramConfig);
//                   break;
//                case 'date':
//                   // if there is no value, don't validate it
//                   // if it's required, then the required 'key' will validate it
//                   if (value === null || typeof value === 'undefined') err = false;
//                   else err = date(field, value, paramConfig);
//                   break;
//                case 'datetime':
//                   // if there is no value, don't validate it
//                   // if it's required, then the required 'key' will validate it
//                   if (value === null || typeof value === 'undefined') err = false;
//                   else err = date(field, value, paramConfig);
//                   break;
//                case 'minLength':
//                   // if there is no value, don't validate it
//                   // if it's required, then the required 'key' will validate it
//                   if (value === null || typeof value === 'undefined') err = false;
//                   else err = minLength(field, value, paramConfig);
//                   break;
//                case 'maxLength':
//                   // if there is no value, don't validate it
//                   // if it's required, then the required 'key' will validate it
//                   if (value === null || typeof value === 'undefined') err = false;
//                   else err = maxLength(field, value, paramConfig);
//                   break;
//                case 'passwordMatch':
//                   // if there is no value, don't validate it
//                   // if it's required, then the required 'key' will validate it
//                   if (value === null || typeof value === 'undefined') err = false;
//                   else err = confirmPassword(field, value, paramConfig, updatedFormData[paramConfig.ref]);
//                   break;
//                case 'object':
//                   // if there is no value, don't validate it
//                   // if it's required, then the required 'key' will validate it
//                   if (value === null || typeof value === 'undefined') err = false;
//                   else err = isObject(field, value, paramConfig);
//                   break;
//                // case 'array':
//                //    if (value === null || typeof value === 'undefined') err = false;
//                //    else {
//                //       // here want to see if there is a key of validationSchema... if there is, just recurse
//                //       console.log('field IS:::::', field);
//                //       if ('validationSchema' in paramConfig) validate(paramConfig['validationSchema'], `${field}.`);
//                //    }
//                //    break;
//                default:
//                   break;
//             }

//             // if err returns back anything other than true or false, set formIsValid to false, push err to errors array
//             if (typeof err !== 'boolean') {
//                formIsValid = false;
//                errors.push(err);
//             }
//          });

//          const newFormErrors = {
//             [field]: {
//                ...updatedErrorData[field],
//                errorMessage: errors.length ? errors[0] : '',
//                valid: errors.length ? false : true,
//                // errorMessage: typeof err === 'string' && updatedErrorData[field]?.touched ? err : '',
//                // valid: typeof err === 'string' && updatedErrorData[field]?.touched ? false : true,
//             },
//          };

//          setFormErrors((prevState: FormErrorState) => {
//             return {
//                ...prevState,
//                ...newFormErrors,
//             };
//          });
//       });

//       return formIsValid;
//    };

//    const handleChange = (e: any) => {
//       let value: any = null;
//       switch (e.target.type) {
//          case 'radio':
//          case 'checkbox':
//             value = e.target.checked;
//             break;
//          // case "date":
//          // case "datetime-local":
//          // case "file":
//          // case "hidden":
//          // case "image":
//          // case "month":
//          // case "range":
//          // case "reset":
//          // case "search":
//          // case "submit":
//          // case 'button':
//          //    // OptionSelector are buttons
//          //    value = e.target?.value || e.target?.textContent || e.target?.outerText;
//          //    break;
//          // case "time":
//          // case "week":
//          case 'textarea':
//          case 'url':
//          case 'number':
//          case 'tel':
//          case 'password':
//          case 'email':
//          case 'text':
//             value = e.target.value;
//             break;
//          default:
//             console.log('not sure how to handle this input type... configure in the useForm hook');
//             return;
//       }

//       setFormData((prevState: any) => {
//          let tempState = { ...prevState };
//          if (!e.target?.name) return tempState;
//          tempState[e.target.name] = value;
//          return tempState;
//       });
//       setFormNeedsValidation(true);
//    };

//    const handleBlur = (e: any) => {
//       setFormErrors((prevState: FormErrorState) => {
//          const tempState = { ...prevState };
//          const field = e.target?.name;
//          if (!field) return tempState;
//          const fieldError = tempState[field];
//          if (fieldError?.touched) return tempState;
//          return { ...tempState, [field]: { ...tempState[field], touched: true } };
//       });
//       setFormNeedsValidation(true);
//    };

//    const handleSubmit = (e: any, dataToAdd: {} = {}) => {
//       e.preventDefault();
//       // force touch all feilds
//       const updatedErrors = touchErrors(formErrors);
//       const formIsValid = validateForm(updatedErrors, formData);
//       if (!formIsValid) return;
//       else onSubmit && onSubmit(e, { ...formData, ...dataToAdd });
//    };

//    const handleSubmitFormError = (errorMessage: string) => {
//       setSubmitFormError(errorMessage);
//    };

//    return {
//       formData,
//       formErrors,
//       submitFormError,
//       handleChange,
//       handleBlur,
//       handleSubmit,
//       handleSubmitFormError,
//       setFormData,
//       setFormErrors,
//    };
// };

// export default useForm;
