import { SVGProps, forwardRef, Ref } from 'react';
const SvgBoardView = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M5.106 0H1.532C.686 0 0 .7 0 1.565v14.609c0 .864.686 1.565 1.532 1.565h3.574c.846 0 1.532-.7 1.532-1.565V1.565C6.638.701 5.952 0 5.106 0ZM13.787 0h-3.574C9.367 0 8.68.7 8.68 1.565v20.87c0 .864.686 1.565 1.532 1.565h3.574c.846 0 1.532-.7 1.532-1.565V1.565C15.32.701 14.633 0 13.787 0ZM18.894 0h3.574C23.314 0 24 .7 24 1.565v8.348c0 .864-.686 1.565-1.532 1.565h-3.574c-.846 0-1.532-.7-1.532-1.565V1.565c0-.864.686-1.565 1.532-1.565Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgBoardView);
export default ForwardRef;
