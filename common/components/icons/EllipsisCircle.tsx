import { SVGProps, forwardRef, Ref } from 'react';
const SvgEllipsisCircle = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 18'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#ellipsis-circle_svg__a)'>
         <path d='M9 0a9 9 0 1 0 9 9 9.01 9.01 0 0 0-9-9ZM6.375 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM9 7.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.125 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z' />
      </g>
      <defs>
         <clipPath id='ellipsis-circle_svg__a'>
            <path d='M0 0h18v18H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgEllipsisCircle);
export default ForwardRef;
