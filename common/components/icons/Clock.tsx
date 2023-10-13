import { SVGProps, forwardRef, Ref } from 'react';
const SvgClock = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#clock_svg__a)'>
         <path d='M12 0a12 12 0 1 0 12 12A12.014 12.014 0 0 0 12 0Zm0 22a10 10 0 1 1 10-10 10.011 10.011 0 0 1-10 10Z' />
         <path d='M17.134 15.81 12.5 11.561V6.5a1 1 0 0 0-2 0V12a.999.999 0 0 0 .324.738l4.959 4.545a1.01 1.01 0 0 0 1.413-.061 1 1 0 0 0-.062-1.412Z' />
      </g>
      <defs>
         <clipPath id='clock_svg__a'>
            <path d='M0 0h24v24H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgClock);
export default ForwardRef;
