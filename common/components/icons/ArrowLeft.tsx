import { SVGProps, forwardRef, Ref } from 'react';
const SvgArrowLeft = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 7 12'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M6.296 1.408 1.704 6l4.592 4.592' stroke='#7D8D9A' strokeWidth={2} fill='none' />
   </svg>
);
const ForwardRef = forwardRef(SvgArrowLeft);
export default ForwardRef;
