import { SVGProps, forwardRef, Ref } from 'react';
const SvgChevronRight = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
         d='M5.586 7 .293 1.707 1.707.293 8.414 7l-6.707 6.707-1.414-1.414L5.586 7Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgChevronRight);
export default ForwardRef;
