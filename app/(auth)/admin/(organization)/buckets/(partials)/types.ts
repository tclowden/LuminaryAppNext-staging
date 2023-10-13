// The user details associated with a bucket

export type Lead = {
   id: string;
   firstName: string | null;
   lastName: string | null;
   phoneNumber: string;
   statusId: string | null;
   status: {
      id: string;
      name: string;
   };
   leadSourceId: string | null;
   leadSource: {
      id: string;
      name: string;
   };
   actionsConfig?: {
      edit?: boolean;
      delete?: boolean;
   };
};

export type bucketUser = {
   id: string;
   firstName: string;
   lastName: string;
};

export type bucketLeadSources = {
   id: string;
   name: string;
   endpoint: string;
};

export type bucketStatuses = {
   id: string;
   name: string;
};

export type bucketType = {
   id: string;
   typeName: string;
};

export type orderCriteria = {
   id: string;
   field: 'statusId' | 'sourceId';
   name: string;
};

// The main data structure for a bucket
export type Bucket = {
   id: string;
   name: string;
   isDefaultBucket: boolean;
   isActive: boolean;
   numLeads: number;
   leads: Lead[];
   bucketUsers: bucketUser[];
   bucketLeadSources: bucketLeadSources[];
   bucketStatuses: bucketStatuses[];
   bucketType: bucketType;
   orderCriteria: any;
};

export type leadTableRow = {
   fullName: string;
   id: number;
   phoneNumber: number;
   status: string;
   leadSource: string;
};

export type LeadSource = {
   id: string;
   name: string;
   typeId: string;
   selected?: boolean;
};

export type LeadSourceType = {
   id: string;
   typeName: string;
   leadSources: LeadSource[] | [];
   selected?: boolean;
};
