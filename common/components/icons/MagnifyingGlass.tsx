import { SVGProps, forwardRef, Ref } from 'react';
const SvgMagnifyingGlass = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='m15.563 13.386-2.71-2.71a.616.616 0 0 1-.107-.727 6.711 6.711 0 0 0 .804-3.174 6.776 6.776 0 1 0-6.775 6.776c1.11 0 2.202-.276 3.178-.802a.615.615 0 0 1 .727.108l2.71 2.71a1.54 1.54 0 0 0 2.178-2.176l-.005-.005Zm-13.1-6.61a4.312 4.312 0 1 1 8.624 0 4.312 4.312 0 0 1-8.623 0Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgMagnifyingGlass);
export default ForwardRef;
