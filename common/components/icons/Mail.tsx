import { SVGProps, forwardRef, Ref } from 'react';
const SvgMail = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 12'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M9 8.191a.939.939 0 0 1-.664-.274L1.072.653a.375.375 0 0 1-.09-.384C1.062.023 1.294 0 1.5 0h15c.205 0 .435.023.517.27a.375.375 0 0 1-.09.382L9.662 7.917A.939.939 0 0 1 9 8.191Zm8.837-6.825a.137.137 0 0 1 .14.058A.135.135 0 0 1 18 1.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 0 10.5v-9a.136.136 0 0 1 .233-.097L7.54 8.712a2.062 2.062 0 0 0 2.916 0l7.31-7.309a.136.136 0 0 1 .07-.037Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgMail);
export default ForwardRef;
