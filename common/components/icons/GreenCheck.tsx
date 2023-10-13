import { SVGProps, forwardRef, Ref } from 'react';
const SvgGreenCheck = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 19 17'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         d='m16.309.613 2.467 2.285L6.494 16.167.224 9.369l2.471-2.28 3.802 4.123z'
         fill='#3DCA59'
         fillRule='nonzero'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgGreenCheck);
export default ForwardRef;
