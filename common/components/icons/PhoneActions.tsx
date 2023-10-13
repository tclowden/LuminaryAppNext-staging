import { SVGProps, forwardRef, Ref } from 'react';
const SvgPhoneActions = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 26 26'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M14.35 1.354a1.354 1.354 0 1 1-2.709 0 1.354 1.354 0 0 1 2.709 0Zm2.982 1.084h7.584a1.083 1.083 0 0 0 0-2.167h-7.584a1.084 1.084 0 1 0 0 2.167Zm1.265 14.798a2.773 2.773 0 0 0-3.832 0l-.417.416a50.6 50.6 0 0 1-6.272-6.274l.418-.416a2.72 2.72 0 0 0 0-3.832L6.193 4.83a2.714 2.714 0 0 0-3.83 0l-1.26 1.262a3.808 3.808 0 0 0-.48 4.767 50.864 50.864 0 0 0 14.24 14.245 3.834 3.834 0 0 0 4.767-.478l1.261-1.262a2.709 2.709 0 0 0 0-3.83l-2.294-2.3ZM17.332 4.605h7.584a1.083 1.083 0 0 1 0 2.167h-7.584a1.084 1.084 0 1 1 0-2.167Zm7.584 4.334h-7.584a1.084 1.084 0 1 0 0 2.167h7.584a1.083 1.083 0 1 0 0-2.167Zm-11.92-1.896a1.354 1.354 0 1 0 0-2.709 1.354 1.354 0 0 0 0 2.709Zm1.354 2.98a1.354 1.354 0 1 1-2.709 0 1.354 1.354 0 0 1 2.709 0Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgPhoneActions);
export default ForwardRef;
