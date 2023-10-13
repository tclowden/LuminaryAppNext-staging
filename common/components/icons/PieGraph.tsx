import { SVGProps, forwardRef, Ref } from 'react';
const SvgPieGraph = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 26 27'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M24.915 11.394a.543.543 0 0 0 .542-.543A10.864 10.864 0 0 0 14.606 0a.542.542 0 0 0-.543.543v9.793a1.06 1.06 0 0 0 1.058 1.059l9.794-.001ZM25.457 13.021H15.15a.734.734 0 0 0-.543 1.31l7.29 7.29a.543.543 0 0 0 .767 0A11.32 11.32 0 0 0 26 13.564a.543.543 0 0 0-.543-.543Z' />
      <path d='M11.446 26.043a11.2 11.2 0 0 0 7.962-3.347.542.542 0 0 0 0-.767l-7.29-7.29a.987.987 0 0 1-.225-.542V3.787a.543.543 0 0 0-.542-.542 11.399 11.399 0 0 0 .095 22.797Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgPieGraph);
export default ForwardRef;
