import { SVGProps, forwardRef, Ref } from 'react';
const SvgClipboard = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#clipboard_svg__a)'>
         <path d='M20.5 2h-5a.241.241 0 0 1-.208-.121 3.827 3.827 0 0 0-6.588 0 .241.241 0 0 1-.204.12h-5A1.5 1.5 0 0 0 2 3.5v19A1.5 1.5 0 0 0 3.5 24h17a1.5 1.5 0 0 0 1.5-1.5v-19A1.5 1.5 0 0 0 20.5 2ZM19 16.26a2.5 2.5 0 0 1-.6 1.626l-1.919 2.24a2.501 2.501 0 0 1-1.9.873H5.5a.5.5 0 0 1-.5-.5v-15a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v10.76Z' />
         <path d='M16 8.249H8a.75.75 0 0 0 0 1.5h8a.75.75 0 1 0 0-1.5ZM16 11.749H8a.75.75 0 1 0 0 1.5h8a.75.75 0 1 0 0-1.5ZM12.5 15.249H8a.75.75 0 1 0 0 1.5h4.5a.75.75 0 1 0 0-1.5Z' />
      </g>
      <defs>
         <clipPath id='clipboard_svg__a'>
            <path d='M0 0h24v24H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgClipboard);
export default ForwardRef;
