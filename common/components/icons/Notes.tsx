import { SVGProps, forwardRef, Ref } from 'react';
const SvgNotes = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 22 24'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M17.207 9.793A1 1 0 0 1 16.5 11.5h-11a1 1 0 0 1 0-2h11a1 1 0 0 1 .707.293ZM17.207 13.793A1 1 0 0 1 16.5 15.5h-11a1 1 0 0 1 0-2h11a1 1 0 0 1 .707.293ZM13.5 17.5h-8a1 1 0 0 0 0 2h8a1 1 0 0 0 0-2Z' />
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M21.414 3.086A2 2 0 0 1 22 4.5V22a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4.5a2 2 0 0 1 2-2h1.75A.25.25 0 0 0 4 2.25V1a1 1 0 0 1 2 0v1.25a.25.25 0 0 0 .25.25h3.5a.25.25 0 0 0 .25-.25V1a1 1 0 0 1 2 0v1.25a.25.25 0 0 0 .25.25h3.5a.25.25 0 0 0 .25-.25V1a1 1 0 0 1 2 0v1.25a.25.25 0 0 0 .25.25H20a2 2 0 0 1 1.414.586Zm-1.487 18.84A.25.25 0 0 0 20 21.75l-.004-17a.25.25 0 0 0-.25-.25h-1.5a.25.25 0 0 0-.249.249V5.5a1 1 0 0 1-2 0v-.75a.25.25 0 0 0-.25-.25h-3.5a.248.248 0 0 0-.248.248V5.5a1 1 0 0 1-2 0v-.75a.25.25 0 0 0-.25-.25h-3.5A.249.249 0 0 0 6 4.749V5.5a1 1 0 0 1-2 0v-.75a.25.25 0 0 0-.25-.25h-1.5a.25.25 0 0 0-.25.25v17a.25.25 0 0 0 .25.25h17.5a.25.25 0 0 0 .177-.073Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgNotes);
export default ForwardRef;
