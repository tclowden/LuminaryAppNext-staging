import { SVGProps, forwardRef, Ref } from 'react';
const SvgDisable = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M15.787 6.156A7.901 7.901 0 0 0 9.842.213a8.007 8.007 0 0 0-9.63 9.621 7.909 7.909 0 0 0 7.771 6.154 8 8 0 0 0 7.804-9.832Zm-12.601 4.15a5.345 5.345 0 0 1 7.122-7.123.333.333 0 0 1 .09.533l-6.677 6.677a.333.333 0 0 1-.535-.088Zm8.583 1.465a5.348 5.348 0 0 1-6.074 1.048.335.335 0 0 1-.09-.533l6.677-6.676a.332.332 0 0 1 .533.09 5.337 5.337 0 0 1-1.046 6.067v.004Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgDisable);
export default ForwardRef;
