import { SVGProps, forwardRef, Ref } from 'react';
const SvgPhoneInOut = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 14 14'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M10.09 9.396a1.47 1.47 0 0 0-2.078 0l-.227.227a27.575 27.575 0 0 1-3.403-3.404l.227-.227a1.47 1.47 0 0 0 0-2.078L3.36 2.667a1.47 1.47 0 0 0-2.079 0l-.684.684A2.064 2.064 0 0 0 .34 5.938a27.575 27.575 0 0 0 7.726 7.728 2.08 2.08 0 0 0 2.586-.26l.685-.685a1.47 1.47 0 0 0 0-2.078l-1.245-1.247ZM10.226 0h-1.88a.392.392 0 0 0-.274.669l.522.523L6.284 3.5a.588.588 0 1 0 .83.831l2.312-2.308.522.522a.392.392 0 0 0 .67-.276V.392A.391.391 0 0 0 10.226 0ZM9.613 7.612h1.88a.392.392 0 0 0 .274-.668l-.523-.524 2.311-2.308a.587.587 0 1 0-.83-.83L10.412 5.59l-.522-.523a.392.392 0 0 0-.67.276v1.878a.392.392 0 0 0 .392.391Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgPhoneInOut);
export default ForwardRef;
