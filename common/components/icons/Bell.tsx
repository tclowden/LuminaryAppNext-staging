import { SVGProps, forwardRef, Ref } from 'react';
const SvgBell = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 17 20'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M15.018 13.649a1.2 1.2 0 0 0 .849.351.8.8 0 0 1 0 1.6h-14.4a.8.8 0 0 1 0-1.6 1.2 1.2 0 0 0 1.2-1.2V8.91a6.366 6.366 0 0 1 5.2-6.452V.8a.8.8 0 0 1 1.6 0v1.658a6.365 6.365 0 0 1 5.2 6.452v3.89c0 .318.126.623.351.848ZM6.878 16.8h3.578a.198.198 0 0 1 .198.178 2 2 0 1 1-3.974 0 .2.2 0 0 1 .198-.178Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgBell);
export default ForwardRef;
