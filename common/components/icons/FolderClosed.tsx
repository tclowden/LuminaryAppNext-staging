import { SVGProps, forwardRef, Ref } from 'react';
const SvgFolderClosed = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M15 3.334H7.49a.333.333 0 0 1-.297-.184L6.56 1.883a.996.996 0 0 0-.894-.55H1a1 1 0 0 0-1 1v11.334a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4.334a1 1 0 0 0-1-1Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgFolderClosed);
export default ForwardRef;
