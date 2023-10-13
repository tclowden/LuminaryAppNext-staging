import { SVGProps, forwardRef, Ref } from 'react';
const SvgCheckMarkCircle = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM6.364 11.82a1.082 1.082 0 0 1-.771-.32L3.41 9.318a1.09 1.09 0 1 1 1.542-1.542l1.41 1.41 4.692-4.677a1.091 1.091 0 0 1 1.541 1.542l-5.454 5.454a1.082 1.082 0 0 1-.778.315Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgCheckMarkCircle);
export default ForwardRef;
