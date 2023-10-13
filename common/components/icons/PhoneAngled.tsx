import { SVGProps, forwardRef, Ref } from 'react';
const SvgPhoneAngled = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 22 22'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M18.869 13.388a2.813 2.813 0 0 0-3.888 0l-.422.422a51.33 51.33 0 0 1-6.364-6.364l.424-.422a2.756 2.756 0 0 0 0-3.887L6.286.805a2.748 2.748 0 0 0-3.887 0L1.121 2.084a3.863 3.863 0 0 0-.486 4.842A51.6 51.6 0 0 0 15.08 21.37a3.894 3.894 0 0 0 4.836-.486l1.28-1.28a2.748 2.748 0 0 0 0-3.885l-2.327-2.332Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgPhoneAngled);
export default ForwardRef;
