import { SVGProps, forwardRef, Ref } from 'react';
const SvgBattery = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 20 13'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g fill='none' fillRule='evenodd'>
         <path d='M0-3.75h20v20H0z' />
         <path
            fill='#7D8D9A'
            fillRule='nonzero'
            d='M20.003 5c0-.92-.746-1.667-1.667-1.667h-.833V2.5c0-.92-.746-1.667-1.667-1.667h-3.541a.21.21 0 0 0-.209.209v1.25c0 .115.094.208.209.208h3.125c.23 0 .416.187.416.417v1.25c0 .46.373.833.834.833h1.666v2.5H16.67a.834.834 0 0 0-.834.833v1.25c0 .23-.186.417-.416.417h-3.597a.211.211 0 0 0-.163.078l-1 1.25a.208.208 0 0 0 .167.339h5.01c.92 0 1.666-.747 1.666-1.667v-.833h.833c.92 0 1.667-.747 1.667-1.667V5zm-17.92 5a.417.417 0 0 1-.416-.417V2.917c0-.23.186-.417.416-.417h4.43a.208.208 0 0 0 .163-.078l1-1.25A.208.208 0 0 0 7.51.833H1.666C.747.833 0 1.58 0 2.5V10c0 .92.746 1.667 1.667 1.667h4.375a.209.209 0 0 0 .208-.209v-1.25A.208.208 0 0 0 6.042 10H2.083z'
         />
         <path
            fill='#7D8D9A'
            fillRule='nonzero'
            d='M13.161 6.201A.727.727 0 0 0 12.605 5h-1.562a.21.21 0 0 1-.209-.209V.417a.416.416 0 0 0-.742-.26L5.175 6.3a.727.727 0 0 0 .555 1.201h1.563c.115 0 .208.094.208.209v4.375a.417.417 0 0 0 .743.261L13.16 6.2z'
         />
      </g>
   </svg>
);
const ForwardRef = forwardRef(SvgBattery);
export default ForwardRef;
