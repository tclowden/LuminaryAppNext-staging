export type AutomationTriggerExecutionType = {
   leadId: string | null;
   orderId: string | null;
   executorId: string | null;
   prevValue: string | null;
   newValue: string | null;
};

export type AutomationExecutionResult = {
   success: boolean;
   message: string;
};

const triggerNameList = [
   'field_updated',
   'inbound_webhook',
   'order_created',
   'stage_updated',
   'task_completed',
   'task_past_due',
   'team_scheduled',
   'assigned_status',
   'assigned_status_type',
   'lead_created',
   'inbound_webhook',
] as const;

export type TriggerNames = (typeof triggerNameList)[number];
