import { SVGProps, forwardRef, Ref } from 'react';
const SvgAnalyticsBars = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g fill='#7D8D9A'>
         <path d='M1.25 17h3.5a.249.249 0 0 0 .25-.25v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a.249.249 0 0 0 .25.25ZM8 8.75a1 1 0 0 0-1 1v7a.249.249 0 0 0 .25.25h3.5a.249.249 0 0 0 .25-.25v-7a1 1 0 0 0-1-1ZM14 10.75a1 1 0 0 0-1 1v5a.249.249 0 0 0 .25.25h3.5a.249.249 0 0 0 .25-.25v-5a1 1 0 0 0-1-1ZM19.25 17h3.5a.249.249 0 0 0 .25-.25v-12a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v12a.249.249 0 0 0 .25.25ZM1 20.25h22a1 1 0 0 0 0-2H1a1 1 0 0 0 0 2Z' />
      </g>
   </svg>
);
const ForwardRef = forwardRef(SvgAnalyticsBars);
export default ForwardRef;
