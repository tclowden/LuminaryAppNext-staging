import { SVGProps, forwardRef, Ref } from 'react';
const SvgMailOpen = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 18'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#mail-open_svg__a)'>
         <path d='M13.807 11.349a.566.566 0 0 1-.3.09H4.5a.566.566 0 0 1-.3-.09L.289 8.836A.187.187 0 0 0 0 8.994V16.5A1.5 1.5 0 0 0 1.5 18h15a1.5 1.5 0 0 0 1.5-1.5V8.995a.187.187 0 0 0-.194-.188.187.187 0 0 0-.095.03l-3.904 2.512Z' />
         <path d='M3.836 9.78a.188.188 0 0 0 .289-.157V1.687a.188.188 0 0 1 .187-.187h9.375a.188.188 0 0 1 .188.187v7.931a.187.187 0 0 0 .194.188.187.187 0 0 0 .095-.03l3.047-1.955a.188.188 0 0 0 .006-.312l-1.842-1.284v-4.57a1.585 1.585 0 0 0-1.5-1.657h-9.75a1.586 1.586 0 0 0-1.5 1.657v4.57L.781 7.507a.187.187 0 0 0 .006.312l3.05 1.961Z' />
         <path d='M8.432 3.75a.563.563 0 0 0-.562-.563h-1.5a.563.563 0 1 0 0 1.126h1.5a.562.562 0 0 0 .562-.563ZM5.813 6.375a.563.563 0 0 0 .562.563h5.25a.562.562 0 1 0 0-1.125h-5.25a.563.563 0 0 0-.563.562ZM6.375 9.563h5.25a.562.562 0 1 0 0-1.126h-5.25a.563.563 0 1 0 0 1.126Z' />
      </g>
      <defs>
         <clipPath id='mail-open_svg__a'>
            <path d='M0 0h18v18H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgMailOpen);
export default ForwardRef;
