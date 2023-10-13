export interface PhoneNumber {
   id?: string;
   number?: string;
   numberSID?: string;
   active?: boolean;
   typeId?: string;
   prettyNumber?: string;
   type?: any;
   usersOnPhoneNumber?: any;
   leadSourcesOnPhoneNumber?: any;
   callRoutesOnPhoneNumber?: any;
   archived?: boolean;
}

export interface PhoneNumberType {
   id?: string;
   name: string;
}
