export type BucketResponse = {
   id: string;
   isActive: boolean;
   isDefaultBucket: boolean;
   name: string;
   leadsCount: string;
   bucketType: {
      id: string;
      typeName: string;
   };
};

export type Lead = {
   id: string;
   firstName: string;
   lastName: string;
   phoneNumber: any;
   callStatus?: 'Upcoming' | 'Dialing' | 'Left Voicemail' | 'Connected' | 'No Answer';
   [key: string]: any;
};

export type AutoDialingStatus = boolean | 'paused';
