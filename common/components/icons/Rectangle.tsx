import { SVGProps, forwardRef, Ref } from 'react';
const SvgRectangle = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M0 0h20v20H0z' />
   </svg>
);
const ForwardRef = forwardRef(SvgRectangle);
export default ForwardRef;
