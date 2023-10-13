import { SVGProps, forwardRef, Ref } from 'react';
const SvgFunnel = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 26 26'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M25.223 5.186a3.12 3.12 0 0 0 .496-3.353A3.133 3.133 0 0 0 22.861 0H3.136A3.133 3.133 0 0 0 .28 1.834a3.12 3.12 0 0 0 .497 3.352l8.302 9.473v8.214c0 1.152.634 2.21 1.651 2.755a3.139 3.139 0 0 0 3.215-.15l1.566-1.04a3.125 3.125 0 0 0 1.397-2.603v-7.178l8.303-9.47h.012ZM8.416 9.501 4.015 4.42a.78.78 0 0 1 .593-1.295h1.567c.22 0 .431.093.58.257L9.59 6.509a.78.78 0 0 1 .203.525v1.954a.782.782 0 0 1-1.377.511v.002Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgFunnel);
export default ForwardRef;
