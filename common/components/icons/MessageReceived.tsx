import { SVGProps, forwardRef, Ref } from 'react';
const SvgMessageReceived = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 14 14'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#message-received_svg__a)'>
         <path d='M10.208 5.542c.818 0 1.622.216 2.329.628a.145.145 0 0 0 .216-.098c.053-.27.08-.546.08-.822C12.833 2.356 9.955 0 6.417 0 2.879 0 0 2.356 0 5.25a4.712 4.712 0 0 0 1.55 3.415l-.95 2.61a.291.291 0 0 0 .387.369l3.402-1.417c.325.088.655.154.989.198a.145.145 0 0 0 .154-.09.147.147 0 0 0 .01-.063v-.066a4.672 4.672 0 0 1 4.666-4.664Z' />
         <path d='M10.208 14a3.791 3.791 0 1 0 0-7.583 3.791 3.791 0 0 0 0 7.582ZM8.78 10.372a.293.293 0 0 1 .263-.165h.583a.146.146 0 0 0 .146-.146V8.458a.437.437 0 1 1 .875 0v1.604a.146.146 0 0 0 .146.146h.583a.292.292 0 0 1 .228.473l-1.167 1.459a.302.302 0 0 1-.456 0L8.814 10.68a.292.292 0 0 1-.035-.308Z' />
      </g>
      <defs>
         <clipPath id='message-received_svg__a'>
            <path d='M0 0h14v14H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgMessageReceived);
export default ForwardRef;
