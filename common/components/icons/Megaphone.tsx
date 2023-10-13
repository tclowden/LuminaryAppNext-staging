import { SVGProps, forwardRef, Ref } from 'react';
const SvgMegaphone = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 15'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M15.375 1.122a1.12 1.12 0 0 0-.525-.945c-.55-.35-.985-.134-1.723.232l-.322.158A16.875 16.875 0 0 1 5.23 2.582a.375.375 0 0 0-.354.376v6.454a6.234 6.234 0 0 0 3.45 5.5.75.75 0 1 0 .666-1.344 4.716 4.716 0 0 1-2.61-4.065c2.242.172 4.424.803 6.412 1.852l.327.156c.803.386 1.196.575 1.74.22a1.12 1.12 0 0 0 .513-.949l.002-9.66ZM18 5.62a1.5 1.5 0 0 0-.997-1.405.375.375 0 0 0-.503.353l.005 2.868a.376.376 0 0 0 .503.352A1.5 1.5 0 0 0 18 6.372V5.62ZM3.64 2.745c.07.07.11.166.11.265v6.006a.375.375 0 0 1-.375.375h-.731A2.625 2.625 0 0 1 .007 6.779L0 5.279A2.629 2.629 0 0 1 2.615 2.64l.76-.006c.1 0 .195.04.265.11Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgMegaphone);
export default ForwardRef;
