import { SVGProps, forwardRef, Ref } from 'react';
const SvgPriceTag = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#price-tag_svg__a)'>
         <path d='M17.5 11a6.5 6.5 0 1 0 6.5 6.5 6.508 6.508 0 0 0-6.5-6.5ZM16 21.249a.75.75 0 1 1 0-1.5h2.033a.592.592 0 0 0 .221-1.141l-2.065-.826a2.084 2.084 0 0 1 .361-3.98.25.25 0 0 0 .2-.245v-.308a.75.75 0 1 1 1.5 0v.25a.25.25 0 0 0 .25.25h.5a.75.75 0 1 1 0 1.5h-2.033a.592.592 0 0 0-.221 1.141l2.065.826a2.084 2.084 0 0 1-.361 3.98.249.249 0 0 0-.2.245v.308a.75.75 0 1 1-1.5 0V21.5a.25.25 0 0 0-.25-.25l-.5-.001Z' />
         <path d='M5.422 19.5a1.972 1.972 0 0 0 1.406.582h.012a1.973 1.973 0 0 0 1.41-.6l1.217-1.241a.493.493 0 0 0 .136-.367 7.975 7.975 0 0 1 8.2-8.363.486.486 0 0 0 .363-.143l.939-.958c.587-.67.933-1.52.98-2.41V2a2 2 0 0 0-2-2h-4.26a3.758 3.758 0 0 0-2.412 1L.586 11.834a2 2 0 0 0 0 2.828L5.422 19.5Zm7.164-14a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z' />
      </g>
      <defs>
         <clipPath id='price-tag_svg__a'>
            <path d='M0 0h24v24H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgPriceTag);
export default ForwardRef;
