import { SVGProps, forwardRef, Ref } from 'react';
const SvgCaution = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 16 15'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         d='M15.567 12.657 9.387.857a1.317 1.317 0 0 0-2.34-.001l-6.18 11.8a1.32 1.32 0 0 0 1.17 1.936h12.36a1.322 1.322 0 0 0 1.171-1.936zM7.555 5.003a.66.66 0 0 1 1.322 0V8.97a.66.66 0 0 1-1.322.001V5.002zm.694 7.61h-.018a1.01 1.01 0 0 1-1.006-.972.976.976 0 0 1 .957-1.012H8.2c.542.001.987.43 1.008.97a.979.979 0 0 1-.959 1.014z'
         fill='#FACB34'
         fillRule='nonzero'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgCaution);
export default ForwardRef;
