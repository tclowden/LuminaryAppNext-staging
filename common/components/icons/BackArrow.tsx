import { SVGProps, forwardRef, Ref } from 'react';
const SvgBackArrow = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 11'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M3.922 8.71a.771.771 0 0 0 1.317-.546V5.625a.193.193 0 0 1 .193-.193H15.88a.193.193 0 0 1 .193.193v4.018a.964.964 0 1 0 1.928 0V4.468a.964.964 0 0 0-.964-.964H5.432a.193.193 0 0 1-.193-.193V.77A.772.772 0 0 0 3.922.226L.226 3.922a.771.771 0 0 0 0 1.091L3.922 8.71Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgBackArrow);
export default ForwardRef;
