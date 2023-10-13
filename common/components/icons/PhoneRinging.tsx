import { SVGProps, forwardRef, Ref } from 'react';
const SvgPhoneRinging = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 14'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M9.288 5.188a.938.938 0 0 1-1.6-.662V.938a.937.937 0 1 1 1.874 0v3.588a.938.938 0 0 1-.274.662ZM2.175 8.283a34.05 34.05 0 0 1 13.65 0A2.77 2.77 0 0 1 18 10.9v1.125a1.876 1.876 0 0 1-1.875 1.875h-2.25A1.875 1.875 0 0 1 12 12.025v-.408a33.965 33.965 0 0 0-6 0v.408A1.875 1.875 0 0 1 4.125 13.9h-2.25A1.875 1.875 0 0 1 0 12.025V10.9a2.77 2.77 0 0 1 2.175-2.617Zm9.944-1.633a.934.934 0 0 0 .666-.277l2.506-2.527a.938.938 0 0 0-1.332-1.32l-2.506 2.528a.938.938 0 0 0 .666 1.598V6.65Zm-6.993.002a.938.938 0 0 1-.661-.278L1.959 3.845a.938.938 0 1 1 1.332-1.32l2.506 2.53a.938.938 0 0 1-.67 1.597Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgPhoneRinging);
export default ForwardRef;
