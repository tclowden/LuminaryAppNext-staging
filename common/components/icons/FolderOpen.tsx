import { SVGProps, forwardRef, Ref } from 'react';
const SvgFolderOpen = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 18'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M17.58 7.162a1.119 1.119 0 0 0-.87-.412H7.815a.375.375 0 0 1-.368-.3l-.209-1.046A1.125 1.125 0 0 0 6.135 4.5H1.29A1.125 1.125 0 0 0 .187 5.85l1.95 9.75a1.125 1.125 0 0 0 1.103.9h11.97a1.125 1.125 0 0 0 1.103-.9l1.5-7.5a1.126 1.126 0 0 0-.233-.938ZM2.75 2.25a.75.75 0 0 0 .735-.583.197.197 0 0 1 .182-.167h11.458a.375.375 0 0 1 .375.375V3.75a.75.75 0 1 0 1.5 0V1.5A1.5 1.5 0 0 0 15.5 0h-12A1.5 1.5 0 0 0 2 1.5a.75.75 0 0 0 .75.75Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgFolderOpen);
export default ForwardRef;
