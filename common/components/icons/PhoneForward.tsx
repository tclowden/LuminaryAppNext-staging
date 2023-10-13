import { SVGProps, forwardRef, Ref } from 'react';
const SvgPhoneForward = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#phone-forward_svg__a)'>
         <path d='M14.307 13.46a2.085 2.085 0 0 0-2.946 0l-.322.32a39.14 39.14 0 0 1-4.824-4.824l.322-.321a2.087 2.087 0 0 0 0-2.946L4.768 3.922a2.133 2.133 0 0 0-2.946 0l-.97.969a2.923 2.923 0 0 0-.368 3.666 39.089 39.089 0 0 0 10.951 10.955 2.951 2.951 0 0 0 3.667-.369l.969-.969a2.082 2.082 0 0 0 0-2.947l-1.764-1.767Z' />
         <path d='M19.677 2.255 17.023.19a.834.834 0 0 0-1.346.658V2a6.051 6.051 0 0 0-4.792 5.91v1.667a1.041 1.041 0 1 0 2.083 0V7.91a3.95 3.95 0 0 1 2.709-3.737v.802a.828.828 0 0 0 .467.75.833.833 0 0 0 .879-.09l2.654-2.066a.834.834 0 0 0 0-1.315v.001Z' />
      </g>
      <defs>
         <clipPath id='phone-forward_svg__a'>
            <path d='M0 0h20v20H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgPhoneForward);
export default ForwardRef;
