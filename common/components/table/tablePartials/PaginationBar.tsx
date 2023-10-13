import React, { useEffect, useRef, useState } from 'react';
import { PaginationOptions } from '../tableTypes';
import Icon from '../../Icon';
import { formatNumber } from '@/utilities/helpers';

const range = (start: number, end: number) => {
   const length = end - start + 1;
   // create array of certain length & set the elements within it from start to end value
   return Array.from({ length }, (_, i) => i + start);
};

interface Props {
   options: PaginationOptions;
   onPaginationOptionsChange: (paginationOptions: PaginationOptions) => void;
   data: Array<any>;
   paginationIndex: number;
   // paginate: (pageToNavigateTo: number) => void;
   activePage: number;
   setActivePage: (newActivePage: number) => void;
}

const PaginationBar = ({
   options,
   onPaginationOptionsChange,
   data,
   // paginate,
   paginationIndex,
   activePage,
   setActivePage,
}: Props) => {
   const selectContainerRef = useRef<any>();
   const [pages, setPages] = useState<Array<number | string>>([]);
   const [totalPages, setTotalPages] = useState<number>(1);
   const [selectOptions, setSelectOptions] = useState<any[]>([]);
   const [showSelectOptions, setShowSelectOptions] = useState<boolean>(false);

   const SIBLING_COUNT = 1;
   const INDEX_TO_SHOW_DOTS = 2;
   const DOTS = '...';

   useEffect(() => {
      if (options) {
         const totalPageCount = Math.ceil(data.length / options.rowsPerPage);
         const totalPageNumbers = SIBLING_COUNT + 5;

         // CASE 1: if the number of pages is less than the page number, return range [1..., totalPageCount];
         if (totalPageNumbers >= totalPageCount) {
            setPages(range(1, totalPageCount));
            setTotalPages(totalPageCount);
            return;
         }

         // calculate left & right sibling index... make sure they are within range [1, totalPageCount];
         const leftSibIndex = Math.max(activePage - SIBLING_COUNT, 1);
         const rightSibIndex = Math.min(activePage + SIBLING_COUNT, totalPageCount);

         // do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount.
         // leftSibIndex > 2 && rightSibIndex < totalPageCount - 2
         const showLeftDots = leftSibIndex > INDEX_TO_SHOW_DOTS;
         const showRightDots = rightSibIndex < totalPageCount - INDEX_TO_SHOW_DOTS + 1;

         const firstPageIndex = 1;
         const lastPageIndex = totalPageCount;

         // CASE 2: No left dots to show, but right dots are show
         if (!showLeftDots && showRightDots) {
            let leftItemCount = (INDEX_TO_SHOW_DOTS + 2) * SIBLING_COUNT;
            let leftRange = range(1, leftItemCount);
            setPages([...leftRange, DOTS, totalPageCount]);
            setTotalPages(totalPageCount);
            return;
         }

         // CASE 3: no right dots to show, but left dots show
         if (showLeftDots && !showRightDots) {
            let rightItemCount = INDEX_TO_SHOW_DOTS * SIBLING_COUNT;
            let rightRange = range(totalPageCount - rightItemCount - 1, totalPageCount);
            setPages([firstPageIndex, DOTS, ...rightRange]);
            setTotalPages(totalPageCount);
            return;
         }

         // CASE 4: both left & right dots to be shown
         if (showLeftDots && showRightDots) {
            let middleRange = range(leftSibIndex, rightSibIndex);
            setPages([firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]);
            setTotalPages(totalPageCount);
            return;
         }
      }
   }, [data.length, options.rowsPerPage, SIBLING_COUNT, activePage]);

   // add event listener for the row selection box, when clicking out of it
   useEffect(() => {
      const handleClickOutside = (event: Event) => {
         if (selectContainerRef.current && !selectContainerRef.current?.contains(event.target) && showSelectOptions) {
            setShowSelectOptions(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [selectContainerRef, showSelectOptions]);

   // useEffect(() => {
   //    setActivePage(paginationIndex + 1);
   // }, [paginationIndex]);

   useEffect(() => {
      if (activePage > totalPages) setActivePage(totalPages);
   }, [activePage, totalPages]);

   useEffect(() => {
      setSelectOptions(
         [
            ...data.map((val, i) => (i % 5 === 0 ? i : null)).filter((val) => val !== 0 && val !== null),
            // options.rowsPerPage,
            'All',
         ].sort((a: any, b: any) => a - b)
      );
   }, [data]);

   const handleRowCountChange = (e: Event, option: any) => {
      // return back to the first page
      // paginate(1);
      setActivePage(1);
      onPaginationOptionsChange({
         selectAllRows: true,
         rowsPerPage: option === 'All' ? data.length : option,
         totalCount: options?.totalCount,
      });
      setShowSelectOptions(!showSelectOptions);
   };

   const totalRows = data.length;

   const totalRowCountOnPage =
      options.rowsPerPage * activePage > totalRows ? totalRows : options.rowsPerPage * activePage;

   const startingIndexCount =
      options.rowsPerPage * activePage > totalRows
         ? totalRowCountOnPage - (totalRows % options.rowsPerPage) + 1
         : totalRowCountOnPage - options.rowsPerPage + 1;

   // const startingIndexCount =
   //    totalRowCountOnPage - options.rowsPerPage + 1 >= totalRows
   //       ? totalRows - options.rowsPerPage + 1
   //       : options.rowsPerPage * activePage > totalRows
   //       ? totalRowCountOnPage - (totalRows % options.rowsPerPage)
   //       : totalRowCountOnPage - options.rowsPerPage + 1;

   return (
      <div className='rounded-x-sm rounded-sm bg-lum-gray-50 dark:bg-lum-gray-650 grid grid-cols-[1fr_auto_1fr] items-center h-[40px] px-3'>
         <div className='flex flex-row items-center justify-center gap-x-2 justify-self-start'>
            <div className='text-lum-gray-600 dark:text-lum-white text-[14px] select-none'>
               {formatNumber(startingIndexCount)}-{formatNumber(totalRowCountOnPage)} of{' '}
               {(options?.totalCount && formatNumber(options?.totalCount)) || totalRows}
            </div>
            <div className='select-container relative m-0'>
               <div
                  className='select-value w-[60px] h-[30px] text-[14px] flex items-center justify-center gap-x-2 bg-lum-white dark:bg-lum-gray-600 cursor-pointer'
                  onClick={() => setShowSelectOptions(!showSelectOptions)}>
                  <span className='select-none'>{options.rowsPerPage}</span>
                  <Icon
                     name='ChevronDown'
                     className='fill-none h-[7px] w-[12px] stroke-lum-gray-600 stroke-w-[2px] dark:stroke-lum-white'
                  />
               </div>
               {showSelectOptions && (
                  <div
                     className='select-options-container bg-lum-white dark:bg-lum-gray-600 absolute -top-4 left-0 max-h-[90px] overflow-y-auto'
                     ref={selectContainerRef}>
                     {selectOptions?.map((option: number | string | null, i: number) => (
                        <div
                           key={i}
                           className={`
                              w-[60px] px-2 cursor-pointer
                              hover:bg-lum-gray-50 text-lum-gray-600 hover:text-lum-gray-700
                              dark:hover:bg-lum-gray-650 dark:hover:text-lum-white dark:text-lum-gray-50
                           `}
                           onClick={(e: any) => handleRowCountChange(e, option)}>
                           {option}
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
         <div className='flex flex-row items-center gap-x-4 mx-auto'>
            <Icon
               name='ChevronDown'
               className={`
                  rotate-90 h-[10px] w-[16px] fill-none stroke-[2]
                  ${
                     activePage === 1
                        ? 'stroke-lum-gray-200 dark:stroke-lum-gray-500'
                        : 'stroke-lum-gray-400 dark:stroke-lum-gray-200 cursor-pointer'
                  }
               `}
               onClick={(e: any) => {
                  if (activePage === 1) return;
                  // paginate(activePage - 1);
                  setActivePage(activePage - 1);
               }}
            />
            <div className='flex flex-row items-center justify-center gap-x-2'>
               {pages.map((pageNum: any, i: number) => (
                  <span
                     key={i}
                     className={`
                        w-[30px] h-[30px] flex items-center justify-center text-[14px] select-none rounded
                        ${typeof pageNum !== 'string' ? 'cursor-pointer' : ''}
                        ${
                           activePage === +pageNum
                              ? 'bg-lum-blue-500 text-lum-white'
                              : 'text-lum-gray-600 dark:text-lum-gray-200'
                        }
                     `}
                     onClick={() => {
                        if (typeof pageNum === 'string') return;
                        // paginate(+pageNum);
                        setActivePage(+pageNum);
                     }}>
                     {pageNum}
                  </span>
               ))}
            </div>
            <Icon
               name='ChevronDown'
               className={`
                  -rotate-90 h-[10px] w-[16px] fill-none stroke-[2]
                  ${
                     activePage === totalPages
                        ? 'stroke-lum-gray-200 dark:stroke-lum-gray-500'
                        : 'stroke-lum-gray-400 dark:stroke-lum-gray-200 cursor-pointer'
                  }
               `}
               onClick={(e: any) => {
                  if (activePage === totalPages) return;
                  // paginate(activePage + 1);
                  setActivePage(activePage + 1);
               }}
            />
         </div>
         <div></div>
      </div>
   );
};

export default PaginationBar;
