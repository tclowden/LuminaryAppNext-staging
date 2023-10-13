import { SVGProps, forwardRef, Ref } from 'react';
const SvgMapPin = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M14.293 9.707A1 1 0 0 1 14 9l.009-5.69a.25.25 0 0 0-.395-.2l-4.4 3.14a.5.5 0 0 0-.209.407V19.46a.251.251 0 0 0 .395.2l2.691-1.927a1 1 0 0 1 1.162 1.627l-4.375 3.126a1.5 1.5 0 0 1-1.771-.02L.6 17.586a1.51 1.51 0 0 1-.6-1.2V1.5A1.5 1.5 0 0 1 2.427.32l5.301 4.093a.5.5 0 0 0 .6.01l5.8-4.143a1.5 1.5 0 0 1 1.745 0l6.499 4.642A1.505 1.505 0 0 1 23 6.142V9a1 1 0 0 1-2 0V6.658a.5.5 0 0 0-.205-.404l-4.4-3.14a.25.25 0 0 0-.395.2V9a1 1 0 0 1-1.707.707Zm-7.33 9.81A.25.25 0 0 0 7 19.386V6.626a.5.5 0 0 0-.2-.4l-4.4-3.4a.25.25 0 0 0-.4.2v12.86a.5.5 0 0 0 .2.4l4.4 3.3a.25.25 0 0 0 .363-.069Z'
      />
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M15.466 12.466A5.006 5.006 0 0 1 19 11a5.006 5.006 0 0 1 5 5c0 3.171-4.457 7.664-4.646 7.854a.498.498 0 0 1-.708 0C18.457 23.664 14 19.171 14 16a5.006 5.006 0 0 1 1.466-3.534Zm2.562 4.99a1.75 1.75 0 1 0 1.944-2.91 1.75 1.75 0 0 0-1.944 2.91Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgMapPin);
export default ForwardRef;
