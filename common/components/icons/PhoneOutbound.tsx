import { SVGProps, forwardRef, Ref } from 'react';
const SvgPhoneOutbound = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 15 14'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M10.018 9.429a1.458 1.458 0 0 0-2.064 0l-.225.225a27.378 27.378 0 0 1-3.378-3.38l.225-.225a1.46 1.46 0 0 0 0-2.063L3.337 2.748a1.46 1.46 0 0 0-2.064 0l-.679.679a2.05 2.05 0 0 0-.257 2.568 27.378 27.378 0 0 0 7.67 7.673 2.067 2.067 0 0 0 2.568-.259l.68-.68a1.459 1.459 0 0 0 0-2.062l-1.237-1.238ZM13.422 0H10.62a.584.584 0 0 0-.408.996l.778.78-3.443 3.44a.876.876 0 0 0 1.238 1.238l3.444-3.44.779.78a.585.585 0 0 0 .998-.413V.584A.584.584 0 0 0 13.422 0Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgPhoneOutbound);
export default ForwardRef;
