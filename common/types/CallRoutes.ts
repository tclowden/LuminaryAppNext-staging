export interface CallRoute {
   id?: string;
   name?: string;
   description?: string;
   archived?: boolean;
}

export interface ActionOnCallRoute {
   id?: string;
   callRouteId?: string;
   actionTypeId?: string;
   type?: CallRouteActionType;
   userIdsToDial?: Array<string>;
   roleIdsToDial?: Array<string>;
   waitSeconds?: number;
   displayOrder?: number;
   messageToSay?: string;
   waitMusicUrl?: string;
   archived?: boolean;
   tempId?: string;
}

export interface CallRouteActionType {
   id?: string;
   name?: string;
   archived?: boolean;
}
