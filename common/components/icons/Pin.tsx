import { SVGProps, forwardRef, Ref } from 'react';
const SvgPin = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 19'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='m14.01.43 3.56 3.56a1.469 1.469 0 0 1-.25 2.278l-5.358 3.034a6.642 6.642 0 0 1-.537 5.168 1.468 1.468 0 0 1-1.077.714 1.543 1.543 0 0 1-1.225-.418L3.24 8.882a1.469 1.469 0 0 1 .294-2.305 6.188 6.188 0 0 1 3.44-.74 7.472 7.472 0 0 1 1.729.196L11.732.68a1.468 1.468 0 0 1 2.277-.25Zm-2.14 4.648 1.384-2.08v.003a.49.49 0 0 0-.814-.543l-1.385 2.076a.491.491 0 0 0 .136.68.496.496 0 0 0 .502.024.489.489 0 0 0 .177-.16ZM.287 16.41l3.368-3.369a.98.98 0 0 1 1.385 1.385L1.67 17.796a.994.994 0 0 1-1.384 0 .98.98 0 0 1 0-1.385Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgPin);
export default ForwardRef;
