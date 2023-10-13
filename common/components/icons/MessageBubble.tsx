import { SVGProps, forwardRef, Ref } from 'react';
const SvgMessageBubble = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 24 23'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M12 0C5.383 0 0 4.435 0 9.886a8.974 8.974 0 0 0 3.313 6.824l-2.4 4.787a.522.522 0 0 0 .688.706l6.416-2.986c1.295.372 2.636.559 3.983.556 6.617 0 12-4.435 12-9.887C24 4.434 18.617 0 12 0Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgMessageBubble);
export default ForwardRef;
