import { SVGProps, forwardRef, Ref } from 'react';
const SvgMissedCall = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 17'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M17.415 1.404a.948.948 0 0 1 .308 1.546l-3.037 3.036a.948.948 0 0 1-1.31.03L10.45 3.345l-.83.835a.76.76 0 0 1-1.296-.537V.76A.759.759 0 0 1 9.083 0h2.877a.76.76 0 0 1 .538 1.3l-.704.704 2.058 1.88a.19.19 0 0 0 .262-.007l2.267-2.267a.948.948 0 0 1 1.034-.206Zm-5.003 8.934c.23.095.44.235.616.411l1.608 1.61a1.899 1.899 0 0 1 0 2.684l-.884.883a2.684 2.684 0 0 1-3.34.335A35.593 35.593 0 0 1 .438 6.284a2.663 2.663 0 0 1 .335-3.34l.883-.883a1.898 1.898 0 0 1 2.684 0l1.612 1.61a1.898 1.898 0 0 1 0 2.683l-.292.293a35.547 35.547 0 0 0 4.392 4.394l.292-.292a1.897 1.897 0 0 1 2.068-.411Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgMissedCall);
export default ForwardRef;
