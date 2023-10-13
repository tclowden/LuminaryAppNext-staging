import { ReactNode } from 'react';

export interface AutomationTriggerProps<T extends {}> {
   options: T;
   onData: (options: T) => void;
}

export type AutomationTriggerDataType = {
   hidden?: boolean;
   types: ['operations' | 'marketing' | 'notification' | 'workflow'];
   name: string;
   prettyName: string;
   description: string;
   iconName: string;
};

export interface AutomationTriggerType extends AutomationTriggerDataType {
   Modal: ({ options }: any) => JSX.Element;
   TileDescription: ({ options }: any) => ReactNode;
}
