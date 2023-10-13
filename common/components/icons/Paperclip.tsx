import { SVGProps, forwardRef, Ref } from 'react';
const SvgPaperclip = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M21.843 3.455a6.96 6.96 0 0 0-9.846 0L1.619 13.832a5.128 5.128 0 0 0 7.252 7.252l8.429-8.431A3.292 3.292 0 1 0 12.646 8l-5.189 5.184A1 1 0 1 0 8.871 14.6l5.189-5.191a1.294 1.294 0 0 1 1.829 1.83l-8.432 8.43a3.128 3.128 0 1 1-4.424-4.423L13.411 4.869a4.962 4.962 0 1 1 7.018 7.018l-7.783 7.783a1 1 0 1 0 1.414 1.414l7.783-7.784a6.96 6.96 0 0 0 0-9.846Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgPaperclip);
export default ForwardRef;
