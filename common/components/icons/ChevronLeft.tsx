import { SVGProps, forwardRef, Ref } from 'react';
const SvgChevronLeft = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 9 14'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='m3.414 7 5.293 5.293-1.414 1.414L.586 7 7.293.293l1.414 1.414L3.414 7Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgChevronLeft);
export default ForwardRef;
