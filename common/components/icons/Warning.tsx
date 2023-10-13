import { SVGProps, forwardRef, Ref } from 'react';
const SvgWarning = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M15.413 13.333 9.18 1.433a1.333 1.333 0 0 0-2.362 0l-6.232 11.9a1.334 1.334 0 0 0 1.182 1.952H14.23a1.333 1.333 0 0 0 1.182-1.952Zm-8.08-7.718a.667.667 0 0 1 1.334 0v4a.667.667 0 1 1-1.334 0v-4Zm.7 7.674h-.018A1.019 1.019 0 0 1 7 12.309a.984.984 0 0 1 .965-1.02h.019a1.018 1.018 0 0 1 .954 1.362.983.983 0 0 1-.905.638Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgWarning);
export default ForwardRef;
