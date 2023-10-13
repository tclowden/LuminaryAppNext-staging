import { SVGProps, forwardRef, Ref } from 'react';
const SvgAccountingCalculatorGrey = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 19 25'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g fill='#7D8D9A' fillRule='nonzero'>
         <path d='M13.667 6.523a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .414.336.75.75.75z' />
         <path d='M18.667 3.773a3 3 0 0 0-3-3h-12a3 3 0 0 0-3 3v18a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-18zm-9 11a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-1-3.5a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm5.5 8.25a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1 0-1.5h5.5zm0-2.75a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0-4.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-9 4.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm1 3.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1-8a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-1.5-9.5h12a1 1 0 0 1 1 1v3.25a.25.25 0 0 1-.25.25h-13.5a.25.25 0 0 1-.25-.25v-3.25a1 1 0 0 1 1-1z' />
      </g>
   </svg>
);
const ForwardRef = forwardRef(SvgAccountingCalculatorGrey);
export default ForwardRef;
