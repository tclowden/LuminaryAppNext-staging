import { SVGProps, forwardRef, Ref } from 'react';
const SvgCalendarCash = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 26 26'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#calendar-cash_svg__a)'>
         <path d='M23.292 3.25h-2.98a.27.27 0 0 1-.27-.27V1.082a1.084 1.084 0 0 0-2.167 0V6.23a.812.812 0 1 1-1.625 0V3.792a.542.542 0 0 0-.542-.542h-6.77a.27.27 0 0 1-.271-.27V1.083a1.083 1.083 0 0 0-2.167 0V6.23a.812.812 0 1 1-1.625 0V3.792a.542.542 0 0 0-.542-.542H2.708A2.167 2.167 0 0 0 .542 5.417v18.416A2.167 2.167 0 0 0 2.708 26h20.584a2.167 2.167 0 0 0 2.166-2.167V5.417a2.166 2.166 0 0 0-2.166-2.167Zm0 20.042a.542.542 0 0 1-.542.541H3.25a.542.542 0 0 1-.542-.541v-13a.542.542 0 0 1 .542-.542h19.5a.542.542 0 0 1 .542.542v13Z' />
         <path d='M13.217 15.974h-.434a1.071 1.071 0 0 1-1.135-.99c0-.74.554-.99 1.138-.99l1.95.005a.813.813 0 0 0 0-1.625h-.924v-.635a.812.812 0 1 0-1.624 0v.697c-.499.1-.96.335-1.335.678a2.568 2.568 0 0 0-.832 1.872 2.695 2.695 0 0 0 2.762 2.613h.434a1.004 1.004 0 1 1 0 1.987h-1.95a.813.813 0 1 0 0 1.625h.918v.633a.813.813 0 1 0 1.625 0v-.702a2.657 2.657 0 0 0 2.167-2.553 2.699 2.699 0 0 0-2.76-2.615Z' />
      </g>
      <defs>
         <clipPath id='calendar-cash_svg__a'>
            <path fill='#fff' d='M0 0h26v26H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgCalendarCash);
export default ForwardRef;
