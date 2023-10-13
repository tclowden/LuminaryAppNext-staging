'use client';
import React, { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
   children: React.ReactNode;
   scrollBehavior?: 'smooth' | 'auto';
   className?: string;
}

const ScrollContainer = React.forwardRef(({ children, scrollBehavior = 'auto', className }: Props, ref: any) => {
   const scrollContainerRef = useRef<any>();

   const handleScrollDown = () => {
      scrollContainerRef?.current.scrollTo({
         behavior: scrollBehavior,
         top: scrollContainerRef?.current?.scrollHeight,
      });
   };

   // handles scroll down when modal pops open
   useEffect(() => {
      if (scrollContainerRef?.current) handleScrollDown();
   }, [children, scrollContainerRef]);

   return (
      <div ref={scrollContainerRef} className={twMerge(` ${className ? className : ''} `)}>
         {children}
      </div>
   );
});

ScrollContainer.displayName = 'ScrollContainer';

export default ScrollContainer;
