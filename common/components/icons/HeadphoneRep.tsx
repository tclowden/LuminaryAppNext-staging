import { SVGProps, forwardRef, Ref } from 'react';
const SvgHeadphoneRep = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 16 18'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M8.474 8.358a1.245 1.245 0 1 0 1.252 1.245 1.253 1.253 0 0 0-1.252-1.245Z' />
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M11.125 1.39c.037.098.114.177.213.215A7.325 7.325 0 0 1 16 8.521c0 2.58-.936 4.513-2.785 5.759a.368.368 0 0 0-.162.306v2.732a.369.369 0 0 1-.369.369h-7.37a.369.369 0 0 1-.368-.369v-1.105a.368.368 0 0 0-.368-.369H3.47a1.842 1.842 0 0 1-1.842-1.842v-1.459a.369.369 0 0 0-.369-.368c-.137 0-.278-.003-.406-.008a.92.92 0 0 1-.71-.384.901.901 0 0 1-.14-.547v-.1c-.056-.815.52-1.832 1.032-2.736l.016-.028.026-.045c.116-.205.251-.44.352-.64.096-.19.15-.399.158-.612a6.052 6.052 0 0 1 3.99-5.362.368.368 0 0 0 .21-.23A2.131 2.131 0 0 1 7.819 0h1.31c.891 0 1.687.555 1.997 1.39ZM8.31 12.686a.736.736 0 0 1 .412-.168v-.001a2.912 2.912 0 0 0 1.246-5.426.368.368 0 0 1-.183-.318v-4.65a.653.653 0 0 0-.655-.65h-1.31a.653.653 0 0 0-.649.65v4.648c0 .13-.07.251-.182.317a2.904 2.904 0 0 0-.097 4.976.184.184 0 0 1 0 .308c-.455.307-.95.553-1.47.73a.368.368 0 0 1-.325-.046.912.912 0 0 0-.52-.163h-.369a.921.921 0 1 0 0 1.843h.369a.92.92 0 0 0 .737-.369.369.369 0 0 1 .195-.133 7.78 7.78 0 0 0 2.8-1.548Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgHeadphoneRep);
export default ForwardRef;