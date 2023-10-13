import { SVGProps, forwardRef, Ref } from 'react';
const SvgInfoIcon = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 18 18'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         d='M9 0a9 9 0 1 0 9 9 9.011 9.011 0 0 0-9-9zm0 3.111a1.385 1.385 0 1 1 0 2.77 1.385 1.385 0 0 1 0-2.77zm2.471 11.752H7.317a1.038 1.038 0 0 1 0-2.077h.868a.17.17 0 0 0 .17-.17V9.499a.173.173 0 0 0-.172-.173h-.866a1.038 1.038 0 0 1 0-2.077h1.385a1.73 1.73 0 0 1 1.73 1.73v3.631c0 .097.078.175.175.176h.864a1.039 1.039 0 0 1 0 2.077z'
         fill='#FF6900'
         fillRule='nonzero'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgInfoIcon);
export default ForwardRef;
