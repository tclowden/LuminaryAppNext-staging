import { SVGProps, forwardRef, Ref } from 'react';
const SvgMoon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 12 17'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M3.42 1.464A7.716 7.716 0 0 1 10.545.453a.667.667 0 0 1 0 1.267 6.63 6.63 0 0 0 0 12.587.667.667 0 0 1 0 1.267c-.85.286-1.74.433-2.636.436a7.627 7.627 0 0 1-4.5-1.474A8.208 8.208 0 0 1 0 8.01a8.235 8.235 0 0 1 3.42-6.545Zm.77 11.99a6.304 6.304 0 0 0 3.547 1.216.167.167 0 0 0 .104-.3 7.959 7.959 0 0 1 .007-12.724.167.167 0 0 0-.104-.3 6.284 6.284 0 0 0-3.544 1.2 6.878 6.878 0 0 0-2.868 5.468 6.853 6.853 0 0 0 2.858 5.44Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgMoon);
export default ForwardRef;
