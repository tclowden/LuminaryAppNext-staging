import { SVGProps, forwardRef, Ref } from 'react';
const SvgGrayTrash = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 17 19'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g fill='#B1BBC2' fillRule='nonzero'>
         <path d='M14.258 5.8H2.741a.386.386 0 0 0-.387.421l.995 10.923c.072.796.74 1.406 1.54 1.406h7.222c.8 0 1.467-.61 1.54-1.406l.992-10.923a.386.386 0 0 0-.385-.421ZM7.15 15.845a.58.58 0 0 1-1.159 0V8.891a.58.58 0 1 1 1.16 0v6.954Zm3.864 0a.58.58 0 0 1-1.16 0V8.891a.58.58 0 1 1 1.16 0v6.954ZM16.227 3.095h-3.67a.193.193 0 0 1-.193-.193v-.966A1.932 1.932 0 0 0 10.432.004H6.568a1.932 1.932 0 0 0-1.932 1.932v.966a.193.193 0 0 1-.193.193H.773a.773.773 0 0 0 0 1.546h15.454a.773.773 0 1 0 0-1.546ZM6.182 2.902v-.966c0-.213.173-.386.386-.386h3.864c.213 0 .386.173.386.386v.966a.193.193 0 0 1-.193.193h-4.25a.193.193 0 0 1-.193-.193Z' />
      </g>
   </svg>
);
const ForwardRef = forwardRef(SvgGrayTrash);
export default ForwardRef;
