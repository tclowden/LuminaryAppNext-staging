import { SVGProps, forwardRef, Ref } from 'react';
const SvgArrowButtonUp = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 18'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M17.578 14.25 10.283 2.198a1.5 1.5 0 0 0-2.566 0L.422 14.25a1.5 1.5 0 0 0 1.283 2.276h14.59a1.5 1.5 0 0 0 1.282-2.276Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgArrowButtonUp);
export default ForwardRef;
