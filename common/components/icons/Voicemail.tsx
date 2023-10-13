import { SVGProps, forwardRef, Ref } from 'react';
const SvgVoicemail = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 9'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M13.04.048a4.308 4.308 0 0 0-3.088 6.418.185.185 0 0 1-.156.284H8.2a.185.185 0 0 1-.156-.284A4.31 4.31 0 1 0 .004 4.49 4.43 4.43 0 0 0 4.49 8.624h9.016a4.43 4.43 0 0 0 4.49-4.135A4.315 4.315 0 0 0 13.04.049ZM1.875 4.313a2.437 2.437 0 1 1 4.874 0 2.437 2.437 0 0 1-4.874 0Zm11.81 2.437a2.437 2.437 0 1 1 0-4.874 2.437 2.437 0 0 1 0 4.874Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgVoicemail);
export default ForwardRef;
