import { SVGProps, forwardRef, Ref } from 'react';
const SvgXMarkCircle = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm3.273 12.364a1.082 1.082 0 0 1-.771-.316L8.259 9.801a.367.367 0 0 0-.515 0L5.5 12.045a1.092 1.092 0 1 1-1.542-1.542L6.202 8.26a.367.367 0 0 0 0-.515L3.958 5.5A1.09 1.09 0 1 1 5.5 3.958l2.244 2.244a.367.367 0 0 0 .515 0l2.244-2.244A1.09 1.09 0 0 1 12.045 5.5L9.801 7.744a.367.367 0 0 0 0 .515l2.244 2.244a1.086 1.086 0 0 1-.77 1.858l-.002.003Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgXMarkCircle);
export default ForwardRef;
