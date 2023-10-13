import { SVGProps, forwardRef, Ref } from 'react';
const SvgDocumentInfo = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g clipPath='url(#document-info_svg__a)'>
         <path d='M12 8.5h7a1 1 0 1 0 0-2h-7a1 1 0 1 0 0 2Z' />
         <path d='M23.414 3 21 .585A2 2 0 0 0 19.586 0H8a2 2 0 0 0-2 2v7.275a.248.248 0 0 0 .242.25 19.17 19.17 0 0 1 1.485.083A.246.246 0 0 0 8 9.36V2.5a.5.5 0 0 1 .5-.5h10.879a.5.5 0 0 1 .353.146l2.122 2.122a.5.5 0 0 1 .146.353V18a.5.5 0 0 1-.5.5h-6.858a.245.245 0 0 0-.241.21 7.956 7.956 0 0 1-.364 1.458.244.244 0 0 0 .228.331H22a2 2 0 0 0 2-2V4.415A1.999 1.999 0 0 0 23.414 3Z' />
         <path d='M17.5 12a1 1 0 0 0-1-1h-4a.96.96 0 0 0-.71.32.15.15 0 0 0 .014.2c.463.411.877.874 1.234 1.38a.24.24 0 0 0 .2.1H16.5a1 1 0 0 0 1-1ZM6.5 11a6.5 6.5 0 1 0 6.5 6.5A6.508 6.508 0 0 0 6.5 11ZM6 13.249a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm2 8.5H5a.75.75 0 1 1 0-1.5h.627a.123.123 0 0 0 .123-.123v-2.251a.125.125 0 0 0-.125-.125H5a.75.75 0 1 1 0-1.5h1a1.252 1.252 0 0 1 1.25 1.25v2.623a.127.127 0 0 0 .126.127H8a.75.75 0 1 1 0 1.5v-.001Z' />
      </g>
      <defs>
         <clipPath id='document-info_svg__a'>
            <path d='M0 0h24v24H0z' />
         </clipPath>
      </defs>
   </svg>
);
const ForwardRef = forwardRef(SvgDocumentInfo);
export default ForwardRef;
