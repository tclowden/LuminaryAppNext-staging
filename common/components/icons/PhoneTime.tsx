import { SVGProps, forwardRef, Ref } from 'react';
const SvgPhoneTime = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 27 27'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M19.679 0a7.311 7.311 0 1 0 7.31 7.31A7.32 7.32 0 0 0 19.68 0Zm0 12.372a5.06 5.06 0 1 1 0-10.121 5.06 5.06 0 0 1 0 10.121Zm-.373 5.8a2.812 2.812 0 0 0-3.977 0l-.433.432a52.668 52.668 0 0 1-6.511-6.51l.433-.434a2.818 2.818 0 0 0 0-3.976L6.43 5.297a2.812 2.812 0 0 0-3.977 0l-1.308 1.31a3.948 3.948 0 0 0-.497 4.949 52.8 52.8 0 0 0 14.78 14.784 3.984 3.984 0 0 0 4.949-.498l1.309-1.308a2.81 2.81 0 0 0 0-3.977l-2.381-2.386Zm1.218-11.705h1.405a.844.844 0 0 1 0 1.687H19.68a.844.844 0 0 1-.844-.843V4.499a.844.844 0 0 1 1.688 0v1.968Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgPhoneTime);
export default ForwardRef;
