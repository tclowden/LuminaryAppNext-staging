import { SVGProps, forwardRef, Ref } from 'react';
const SvgPlay = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 12 14'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M1.382 13.332 11.535 7.53a.925.925 0 0 0 0-1.607L1.382.121A.924.924 0 0 0 0 .923V12.53a.925.925 0 0 0 1.382.802Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgPlay);
export default ForwardRef;
