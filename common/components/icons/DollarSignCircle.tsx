import { SVGProps, forwardRef, Ref } from 'react';
const SvgDollarSignCircle = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 12 12'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M6 0a6 6 0 1 0 6 6 6.008 6.008 0 0 0-6-6Zm-.692 9.692a.23.23 0 0 0-.231-.23h-.462a.692.692 0 1 1 0-1.385h1.877a.546.546 0 0 0 .203-1.053l-1.904-.762a1.924 1.924 0 0 1 .332-3.675.23.23 0 0 0 .185-.226v-.284a.692.692 0 1 1 1.384 0v.23a.23.23 0 0 0 .231.231h.462a.692.692 0 0 1 0 1.385H5.508a.546.546 0 0 0-.203 1.053l1.904.762a1.924 1.924 0 0 1-.332 3.675.23.23 0 0 0-.185.226v.284a.692.692 0 1 1-1.384 0v-.23Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgDollarSignCircle);
export default ForwardRef;
