import { SVGProps, forwardRef, Ref } from 'react';
const SvgEye = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 18'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#eye_svg__a)'>
         <path d='M17.319 7.249c-1.972-2.171-4.873-4.099-7.881-4.24C9.292 3 9.15 3 9 3 5.81 3.026 2.907 4.853.793 7.125l-.112.123a2.593 2.593 0 0 0 0 3.502c.904.996 4.172 4.25 8.223 4.25h.192c4.05 0 7.32-3.254 8.224-4.25a2.592 2.592 0 0 0-.001-3.501ZM16.211 9.74c-1.628 1.791-3.99 3.492-6.482 3.726A6.228 6.228 0 0 1 9 13.5c-2.723-.064-5.13-1.582-6.965-3.493a12.357 12.357 0 0 1-.246-.265 1.107 1.107 0 0 1 0-1.484C3.564 6.3 6.249 4.436 9 4.5a7.055 7.055 0 0 1 2.81.58c.91.383 1.768.881 2.55 1.483a13.561 13.561 0 0 1 1.853 1.693 1.107 1.107 0 0 1-.003 1.484Z' />
         <path d='M9 6c-.098 0-.196.005-.294.015a.187.187 0 0 0-.137.289 1.496 1.496 0 0 1-2.194 1.983.187.187 0 0 0-.3.102c-.048.2-.073.405-.075.611a3 3 0 1 0 3-3Z' />
      </g>
      <defs>
         <clipPath id='eye_svg__a'>
            <path d='M0 0h18v18H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgEye);
export default ForwardRef;
