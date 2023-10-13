import { SVGProps, forwardRef, Ref } from 'react';
const SvgAlarmClock = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 18'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#alarm-clock_svg__a)'>
         <path d='M16.125 9.189a7.124 7.124 0 1 0-11.531 5.596l-1.75 1.749a.75.75 0 0 0 0 1.06.761.761 0 0 0 1.061 0L5.897 15.6a7.119 7.119 0 0 0 6.206 0l1.992 1.992a.758.758 0 0 0 1.06 0 .75.75 0 0 0 0-1.06l-1.749-1.75a7.119 7.119 0 0 0 2.719-5.593Zm-12.75 0A5.625 5.625 0 1 1 9 14.814a5.632 5.632 0 0 1-5.625-5.625ZM5.55 1.702a.375.375 0 0 0 .097-.618A3.364 3.364 0 0 0 .893 5.84a.38.38 0 0 0 .501.046.375.375 0 0 0 .115-.142A8.264 8.264 0 0 1 5.55 1.702Z' />
         <path d='M14.625.19a3.364 3.364 0 0 0-2.275.895.375.375 0 0 0 .097.617 8.264 8.264 0 0 1 4.041 4.041.376.376 0 0 0 .617.097 3.364 3.364 0 0 0-2.48-5.65ZM11.25 8.44h-1.5V5.813a.75.75 0 0 0-1.5 0V9.19a.75.75 0 0 0 .75.75h2.25a.75.75 0 1 0 0-1.5Z' />
      </g>
      <defs>
         <clipPath id='alarm-clock_svg__a'>
            <path d='M0 0h18v18H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgAlarmClock);
export default ForwardRef;
