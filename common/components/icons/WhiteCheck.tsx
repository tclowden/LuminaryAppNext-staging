import { SVGProps, forwardRef, Ref } from 'react';
const SvgWhiteCheck = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 13 12'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='m11.107.613 1.669 1.546-8.31 8.978-4.242-4.6 1.672-1.542 2.572 2.789z' fill='#FFF' fillRule='nonzero' />
   </svg>
);
const ForwardRef = forwardRef(SvgWhiteCheck);
export default ForwardRef;
