import { SVGProps, forwardRef, Ref } from 'react';
const SvgLeaf = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 16'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M17.803 1.37a.755.755 0 0 0-1.17-.499 10.075 10.075 0 0 1-5.746 1.462c-4.634 0-6.569 1.89-6.605 1.933a6.042 6.042 0 0 0-2.005 7.157.375.375 0 0 1-.075.4L.201 13.99a.756.756 0 0 0 1.025 1.104c1.287-1.17 3.386-4.695 9.288-7.161a.755.755 0 0 1 .583 1.393 19.726 19.726 0 0 0-6.323 4.156l-.007.007-.174.189a.375.375 0 0 0 .075.576c.958.6 2.066.919 3.196.918a9.159 9.159 0 0 0 4.339-1.18c6.576-3.618 5.947-10.576 5.6-12.622Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgLeaf);
export default ForwardRef;
