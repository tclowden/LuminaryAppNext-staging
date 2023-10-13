import { SVGProps, forwardRef, Ref } from 'react';
const SvgListBullets = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 18'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M1.875 4.874a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75ZM6.375 3.75H17.25a.75.75 0 1 0 0-1.5H6.375a.75.75 0 0 0 0 1.5ZM1.875 10.873a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75ZM17.25 8.25H6.375a.75.75 0 0 0 0 1.5H17.25a.75.75 0 1 0 0-1.5ZM1.875 16.873a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75ZM17.25 14.25H6.375a.75.75 0 1 0 0 1.5H17.25a.75.75 0 1 0 0-1.5Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgListBullets);
export default ForwardRef;
