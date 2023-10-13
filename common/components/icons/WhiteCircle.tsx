import { SVGProps, forwardRef, Ref } from 'react';
const SvgWhiteCircle = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 26 26'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <circle cx={16} cy={15} r={13} transform='translate(-3 -2)' fill='#FFF' fillRule='evenodd' />
   </svg>
);
const ForwardRef = forwardRef(SvgWhiteCircle);
export default ForwardRef;
