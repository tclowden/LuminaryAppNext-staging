import { SVGProps, forwardRef, Ref } from 'react';
const SvgLock = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 12 15'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g fill='none' fillRule='evenodd'>
         <path d='M-1.5-.125h15v15h-15z' />
         <path
            d='M10.208 5.917h-.437V4.313a3.939 3.939 0 0 0-7.875 0v1.604h-.438c-.644 0-1.166.522-1.166 1.166v6.125c0 .645.522 1.167 1.166 1.167h8.75c.645 0 1.167-.522 1.167-1.167V7.083c0-.644-.522-1.166-1.167-1.166zm-4.375 5.25a1.167 1.167 0 1 1 .002-2.334 1.167 1.167 0 0 1-.002 2.334zm2.48-5.542a.292.292 0 0 1-.292.292H3.646a.292.292 0 0 1-.292-.292V4.312a2.48 2.48 0 1 1 4.959.001v1.312z'
            fill='#D3D8DC'
            fillRule='nonzero'
         />
      </g>
   </svg>
);
const ForwardRef = forwardRef(SvgLock);
export default ForwardRef;
