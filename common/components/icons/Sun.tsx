import { SVGProps, forwardRef, Ref } from 'react';
const SvgSun = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#sun_svg__a)'>
         <path d='M8 3.097a4.903 4.903 0 1 0 0 9.806 4.903 4.903 0 0 0 0-9.806Zm0 8.473a3.57 3.57 0 1 1 0-7.141 3.57 3.57 0 0 1 0 7.141ZM8 2.311a.667.667 0 0 0 .667-.666V.667a.667.667 0 0 0-1.334 0v.978A.667.667 0 0 0 8 2.31ZM3.035 3.977a.667.667 0 1 0 .942-.942l-.69-.692a.667.667 0 0 0-.944.943l.692.691ZM1.645 7.333H.667a.667.667 0 0 0 0 1.334h.978a.667.667 0 1 0 0-1.334ZM3.035 12.023l-.692.69a.667.667 0 1 0 .943.944l.691-.692a.667.667 0 1 0-.942-.942ZM8 13.689a.667.667 0 0 0-.667.666v.978a.667.667 0 1 0 1.334 0v-.978A.667.667 0 0 0 8 13.69ZM12.965 12.023a.667.667 0 0 0-.942.942l.691.692a.667.667 0 0 0 .943-.943l-.692-.691ZM15.333 7.333h-.978a.667.667 0 1 0 0 1.334h.978a.667.667 0 1 0 0-1.334ZM12.494 4.173c.177 0 .346-.07.471-.196l.692-.69a.667.667 0 0 0-.943-.944l-.691.692a.667.667 0 0 0 .471 1.138Z' />
      </g>
      <defs>
         <clipPath id='sun_svg__a'>
            <path d='M0 0h16v16H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgSun);
export default ForwardRef;
