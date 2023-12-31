import { SVGProps, forwardRef, Ref } from 'react';
const SvgHammerWrench = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='m10.014 6.487.85.85a.5.5 0 0 1 0 .707L8.04 10.868a.5.5 0 0 1-.707 0l-.852-.852a.5.5 0 0 0-.457-.129 4.994 4.994 0 0 1-5.77-6.46.5.5 0 0 1 .829-.2l2.45 2.448a.5.5 0 0 0 .352.147H5.3a.5.5 0 0 0 .5-.5V3.908a.5.5 0 0 0-.146-.353L3.197 1.096a.5.5 0 0 1 .19-.828 4.993 4.993 0 0 1 6.498 5.76.5.5 0 0 0 .13.459Zm6.65 6.65.846.846a.5.5 0 0 0 .456.122 4.992 4.992 0 0 1 5.76 6.5.5.5 0 0 1-.826.194l-2.454-2.453a.5.5 0 0 0-.354-.148H18.68a.5.5 0 0 0-.5.5v1.412a.5.5 0 0 0 .146.354l2.45 2.45a.5.5 0 0 1-.2.827 4.994 4.994 0 0 1-6.465-5.767.5.5 0 0 0-.129-.457l-.849-.849a.5.5 0 0 1 0-.707l2.825-2.824a.5.5 0 0 1 .707 0Zm-.017-3.518-2.264-2.264a.5.5 0 0 0-.707 0l-12.59 12.59a2 2 0 0 0 0 2.828l.143.143a2.001 2.001 0 0 0 2.83 0l12.588-12.59a.5.5 0 0 0 0-.707Zm3.33.382c-.362 0-.709-.143-.965-.398L12.598 3.19a1.364 1.364 0 0 1 0-1.929L13.653.21a.514.514 0 0 1 .707 0 3.833 3.833 0 0 0 4.66.772.5.5 0 0 1 .618.07l3.963 3.963a1.364 1.364 0 0 1 0 1.928l-2.66 2.66a1.366 1.366 0 0 1-.965.399Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgHammerWrench);
export default ForwardRef;
