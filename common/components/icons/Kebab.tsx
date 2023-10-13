import { SVGProps, forwardRef, Ref } from 'react';
const SvgKebab = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 18'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M9 4.875A2.437 2.437 0 1 0 9 0a2.437 2.437 0 0 0 0 4.875ZM9 11.438a2.437 2.437 0 1 0 0-4.875 2.437 2.437 0 0 0 0 4.875ZM9 18a2.437 2.437 0 1 0 0-4.875A2.437 2.437 0 0 0 9 18Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgKebab);
export default ForwardRef;
