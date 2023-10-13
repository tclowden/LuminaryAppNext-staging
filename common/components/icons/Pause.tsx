import { SVGProps, forwardRef, Ref } from 'react';
const SvgPause = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 12 14'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M1 0h2.667c.552 0 1 .417 1 .932v11.806c0 .515-.448.932-1 .932H1c-.552 0-1-.417-1-.932V.932C0 .417.448 0 1 0Zm7.333 0H11c.552 0 1 .417 1 .932v11.806c0 .515-.448.932-1 .932H8.333c-.552 0-1-.417-1-.932V.932c0-.515.448-.932 1-.932Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgPause);
export default ForwardRef;
