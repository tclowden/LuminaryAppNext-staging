export type AutomationActionExecutionType = {
   leadId: string | null;
   orderId: string | null;
   executorId: string | null;
   prevValue: string | null;
   newValue: string | null;
   prevResults?: any;
};

export type AutomationExecutionResult = {
   success: boolean;
   message: string;
   results: any;
   // status?: 'Failed' | 'Waiting';
   status?: 'New' | 'Success' | 'Failed' | 'Running' | 'Waiting' | 'Filtered';
};
