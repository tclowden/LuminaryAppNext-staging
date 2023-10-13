import { SVGProps, forwardRef, Ref } from 'react';
const SvgDropdown = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 11'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M1 0a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1Zm10.47 3.47L9 5.94 6.53 3.47 5.47 4.53 9 8.06l3.53-3.53-1.06-1.06Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgDropdown);
export default ForwardRef;
