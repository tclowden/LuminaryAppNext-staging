import { SVGProps, forwardRef, Ref } from 'react';
const SvgWhiteChevron = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 7 12'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         d='M6.2 9.555c.313.256.46.687.377 1.104-.083.418-.382.743-.764.834a.959.959 0 0 1-1.013-.411l-4-4.364a1.163 1.163 0 0 1 0-1.527l4-4.364A.939.939 0 0 1 6.107.93c.352.383.392.991.093 1.426l-3.28 3.6 3.3 3.6H6.2Z'
         fill='#FFF'
         fillRule='nonzero'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgWhiteChevron);
export default ForwardRef;
