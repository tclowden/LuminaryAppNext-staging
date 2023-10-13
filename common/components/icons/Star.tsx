import { SVGProps, forwardRef, Ref } from 'react';
const SvgStar = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 12.364 10.854'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         d='M2.765 7.025 0 4.145l4.07-.828L6.182 0l2.112 3.317 4.07.829-2.765 2.879.403 3.83-3.82-1.538-3.82 1.537z'
         fill='#ff6900'
         fillRule='evenodd'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgStar);
export default ForwardRef;
