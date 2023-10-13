'use client';
import Link from 'next/link';
import React from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { setTippyClose, setTippyOpen } from '../../../store/slices/tippy';

interface Props {
   path: string;
   openInNewTab?: boolean;
   children: React.ReactNode;
}

const TableCellLink = ({ path, openInNewTab, children }: Props) => {
   const dispatch = useAppDispatch();
   const generatedId = Math.floor(Math.random() * 10000).toString();

   const showTooltip = (e: any) => {
      const { offsetWidth, scrollWidth } = e.target;
      if (offsetWidth < scrollWidth) {
         dispatch(
            setTippyOpen({
               content: children,
               anchorId: `tableCellLink-${generatedId}`,
               isOpen: true,
            })
         );
      }
   };

   const hideTooltip = (e: any) => {
      const { offsetWidth, scrollWidth } = e.target;
      if (offsetWidth < scrollWidth) dispatch(setTippyClose({}));
   };

   return (
      <Link
         id={`tableCellLink-${generatedId}`}
         className='text-lum-blue-500 block truncate'
         href={path}
         target={openInNewTab ? '_blank' : '_self'}
         onMouseEnter={showTooltip}
         onMouseLeave={hideTooltip}>
         {children}
      </Link>
   );
};

export default TableCellLink;
