import { SVGProps, forwardRef, Ref } from 'react';
const SvgPhoneInbound = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 15 14'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M10.018 9.429a1.46 1.46 0 0 0-2.064 0l-.225.224a27.376 27.376 0 0 1-3.379-3.38l.226-.224a1.46 1.46 0 0 0 0-2.063L3.337 2.748a1.46 1.46 0 0 0-2.064 0l-.679.679a2.05 2.05 0 0 0-.257 2.568 27.378 27.378 0 0 0 7.67 7.673 2.066 2.066 0 0 0 2.568-.259l.68-.68a1.459 1.459 0 0 0 0-2.063L10.017 9.43ZM7.874 6.71h2.801a.584.584 0 0 0 .409-.995l-.779-.78 3.444-3.44A.876.876 0 0 0 12.51.257l-3.443 3.44-.779-.78a.584.584 0 0 0-.998.413v2.797a.584.584 0 0 0 .584.584Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgPhoneInbound);
export default ForwardRef;
