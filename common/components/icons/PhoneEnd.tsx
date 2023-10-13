import { SVGProps, forwardRef, Ref } from 'react';
const SvgPhoneEnd = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 25 9'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M6.264 8.523a2.557 2.557 0 0 0 2.5-2.5v-.542c2.722-.24 5.46-.239 8.182 0l-.001.544a2.505 2.505 0 0 0 2.498 2.499h2.999a2.498 2.498 0 0 0 2.498-2.5V4.382a3.512 3.512 0 0 0-2.8-3.425 46.91 46.91 0 0 0-18.571 0A3.54 3.54 0 0 0 .772 4.377v1.646A2.498 2.498 0 0 0 3.27 8.52l2.994.003Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgPhoneEnd);
export default ForwardRef;
