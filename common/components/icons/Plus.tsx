import { SVGProps, forwardRef, Ref } from 'react';
const SvgPlus = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M0 7h16v2H0z' />
      <path d='M9 0v16H7V0z' />
   </svg>
);
const ForwardRef = forwardRef(SvgPlus);
export default ForwardRef;
