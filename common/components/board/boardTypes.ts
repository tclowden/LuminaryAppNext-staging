export interface ColumnType {
   keyPath?: Array<string | number>; // path to value in the obj
   title?: string; // name of column
   colSpan?: number; // number of coluns to span across... has a min width set (column span * default column size)
   // fixedWidth?: boolean; // making sure the column will always be a certain width | DEFAULT: FALSE (Except for Actions column... | DEFAULT: TRUE)
   textCenter?: boolean; // column text centered in the cell | DEFAULT: FALSE
   items: Array<any>;
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

export const DEFAULT_COLUMN_SIZE: number = 130;
