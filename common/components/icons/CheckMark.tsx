import { SVGProps, forwardRef, Ref } from 'react';
const SvgCheckMark = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 10 9'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M9.634.175a.893.893 0 0 0-1.252.191L4.14 6.151 1.441 3.982a.893.893 0 0 0-1.245.152.903.903 0 0 0 .125 1.253L3.747 8.14a.903.903 0 0 0 1.28-.169l4.8-6.538A.901.901 0 0 0 9.633.175Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgCheckMark);
export default ForwardRef;
