export class LeadIngestion {
   readonly rawData: object;
   readonly firstName: string;
   readonly lastName: string;
   readonly phoneNumber: string;

   constructor(data: any) {
      this.rawData = data;
      this.firstName = data?.firstName;
      this.lastName = data?.lastName;
      // this.phoneNumber = data?.phoneNumber;
      this.phoneNumber = this.validatePhoneNumber(data?.phoneNumber);
   }

   validatePhoneNumber(phoneNumber: string) {
      let phone = phoneNumber.replace(/\D/g, '');
      return phone;
   }

   parseWebhookRequest(jsonObject: object) {
      let keyValuePairs: any[] = [];

      function traverseObject(obj: any, parentKey = '') {
         for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
               let nestedKey = parentKey ? parentKey + '.' + key : key;
               let value = obj[key];
               keyValuePairs.push({ key: nestedKey, keyPath: key, value: value });

               if (typeof value === 'object') traverseObject(value, nestedKey);
            }
         }
      }

      traverseObject(jsonObject);
      return keyValuePairs;
   }
}

// Create a list of all the keys , key paths, and values from the payload
function listKeyValuePairs(jsonObject: object) {
   let keyValuePairs: any[] = [];

   function traverseObject(obj: any, parentKey = '') {
      for (let key in obj) {
         if (obj.hasOwnProperty(key)) {
            let nestedKey = parentKey ? parentKey + '.' + key : key;
            let value = obj[key];
            keyValuePairs.push({ key: nestedKey, keyPath: key, value: value });

            if (typeof value === 'object') traverseObject(value, nestedKey);
         }
      }
   }

   traverseObject(jsonObject);
   return keyValuePairs;
}

function getNestedProperty(obj: any, key: string) {
   const keys = key.split('.');
   let value = obj;

   for (let i = 0; i < keys.length; i++) {
      if (value && typeof value === 'object' && keys[i] in value) {
         value = value[keys[i]];
      } else {
         return undefined;
      }
   }

   return value;
}

const jsonObject = {
   name: 'John',
   age: 30,
   address: {
      street: '123 Main St',
      city: 'New York',
      country: { USA: 'test' },
   },
   hobbies: ['reading', 'painting'],
};

const jsonObject2 = {
   // name: "John",
   age: 30,
   address: {
      street: '123 Main St',
      city: 'New York',
      country: { USA: 'test' },
   },
   hobbies: ['reading', 'painting'],
};

const keyValuePairs = listKeyValuePairs(jsonObject);

// console.log(keyValuePairs);

const test = keyValuePairs.map((item, i) => {
   const val = getNestedProperty(jsonObject2, item.key);
   console.log(item.key, '=>', val);
   return val;
});
