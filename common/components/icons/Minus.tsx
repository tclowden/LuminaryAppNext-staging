import { SVGProps, forwardRef, Ref } from 'react';
const SvgMinus = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 16 2'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M0 0h16v2H0z' />
   </svg>
);
const ForwardRef = forwardRef(SvgMinus);
export default ForwardRef;
