import { SVGProps, forwardRef, Ref } from 'react';
const SvgMessages = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 18'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M13.059 7.5c-3.345 0-6.066 2.344-6.066 5.225.002.64.14 1.272.403 1.855a.188.188 0 0 1-.203.262 10.048 10.048 0 0 1-1.568-.389L1.521 16.28a.375.375 0 0 1-.51-.45l1.064-3.548A6.778 6.778 0 0 1 0 7.5C0 3.364 4.037 0 9 0s9 3.365 9 7.5a6.185 6.185 0 0 1-.208 1.567.187.187 0 0 1-.129.132.184.184 0 0 1-.179-.042A6.534 6.534 0 0 0 13.059 7.5ZM4.5 9.188h2.625a.563.563 0 1 0 0-1.126H4.5a.563.563 0 1 0 0 1.126Zm0-3.376h7.875a.562.562 0 1 0 0-1.125H4.5a.563.563 0 1 0 0 1.125Zm3.618 6.913c0-2.261 2.216-4.1 4.941-4.1 2.725 0 4.941 1.839 4.941 4.1a3.681 3.681 0 0 1-1.065 2.542l.675 2.25a.375.375 0 0 1-.525.443l-2.625-1.31c-3.284.817-6.342-1.284-6.342-3.925Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgMessages);
export default ForwardRef;
