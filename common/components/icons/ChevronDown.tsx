import { SVGProps, forwardRef, Ref } from 'react';
const SvgChevronDown = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 14 9'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M13 1 7 7 1 1' />
   </svg>
);
const ForwardRef = forwardRef(SvgChevronDown);
export default ForwardRef;
