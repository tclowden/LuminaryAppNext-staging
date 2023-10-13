import { SVGProps, forwardRef, Ref } from 'react';
const SvgDownArrow = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 12 13'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='m11 6-5 5-5-5M6 10V0' stroke='#7E8F9C' strokeWidth={2} />
   </svg>
);
const ForwardRef = forwardRef(SvgDownArrow);
export default ForwardRef;
