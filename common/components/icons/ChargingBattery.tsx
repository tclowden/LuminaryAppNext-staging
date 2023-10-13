import { SVGProps, forwardRef, Ref } from 'react';
const SvgChargingBattery = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#charging-battery_svg__a)'>
         <path d='M20 8.75a1.667 1.667 0 0 0-1.667-1.667H17.5V6.25a1.667 1.667 0 0 0-1.667-1.667h-3.541a.208.208 0 0 0-.209.209v1.25a.208.208 0 0 0 .209.208h3.125a.417.417 0 0 1 .416.417v1.25a.833.833 0 0 0 .834.833h1.666v2.5h-1.666a.833.833 0 0 0-.834.833v1.25a.417.417 0 0 1-.416.417H11.82a.209.209 0 0 0-.162.078l-1 1.25a.208.208 0 0 0 .054.308c.034.02.073.031.112.03h5.01A1.666 1.666 0 0 0 17.5 13.75v-.833h.833A1.666 1.666 0 0 0 20 11.25v-2.5ZM2.083 13.75a.416.416 0 0 1-.416-.417V6.667a.417.417 0 0 1 .416-.417h4.43a.206.206 0 0 0 .163-.078l1-1.25a.208.208 0 0 0-.167-.339H1.667A1.667 1.667 0 0 0 0 6.25v7.5a1.667 1.667 0 0 0 1.667 1.667h4.375a.208.208 0 0 0 .208-.209v-1.25a.208.208 0 0 0-.208-.208H2.083Z' />
         <path d='M13.16 9.95a.73.73 0 0 0-.556-1.2h-1.562a.208.208 0 0 1-.209-.21V4.168a.416.416 0 0 0-.742-.26l-4.917 6.141a.73.73 0 0 0 .555 1.202h1.563a.208.208 0 0 1 .208.208v4.375a.417.417 0 0 0 .742.261l4.918-6.143Z' />
      </g>
      <defs>
         <clipPath id='charging-battery_svg__a'>
            <path d='M0 0h20v20H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgChargingBattery);
export default ForwardRef;
