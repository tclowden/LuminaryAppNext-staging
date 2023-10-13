import { SVGProps, forwardRef, Ref } from 'react';
const SvgQuestionCircle = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M8 0a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8Zm0 12.667a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1.067-4.054a.667.667 0 0 0-.4.612.667.667 0 0 1-1.334 0 2 2 0 0 1 1.2-1.834A1.333 1.333 0 1 0 6.667 6.17a.667.667 0 0 1-1.334 0 2.667 2.667 0 1 1 3.734 2.444Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgQuestionCircle);
export default ForwardRef;
