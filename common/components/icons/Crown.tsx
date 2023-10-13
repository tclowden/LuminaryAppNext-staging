import { SVGProps, forwardRef, Ref } from 'react';
const SvgCrown = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M3.5 18.726a2.283 2.283 0 0 0 .5 4.5h16a2.19 2.19 0 0 0 1.678-.723 2.291 2.291 0 0 0 .56-1.527 2.151 2.151 0 0 0-1.738-2.25ZM20.424 17.726a.5.5 0 0 0 .479-.359l1.817-6.175a.751.751 0 0 0-1.218-.773L18.484 13.1a1.413 1.413 0 0 1-1.077.346.885.885 0 0 1-.637-.358c-.369-.527-.189-.889.874-1.753a1.243 1.243 0 0 0 .294-1.6l-4.857-8.386a1.3 1.3 0 0 0-2.164 0L6.062 9.738a1.241 1.241 0 0 0 .292 1.6c1.063.866 1.243 1.227.875 1.754a.889.889 0 0 1-.638.358 1.416 1.416 0 0 1-1.076-.35L2.5 10.417a.751.751 0 0 0-1.219.774L3.1 17.367a.5.5 0 0 0 .48.359ZM10.6 9.177l1-1.335a.5.5 0 0 1 .8 0l1 1.334a.507.507 0 0 1 0 .6l-1 1.335a.52.52 0 0 1-.8 0l-1-1.334a.507.507 0 0 1 0-.6Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgCrown);
export default ForwardRef;
