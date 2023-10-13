import { SVGProps, forwardRef, Ref } from 'react';
const SvgXCross = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 12 12'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='m7.597 5.9 4.1-4.102L10.002.101 5.9 4.202 1.798.102.101 1.797 4.202 5.9l-4.1 4.102 1.696 1.697L5.9 7.597l4.1 4.1 1.698-1.696L7.597 5.9Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgXCross);
export default ForwardRef;
