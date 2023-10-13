import { SVGProps, forwardRef, Ref } from 'react';
const SvgToolsWrench = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#tools-wrench_svg__a)'>
         <path d='M15.64 5.237a.334.334 0 0 0-.277-.52h-1.129a.333.333 0 0 1-.229-.09l-1.06-1a.334.334 0 0 1 0-.486l1.06-1a.333.333 0 0 1 .23-.09h1.128a.333.333 0 0 0 .277-.518A3.333 3.333 0 0 0 9.607 4.08a.333.333 0 0 1-.09.307l-6.14 6.14a.333.333 0 0 1-.254.096 2.666 2.666 0 1 0 2.508 2.51.333.333 0 0 1 .097-.254l6.146-6.145a.333.333 0 0 1 .305-.09 3.315 3.315 0 0 0 3.046-.906c.155-.153.293-.321.415-.501ZM3.676 13.99a1 1 0 1 1-1.415-1.415 1 1 0 0 1 1.415 1.415Z' />
      </g>
      <defs>
         <clipPath id='tools-wrench_svg__a'>
            <path d='M0 0h16v16H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgToolsWrench);
export default ForwardRef;
