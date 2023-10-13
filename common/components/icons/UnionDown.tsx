import { SVGProps, forwardRef, Ref } from 'react';
const SvgUnionDown = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 18'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M1.5 0h15A1.5 1.5 0 0 1 18 1.5v3.375a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5V1.5A1.5 1.5 0 0 1 1.5 0Zm7.212 8.713a.938.938 0 0 1 1.6.663v4.312a.187.187 0 0 0 .188.188h1.875a.375.375 0 0 1 .266.64l-3 3a.375.375 0 0 1-.53 0l-3-3a.375.375 0 0 1 .264-.64H8.25a.187.187 0 0 0 .188-.188V9.376c0-.249.098-.487.274-.663Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgUnionDown);
export default ForwardRef;
