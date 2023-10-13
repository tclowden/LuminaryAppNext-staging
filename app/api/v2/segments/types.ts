export type Model = 'leadSourceId' | 'leadSourceTypeId' | 'statusId' | 'statusTypeId';
export type Column = 'Lead Source' | 'Lead Source Type' | 'Status' | 'Status Type';

export type ModelInfo = {
   alias: string;
   model: string;
};

export type ModelMap = {
   [key in Column]: Model | ModelInfo;
};

export type ColumnValue = {
   id: number;
   columnValue: string;
};

export type ComparisonOperator = 'Is Not' | 'Is Not In' | 'Is' | 'Is In';

export type FilterPayloadType = {
   columnDisplayName: keyof ModelMap;
   columnValues: ColumnValue[];
   comparisonOperator: ComparisonOperator;
};
