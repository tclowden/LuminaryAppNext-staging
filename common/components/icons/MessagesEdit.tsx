import { SVGProps, forwardRef, Ref } from 'react';
const SvgMessagesEdit = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#messages-edit_svg__a)'>
         <path d='M12.006 6.925a2.821 2.821 0 0 1 2.49-.777.146.146 0 0 0 .17-.144c0-3.309-3.29-6-7.333-6S0 2.695 0 6.004a5.387 5.387 0 0 0 1.772 3.903L.687 12.89a.333.333 0 0 0 .442.421l3.888-1.62a8.771 8.771 0 0 0 1.848.296.165.165 0 0 0 .127-.049l5.014-5.013ZM15.485 7.84a1.747 1.747 0 0 0-2.467 0l-4.453 4.453a.166.166 0 0 0 0 .236l2.235 2.236a.166.166 0 0 0 .235 0l4.453-4.454a1.748 1.748 0 0 0-.003-2.471ZM7.733 15.99l2.096-.42a.167.167 0 0 0 .129-.203.167.167 0 0 0-.044-.078l-1.873-1.872a.166.166 0 0 0-.281.086L7.34 15.6a.333.333 0 0 0 .393.392v-.002Z' />
      </g>
      <defs>
         <clipPath id='messages-edit_svg__a'>
            <path d='M0 0h16v16H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgMessagesEdit);
export default ForwardRef;
