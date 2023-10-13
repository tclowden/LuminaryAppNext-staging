interface IdNameObj {
   id: number;
   name: string;
}

interface LeadershipObj {
   id: number;
   firstName?: string;
   lastName?: string;
   emailAddress?: string;
}

export interface UserData {
   id?: number;
   firstName?: string;
   lastName?: string;
   fullName?: string;
   emailAddress?: string;
   legalFirstName?: string;
   archived?: boolean;
   createdAt?: Date | string;
   phoneNumber?: string | number | null;
   profileUrl?: string | null;
   // role?: IdNameObj;
   rolesOnUser?: Array<IdNameObj>;
   office?: IdNameObj;
   teamLead?: LeadershipObj;
   divisionLead?: LeadershipObj;
   salesDirector?: LeadershipObj;
}

export interface UserProps {
   userData?: UserData;
   officesData?: IdNameObj[];
   rolesData?: IdNameObj[];
   teamLeads?: LeadershipObj[];
   divisionLeads?: LeadershipObj[];
   salesDirectors?: LeadershipObj[];
   permissionSetsData?: IdNameObj[];
   permissionsData?: IdNameObj[];
   pagesData?: IdNameObj[];
   pagePermissions?: { name: string; description?: string; expandableData?: Array<any> }[];
   customPermissions?: { name: string; description?: string; expandableData?: Array<any> }[];
}
