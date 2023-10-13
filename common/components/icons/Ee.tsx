import { SVGProps, forwardRef, Ref } from 'react';
const SvgEe = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 20 18'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g fill='none' fillRule='evenodd'>
         <path d='M0-1h20v20H0z' />
         <path
            fill='#7D8D9A'
            fillRule='nonzero'
            d='M19.78 1.266c-.047-.296-.235-.546-.498-.664s-.565-.087-.801.082a10.788 10.788 0 0 1-6.384 1.706c-5.15 0-7.299 2.204-7.34 2.255-2.477 1.917-3.396 5.36-2.227 8.35a.454.454 0 0 1-.083.467L.223 15.99a.914.914 0 0 0 .002 1.197.81.81 0 0 0 1.138.09c1.43-1.364 3.762-5.477 10.32-8.355.426-.182.913.03 1.09.476.179.446-.02.96-.443 1.15a21.844 21.844 0 0 0-7.026 4.849l-.007.008-.194.22a.452.452 0 0 0 .084.673 6.446 6.446 0 0 0 3.551 1.07 9.793 9.793 0 0 0 4.82-1.377c7.308-4.22 6.609-12.338 6.223-14.725z'
         />
      </g>
   </svg>
);
const ForwardRef = forwardRef(SvgEe);
export default ForwardRef;
