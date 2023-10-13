import { SVGProps, forwardRef, Ref } from 'react';
const SvgBackspace = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 32 18'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M28.586 0H9a2.982 2.982 0 0 0-2.122.878l-6 6a3 3 0 0 0 0 4.242l6 6A2.976 2.976 0 0 0 9 18h19.586a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3Zm-14.06 7.06a1.5 1.5 0 1 1 2.122-2.12l1.586 1.584a.501.501 0 0 0 .708 0l1.584-1.584a1.5 1.5 0 1 1 2.122 2.12l-1.586 1.586a.5.5 0 0 0 0 .708l1.586 1.586a1.5 1.5 0 1 1-2.122 2.12l-1.584-1.586a.504.504 0 0 0-.708 0l-1.586 1.586a1.5 1.5 0 0 1-2.122-2.12l1.586-1.586a.5.5 0 0 0 0-.708L14.526 7.06Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgBackspace);
export default ForwardRef;
