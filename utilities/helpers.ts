export const groupBy = (arr: any[], key: string) => {
   return arr.reduce(
      (result, item) => ({
         ...result,
         [item[key]]: [...(result[item[key]] || []), item],
      }),
      {}
   );
};

export const setObjectProp = (obj: any, path: Array<string>, value: any) => {
   const [head, ...rest] = path;
   !rest.length ? (obj[head as keyof object] = value) : setObjectProp(obj[head as keyof object], rest, value);
};

export const lumId = () => {
   return Math.random().toString(36).substring(2, 10);
};

export const getObjectProp = (obj: any, path: Array<string | number>, fallback: any = undefined) => {
   if (!path) return fallback;
   if (!obj || !!!Object.keys(obj).length) return fallback;
   return path.reduce((acc: any, curr: any) => {
      if (!acc) return fallback;
      return acc[curr as any];
   }, obj);
};

export const findMinMaxValueInArray = (arr: Array<any>, keyPath: Array<string>) => {
   if (!arr || arr.length === 0) return { min: undefined, max: undefined };

   let minVal = getObjectProp(arr[0], keyPath);
   let maxVal = getObjectProp(arr[0], keyPath);

   for (let i = 1; i < arr.length; i++) {
      const val = getObjectProp(arr[i], keyPath);
      if (val < minVal) {
         minVal = val;
      } else if (val > maxVal) {
         maxVal = val;
      }
   }

   return { min: minVal, max: maxVal };
};

export const getDayCount = (greaterDate: Date, lesserDate: Date) => {
   const d1 = new Date(greaterDate);
   const d2 = new Date(lesserDate);
   const diffInTime = d1.getTime() - d2.getTime();
   const diffInDays = Math.round(diffInTime / (1000 * 3600 * 24));
   return diffInDays;
};

export const camelCaseToTitleCase = (word: string) => {
   const result = word.replace(/([A-Z])/g, ' $1');
   const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
   return finalResult;
};

export const getTimeDuration = (seconds: number) => {
   if (typeof seconds !== 'number') return null;

   if (seconds < 60) {
      return 'Less than 1 minute';
   } else if (seconds < 300) {
      return 'Less than 5 minutes';
   } else if (seconds < 900) {
      return 'Less than 15 minutes';
   } else if (seconds < 1800) {
      return 'Less than 30 minutes';
   } else if (seconds < 3600) {
      return 'Less than 1 hour';
   } else if (seconds >= 3600 && seconds < 7200) {
      return '1 hour';
   } else if (seconds >= 7200 && seconds < 86400) {
      return `${Math.floor(seconds / 3600)} hours`;
   } else if (seconds < 86400) {
      return 'Less than 1 day';
   } else if (seconds >= 86400 && seconds < 172800) {
      return '1 day';
   } else if (seconds < 604800) {
      return `${Math.floor(seconds / 86400)} days`;
   } else if (seconds >= 604800 && seconds < 1209600) {
      return '1 week';
   } else if (seconds < 2592000) {
      return `${Math.floor(seconds / 604800)} weeks`;
   } else if (seconds < 5184000) {
      return '1 month';
   } else if (seconds < 31536000) {
      return `${Math.floor(seconds / 2592000)} months`;
   } else if (seconds < 63072000) {
      return '1 year';
   } else {
      return `${Math.floor(seconds / 31536000)} years`;
   }
};

export const strToCamelCase = (str: string) => {
   return str
      ?.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
         return index === 0 ? word.toLowerCase() : word.toUpperCase();
      })
      .replace(/\s+/g, '');
};

export const getFormattedPhoneNumber = (phoneNumber?: string): string | undefined => {
   if (!phoneNumber) return;
   // Remove any non-digit characters from the input
   const digitsOnly = phoneNumber.replace(/\D/g, '');

   // Use a regular expression to format the phone number
   const formattedNumber = digitsOnly.replace(/^1?(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3');
   return formattedNumber;
};

export const formatPhoneNumber = (phoneNumber?: string): string | undefined => {
   if (!phoneNumber) return;

   var formattedNumber = phoneNumber.replace(/(\d{1,2})(\d{1})?(\d{1,3})?(\d{1,4})?/, function (_, p1, p2, p3, p4) {
      let output = '';
      if (p1) output = `(${p1}`;
      if (p2) output += `${p2})`;
      if (p3) output += ` ${p3}`;
      if (p4) output += `-${p4}`;
      return output;
   });

   return formattedNumber;
};

export const formatSecondsAsTimer = (seconds: number): string => {
   const hours = Math.floor(seconds / 3600);
   const minutes = Math.floor((seconds % 3600) / 60);
   const remainingSeconds = seconds % 60;

   let formattedTime = '';

   if (hours > 0) {
      formattedTime += hours + ':';
      if (minutes < 10) {
         formattedTime += '0';
      }
   }

   formattedTime += minutes + ':';

   if (remainingSeconds < 10) {
      formattedTime += '0';
   }

   formattedTime += remainingSeconds;

   return formattedTime;
};

export const deepCopy = (data: any) => {
   return JSON.parse(JSON.stringify(data));
};

export const formatPostgresTimestamp = (postgresDateTime: any) => {
   // ex) postgresDateTime = 2023-06-19T17:36:14.854Z
   // The Date object automatically adjusts the date and time based on the local time zone settings of the environment in which the code is executed.
   if (!postgresDateTime) return;
   const date = new Date(postgresDateTime);

   // Format date
   const formattedDate =
      `${(date.getMonth() + 1).toString().padStart(2, '0')}/` +
      `${date.getDate().toString().padStart(2, '0')}/` +
      `${date.getFullYear().toString().substr(-2)}`;

   // Format time
   let hours = date.getHours();
   const minutes = date.getMinutes();
   const amPm = hours >= 12 ? 'PM' : 'AM';
   hours %= 12;
   hours = hours || 12;
   const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${amPm}`;

   // Combine date and time
   const formattedDateTime = `${formattedDate} - ${formattedTime}`;
   return formattedDateTime;
};

export const convertFormDataToJson = (formData: any) => {
   const obj: any = {};
   formData.forEach((value: any, key: string) => (obj[key] = value));
   return obj;
};

export const removeStringDuplicatesFromArray = (arr: Array<string>) => {
   return arr.filter((item, index) => arr.indexOf(item) === index);
};

export const convertNumberToCurrency = (num: number) => {
   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
   }).format(num);
};

export const formatNumber = (num: number, demicalCount?: number) => {
   return num.toLocaleString('en-US', {
      maximumFractionDigits: demicalCount ?? 0,
   });
};

export const getDisplayName = (names: Array<any>, fallback: string = 'Unknown') => {
   const filteredNames = names.filter((name: string) => !!name);
   if (!!filteredNames?.length) {
      return filteredNames.join(' ').trim();
   } else {
      return fallback;
   }
};

export const StringConverter = {
   toUpperCase: (str: any) => str.toUpperCase(),
   toLowerCase: (str: any) => str.toLowerCase(),
   reverse: (str: any) => str.split('').reverse().join(''),

   toDashCase: (str: any) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
   toCamelCase: (str: any) => str.replace(/[-_]\w/g, (match: any) => match.charAt(1).toUpperCase()),
   toSnakeCase: (str: any) => str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(),

   // @ts-ignore
   convert: function (str: any, method: any) {
      // @ts-ignore
      if (this[method]) return this[method](str);
      else throw new Error(`Method ${method} not found in StringConverter`);
   },
};
