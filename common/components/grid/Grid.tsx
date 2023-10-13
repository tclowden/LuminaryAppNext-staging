import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
   columnCount?: number;
   columnMinWidth?: string;
   columnGap?: 0 | 10 | 20 | 24 | 72;
   rowGap?: 0 | 5 | 10 | 20 | 24 | 30;
   breakPoint?: 'sm' | 'md' | 'lg' | 'xl';
   colSpan?: number;
   responsive?: boolean;
   className?: string;
   children?: React.ReactNode | React.ReactNode[];
}

const Grid = React.forwardRef(
   (
      {
         columnCount = 1,
         columnMinWidth = '100%',
         columnGap = 20,
         rowGap = 10,
         colSpan = 1, // columns to span
         breakPoint = 'lg',
         responsive = false,
         className,
         children,
      }: Props,
      ref: any
   ) => {
      const breakPoints = { sm: '500px', md: '750px', lg: '1000px', xl: '1200px' };

      return (
         <>
            <style jsx>{`
               .grid-component {
                  grid-template-columns: repeat(${columnCount}, minmax(0, 1fr));
                  grid-column: span ${colSpan} / span ${colSpan};
               }

               @media screen and (max-width: ${breakPoints[breakPoint]}) {
                  .grid-responsive {
                     grid-template-columns: repeat(auto-fill, minmax(${columnMinWidth}, 1fr));
                     grid-column: span 1 / span 1;
                  }
               }
            `}</style>
            <div
               ref={ref}
               style={{
                  display: 'grid',
                  columnGap: `${columnGap}px`,
                  rowGap: `${rowGap}px`,
               }}
               className={twMerge(`
               grid-component grid-rows-[max-content]
               ${responsive && 'grid-responsive'}
               ${className && className}
            `)}>
               {children}
            </div>
         </>
      );
   }
);

Grid.displayName = 'Grid';

export default Grid;
