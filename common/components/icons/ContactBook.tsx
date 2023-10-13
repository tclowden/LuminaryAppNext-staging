import { SVGProps, forwardRef, Ref } from 'react';
const SvgContactBook = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 17 19'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M14.635 3.167V1.583A1.583 1.583 0 0 0 13.052 0H3.156A2.375 2.375 0 0 0 .781 2.375v14.25A2.375 2.375 0 0 0 3.156 19h11.48a1.583 1.583 0 0 0 1.583-1.583V4.75a1.584 1.584 0 0 0-1.584-1.583Zm-4.304 9.527.352-.352a.997.997 0 0 1 1.413 0l1.059 1.06a.997.997 0 0 1 0 1.412l-.58.58a1.498 1.498 0 0 1-1.885.19 23.178 23.178 0 0 1-6.492-6.492 1.495 1.495 0 0 1 .185-1.888l.581-.582a1.001 1.001 0 0 1 1.414 0L7.44 7.686a.996.996 0 0 1 0 1.411l-.353.353a23.72 23.72 0 0 0 3.245 3.244ZM3.156 1.584h9.698a.198.198 0 0 1 .198.197V2.97a.198.198 0 0 1-.198.198H3.156a.792.792 0 1 1 0-1.584Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgContactBook);
export default ForwardRef;
