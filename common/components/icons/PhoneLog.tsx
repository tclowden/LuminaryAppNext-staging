import { SVGProps, forwardRef, Ref } from 'react';
const SvgPhoneLog = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#phone-log_svg__a)'>
         <path d='M17.168 16.037a2.56 2.56 0 0 0-3.537 0l-.385.384a46.697 46.697 0 0 1-5.788-5.79l.386-.384a2.51 2.51 0 0 0 0-3.537L5.72 4.59a2.505 2.505 0 0 0-3.535 0L1.022 5.752a3.514 3.514 0 0 0-.442 4.4A46.943 46.943 0 0 0 13.721 23.3a3.538 3.538 0 0 0 4.4-.442l1.164-1.164a2.5 2.5 0 0 0 0-3.535l-2.117-2.122ZM16 2.38h7a1 1 0 1 0 0-2h-7a1 1 0 1 0 0 2ZM23 4.38h-7a1 1 0 1 0 0 2h7a1 1 0 1 0 0-2ZM23 8.38h-7a1 1 0 1 0 0 2h7a1 1 0 0 0 0-2ZM11.998 2.63a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5ZM11.998 6.63a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z' />
         <path d='M11.998 10.63a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z' />
      </g>
      <defs>
         <clipPath id='phone-log_svg__a'>
            <path d='M0 0h24v24H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgPhoneLog);
export default ForwardRef;
