import { SVGProps, forwardRef, Ref } from 'react';
const SvgCheckbox = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#checkbox_svg__a)'>
         <path d='M14.97 0H1.03A1.031 1.031 0 0 0 0 1.03v13.94A1.031 1.031 0 0 0 1.03 16h13.94A1.032 1.032 0 0 0 16 14.97V1.03A1.032 1.032 0 0 0 14.97 0Zm-2.433 5.23L7.87 11.562a.676.676 0 0 1-.953.124L3.583 9.021a.667.667 0 1 1 .834-1.041l2.791 2.233 4.259-5.776a.667.667 0 1 1 1.073.792h-.003Z' />
      </g>
      <defs>
         <clipPath id='checkbox_svg__a'>
            <path fill='#fff' d='M0 0h16v16H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgCheckbox);
export default ForwardRef;
