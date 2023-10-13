import { SVGProps, forwardRef, Ref } from 'react';
const SvgLeadSearch = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 16 16'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#lead-search_svg__a)'>
         <path d='M8.127 7.327a.167.167 0 0 0 .061-.157.164.164 0 0 0-.106-.133c-.133-.051-.272-.103-.417-.155l-.418-.153a.4.4 0 0 1-.092-.208 1.715 1.715 0 0 1 .038-.866 3.746 3.746 0 0 0 .978-2.876C8.17 1.17 7.118 0 5.667 0 4.215 0 3.163 1.17 3.163 2.783a3.737 3.737 0 0 0 .97 2.864c.096.283.113.586.049.878a.41.41 0 0 1-.09.206l-.42.154C2.04 7.485.861 7.92.501 8.636A6.116 6.116 0 0 0 0 11a.333.333 0 0 0 .333.333h5.839a.166.166 0 0 0 .156-.11.166.166 0 0 0 .01-.066c0-.052-.005-.104-.005-.157a4.658 4.658 0 0 1 1.794-3.673Z' />
         <path d='M14.115 13.173a.166.166 0 0 1-.022-.208 3.676 3.676 0 1 0-1.128 1.128.167.167 0 0 1 .207.022l1.69 1.69a.666.666 0 0 0 .943-.943l-1.69-1.69ZM8.667 11a2.333 2.333 0 1 1 4.666 0 2.333 2.333 0 0 1-4.666 0Z' />
      </g>
      <defs>
         <clipPath id='lead-search_svg__a'>
            <path d='M0 0h16v16H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgLeadSearch);
export default ForwardRef;
