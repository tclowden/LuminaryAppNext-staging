import React from 'react';
import { IconColors } from '../Icon';
import { LuminaryColors } from '../../types/LuminaryColors';

export interface ActionsType {
   icon: string;
   actionKey: string;
   toolTip?: string;
   callback: ({
      event,
      actionKey,
      item,
      newData,
   }: {
      event: Event;
      actionKey: string;
      item: any;
      newData: Array<any>;
   }) => void;
}
export interface ColumnType {
   keyPath?: Array<string | number>; // path to value in the obj
   title?: string; // name of column
   colSpan?: number; // number of coluns to span across... has a min width set (column span * default column size)
   fixedWidth?: boolean; // making sure the column will always be a certain width | DEFAULT: FALSE (Except for Actions column... | DEFAULT: TRUE)
   sortable?: boolean; // columns can sort the table | DEFAULT: FALSE
   textCenter?: boolean; // column text centered in the cell | DEFAULT: FALSE
   ellipsis?: boolean; // add "..." at the end of the string instead of wrapping to a new line | DEFAULT: TRUE
   render?: ({
      column,
      item,
      callback,
   }: {
      column: ColumnType;
      item: any;
      callback: (e: any) => void;
   }) => React.ReactNode; // render function to render multiple things in the cell
}
interface DataObjType {
   value?: string | number;
   iconConfig?: { name: string; color?: IconColors };
}
export interface ActionsConfig {
   [key: string]: boolean | string | { disable: boolean; color: IconColors; toolTip?: string };
}
export interface RowConfig {
   [key: string]:
      | boolean
      | string
      | { color: LuminaryColors; opacity: 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 };
}
export interface DataType {
   actionsConfig: ActionsConfig;
   rowConfig: RowConfig;
   selected?: boolean;
   [key: string | number]: any | DataObjType;
}

export const DEFAULT_COLUMN_SIZE: number = 130;

export interface PaginationOptions {
   rowsPerPage: number;
   selectAllRows: boolean;
   totalCount?: number;
}

export interface PaginationPageState {
   prevPage: number;
   currPage: number;
}

export interface PaginationConfig {
   offset: number;
   limit: number;
   fetch: boolean;
}

export interface SortingConfiguration {
   column: ColumnType;
   sortType: SortingType;
   sortExpandableData?: boolean;
   fetch?: boolean;
}

export enum SortingType {
   ASC,
   DESC,
}
