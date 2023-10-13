import { SVGProps, forwardRef, Ref } from 'react';
const SvgPhoneAnswer = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 25 10'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M18.736.619a2.557 2.557 0 0 0-2.5 2.5v.542c-2.722.24-5.46.239-8.182 0l.001-.544A2.505 2.505 0 0 0 5.556.618L2.558.62A2.498 2.498 0 0 0 .06 3.118V4.76a3.512 3.512 0 0 0 2.8 3.425 46.91 46.91 0 0 0 18.571 0 3.54 3.54 0 0 0 2.797-3.421V3.119A2.498 2.498 0 0 0 21.73.622L18.736.619Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgPhoneAnswer);
export default ForwardRef;
