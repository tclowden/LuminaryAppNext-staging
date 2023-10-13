import { SVGProps, forwardRef, Ref } from 'react';
const SvgUnionUp = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
         d='M9.288 8.914a.937.937 0 0 1-1.6-.663V3.938a.188.188 0 0 0-.188-.187H5.625a.375.375 0 0 1-.266-.64l3-3a.375.375 0 0 1 .531 0l3 3a.376.376 0 0 1-.265.64H9.75a.187.187 0 0 0-.188.187v4.313a.937.937 0 0 1-.274.663ZM1.5 11.25h15a1.5 1.5 0 0 1 1.5 1.5v3.375a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5V12.75a1.5 1.5 0 0 1 1.5-1.5Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgUnionUp);
export default ForwardRef;
