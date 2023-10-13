import { SVGProps, forwardRef, Ref } from 'react';
const SvgPhoneMerge = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#phone-merge_svg__a)'>
         <path d='M14.828 13.382a2.084 2.084 0 0 0-2.947 0l-.321.32a39.144 39.144 0 0 1-4.824-4.824l.321-.32a2.083 2.083 0 0 0 0-2.946L5.29 3.844a2.132 2.132 0 0 0-2.947 0l-.97.97a2.922 2.922 0 0 0-.367 3.666 39.09 39.09 0 0 0 10.95 10.954 2.95 2.95 0 0 0 3.668-.368l.97-.97a2.088 2.088 0 0 0 0-2.946l-1.765-1.768Z' />
         <path d='M11.77 10.95a1.035 1.035 0 0 0 .738-.297l3.333-3.35c.194-.196.303-.46.303-.735V4.083h1.286a.833.833 0 0 0 .59-1.416L15.691.333a.833.833 0 0 0-1.179 0l-2.327 2.334a.833.833 0 0 0 .589 1.416h1.286v2.055l-3.03 3.045a1.032 1.032 0 0 0 .738 1.766ZM19.18 9.188l-1.24-1.261a1.042 1.042 0 1 0-1.486 1.46l1.238 1.261a1.053 1.053 0 0 0 1.475.013 1.042 1.042 0 0 0 .012-1.473Z' />
      </g>
      <defs>
         <clipPath id='phone-merge_svg__a'>
            <path d='M0 0h20v20H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgPhoneMerge);
export default ForwardRef;
