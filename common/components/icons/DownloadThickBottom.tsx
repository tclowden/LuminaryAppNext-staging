import { SVGProps, forwardRef, Ref } from 'react';
const SvgDownloadThickBottom = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 19 18'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g fill='#7D8D9A' fillRule='nonzero'>
         <path d='M6.961 1.306c0-.602.488-1.09 1.09-1.09h2.545c.601 0 1.089.488 1.09 1.09v6.17c0 .104.083.188.187.188h2.175a.854.854 0 0 1 .62 1.5l-4.575 4.576a1.116 1.116 0 0 1-1.542 0L3.976 9.164a.854.854 0 0 1 .62-1.5h2.175c.05 0 .098-.02.133-.054a.19.19 0 0 0 .055-.133l.002-6.171z' />
         <path d='M.499 14.758a3.03 3.03 0 0 0 3.026 3.026h11.948a3.03 3.03 0 0 0 3.026-3.026V13.35a.919.919 0 0 0-1.837 0v1.405a1.19 1.19 0 0 1-1.19 1.19H3.526a1.192 1.192 0 0 1-1.19-1.19V13.35a.918.918 0 0 0-1.836 0v1.408z' />
      </g>
   </svg>
);
const ForwardRef = forwardRef(SvgDownloadThickBottom);
export default ForwardRef;
