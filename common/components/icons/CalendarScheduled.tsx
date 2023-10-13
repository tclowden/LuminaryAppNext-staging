import { SVGProps, forwardRef, Ref } from 'react';
const SvgCalendarScheduled = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 23 24'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M18.25 3H21a2 2 0 0 1 2 2v17a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1.5a.5.5 0 0 1 .5.5v2.25a.75.75 0 0 0 1.5 0V1a1 1 0 0 1 2 0v1.751A.25.25 0 0 0 7.75 3H14a.5.5 0 0 1 .5.5v2.25a.75.75 0 1 0 1.5 0V1a1 1 0 0 1 2 0v1.75a.25.25 0 0 0 .25.25Zm2.604 18.854A.5.5 0 0 0 21 21.5v-12a.5.5 0 0 0-.5-.5h-18a.5.5 0 0 0-.5.5v12a.5.5 0 0 0 .5.5h18a.5.5 0 0 0 .354-.146ZM8.722 11.343a5 5 0 1 1 5.556 8.314 5 5 0 0 1-5.556-8.314Zm3.186 6.386 2.421-3.229h-.001a.75.75 0 0 0-1.2-.9l-2.334 3.11-1.149-1.15a.749.749 0 1 0-1.061 1.06l1.249 1.254a1.376 1.376 0 0 0 2.075-.145Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgCalendarScheduled);
export default ForwardRef;
