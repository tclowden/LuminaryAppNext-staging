import { SVGProps, forwardRef, Ref } from 'react';
const SvgDocumentEdit = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 18'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#document-edit_svg__a)'>
         <path d='M9.563 3.75h-4.5a.563.563 0 1 0 0 1.125h4.5a.563.563 0 1 0 0-1.125ZM10.125 6.938a.563.563 0 0 0-.563-.563h-6a.563.563 0 1 0 0 1.125h6a.563.563 0 0 0 .563-.563ZM3.563 9a.563.563 0 1 0 0 1.125h4.124a.563.563 0 0 0 0-1.125H3.563Z' />
         <path d='M8.475 13.241a.188.188 0 0 0-.173-.116H1.875a.375.375 0 0 1-.375-.375V1.875a.375.375 0 0 1 .375-.375h9.75a.375.375 0 0 1 .375.375v7.553a.187.187 0 0 0 .32.131l.96-.96a.75.75 0 0 0 .22-.53V1.5A1.5 1.5 0 0 0 12 0H1.5A1.5 1.5 0 0 0 0 1.5v11.625a1.5 1.5 0 0 0 1.5 1.5h5.901a.375.375 0 0 0 .359-.265c.07-.233.2-.444.374-.614l.3-.3a.188.188 0 0 0 .041-.205ZM9.046 15.1a.188.188 0 0 0-.316.095l-.471 2.356a.375.375 0 0 0 .442.442l2.358-.471a.188.188 0 0 0 .095-.317L9.047 15.1ZM17.421 8.824a1.965 1.965 0 0 0-2.775 0l-4.875 4.875a.375.375 0 0 0 0 .53l2.25 2.25a.375.375 0 0 0 .53 0l4.875-4.875a1.967 1.967 0 0 0-.005-2.78Z' />
      </g>
      <defs>
         <clipPath id='document-edit_svg__a'>
            <path d='M0 0h18v18H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgDocumentEdit);
export default ForwardRef;
