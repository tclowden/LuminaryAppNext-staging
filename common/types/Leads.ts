import { ActionsConfig } from '../components/table/tableTypes';

export type Section = {
   id: string;
   name: string;
   displayOrder: number;
   archived: boolean;
   leadFieldsSubsections: Array<Subsection>;
};

export type Subsection = {
   id?: string;
   name: string;
   displayOrder: number;
   archived: boolean;
   sectionId: string;
   leadFields: Array<LeadField>;
   tempId?: string;
};

export type LeadField = {
   id: string;
   label: string;
   placeholder: string;
   required: boolean;
   displayOrder: number;
   archived: boolean;
   createdAt: string;
   updatedAt: string;
   fieldTypeId: string;
   subsectionId: string | number | null;
   fieldType: FieldType;
   leadFieldOptions: Array<LeadFieldOption>;
   fieldOnLead: FieldOnLead;
};

export type FieldType = {
   id: string;
   name: string;
   iconName: string;
   iconColor: string;
   createdAt: string;
   updatedAt: string;
};

export type LeadFieldOption = {
   id?: string;
   value: string;
   displayOrder: number;
   createdAt?: string;
   updatedAt?: string;
   leadFieldId?: string;
   archived?: boolean;
};

export type FieldOnLead = {
   id?: string; // Optional in the case that FieldOnLead does not exist in the database yet
   leadId: string;
   leadFieldId: string;
   answer: string;
   archived?: boolean;
   leadField?: LeadField;
};

export type LeadSource = {
   id: string;
   name: string;
   endpoint: string;
   typeId: string;
   createdAt: string;
   updatedAt: string;
};
export interface Attachment {
   id: string;
   filePath: string;
   fileName: string;
   fileNickName?: string;
   publicUrl?: string;
   archived?: boolean;
   createdAt: string;
   updatedAt: string;
   attachmentTypeId?: string;
   leadId?: string;
   orderId?: string;
   userId?: string;
   user?: User;
}

export interface AttachmentData extends Attachment {
   actionsConfig: ActionsConfig;
}

export interface Note {
   id: 6;
   content: string;
   pinned: boolean;
   archived: boolean;
   createdAt: string;
   updatedAt: string;
   leadId: string;
   createdById: string;
   orderId: string;
   createdBy: User;
   actionsConfig?: any;
}

export interface NoteData extends Note {
   actionsConfig: ActionsConfig;
}

export interface Status {
   id?: string;
   name: string;
   typeId?: string;
}
export interface User {
   id: string;
   firstName?: string;
   lastName?: string;
   emailAddress?: string;
   passwordHash?: string;
   phoneNumber?: string;
   prefersDarkMode: boolean;
   profileUrl?: string;
   archived: boolean;
   officeId: string;
   roleId: string;
}
