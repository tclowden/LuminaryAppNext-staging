import { SVGProps, forwardRef, Ref } from 'react';
const SvgMessageBubbleLines = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M12 0C5.384 0 0 4.783 0 10.664c.02 1.412.326 2.803.898 4.075a9.597 9.597 0 0 0 2.41 3.284l-2.392 5.16a.604.604 0 0 0 .093.646c.076.084.174.14.28.162a.489.489 0 0 0 .316-.044l6.416-3.22c1.293.4 2.633.603 3.979.6 6.617 0 12-4.783 12-10.664C24 4.784 18.617 0 12 0Zm5.236 13.836H7.288a.757.757 0 0 1-.556-.248.882.882 0 0 1-.23-.599c0-.225.083-.44.23-.599a.757.757 0 0 1 .556-.248h9.948c.208 0 .408.09.555.248.148.159.23.374.23.6 0 .224-.082.44-.23.598a.757.757 0 0 1-.555.248ZM6.502 7.906c0-.224.083-.44.23-.599a.758.758 0 0 1 .556-.248h6.806c.209 0 .409.09.556.248.147.16.23.375.23.6 0 .224-.083.44-.23.598a.758.758 0 0 1-.556.249H7.288a.758.758 0 0 1-.556-.249.882.882 0 0 1-.23-.599Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgMessageBubbleLines);
export default ForwardRef;
