import React, { DragEvent } from 'react';
import './DraggableItem.css';

interface DraggableItemProps {
   order: number;
   index: number;
   item: {
      name: string;
      id: string;
   };
   onDragStart: (e: DragEvent<HTMLDivElement>, index: number) => void;
   onDragOver: (e: DragEvent<HTMLDivElement>, index: number) => void;
   onDrop: (e: DragEvent<HTMLDivElement>, index: number) => void;
   isDraggingOver: boolean;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
   order,
   index,
   item,
   onDragStart,
   onDragOver,
   onDrop,
   isDraggingOver,
}) => {
   const itemClass = isDraggingOver
      ? 'flex h-[35px] p-[5px] cursor-grab dragging-over'
      : 'flex h-[35px] p-[5px] cursor-grab';

   return (
      <div
         className={itemClass}
         key={index}
         draggable
         onDragStart={(e) => onDragStart(e, index)}
         onDragOver={(e) => onDragOver(e, index)}
         onDrop={(e) => onDrop(e, index)}>
         {`${order}. ${item.name}`}
      </div>
   );
};

export default DraggableItem;
