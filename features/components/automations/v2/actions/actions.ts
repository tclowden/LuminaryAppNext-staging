import { ReactNode } from 'react';

export interface AutomationActionProps<T extends {}> {
   options: T;
   onData: (options: T) => void;
}

export type AutomationActionDataType = {
   hidden?: boolean;
   types: ['operations' | 'marketing' | 'notification' | 'workflow'];
   name: string;
   prettyName: string;
   description: string;
   iconName: string;
};

export interface AutomationActionType extends AutomationActionDataType {
   Modal: ({ options }: any) => JSX.Element;
   Tile: ({ options }: any) => ReactNode;
}
