import { SVGProps, forwardRef, Ref } from 'react';
const SvgPaperAirplane = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 17'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M17.863.087A.375.375 0 0 0 17.48.03L.231 7.153a.375.375 0 0 0 .007.695l4.749 1.844a.375.375 0 0 0 .35-.042l6.3-4.48a.375.375 0 0 1 .478.576l-5.25 5.059a.375.375 0 0 0-.114.27v5.049a.375.375 0 0 0 .698.189l2.375-4.068a.188.188 0 0 1 .253-.07l4.369 2.4a.375.375 0 0 0 .547-.25l3-13.873a.38.38 0 0 0-.13-.365Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgPaperAirplane);
export default ForwardRef;
