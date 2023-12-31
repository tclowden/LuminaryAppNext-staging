import { SVGProps, forwardRef, Ref } from 'react';
const SvgClipboardGrey = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 38 47'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g fillRule='nonzero' fill='#929FA9'>
         <path d='M27.55 17.944h-17.1a1.425 1.425 0 0 0 0 2.85h17.1a1.425 1.425 0 1 0 0-2.85ZM28.975 26.018c0-.787-.638-1.425-1.425-1.425h-17.1a1.425 1.425 0 0 0 0 2.85h17.1c.787 0 1.425-.638 1.425-1.425ZM15.2 13.194h7.6a1.9 1.9 0 0 0 1.9-1.9v-4.75a5.713 5.713 0 0 0-7.235-5.496A5.786 5.786 0 0 0 13.3 6.71v4.584c0 1.05.85 1.9 1.9 1.9Zm2.375-7.125a1.425 1.425 0 1 1 .417 1.007 1.425 1.425 0 0 1-.417-1.008v.001Z' />
         <path d='M33.25 6.544h-5.225a.475.475 0 0 0-.475.475v2.85c0 .263.213.475.475.475H32.3a.95.95 0 0 1 .95.95V35.6a.95.95 0 0 1-.277.673l-6.096 6.093a.95.95 0 0 1-.67.278H5.7a.95.95 0 0 1-.95-.95V11.294a.95.95 0 0 1 .95-.95h4.275a.475.475 0 0 0 .475-.475V7.02a.475.475 0 0 0-.475-.475H4.75a3.8 3.8 0 0 0-3.8 3.8v32.3a3.8 3.8 0 0 0 3.8 3.8h28.5a3.8 3.8 0 0 0 3.8-3.8v-32.3a3.8 3.8 0 0 0-3.8-3.8Z' />
         <path d='M10.45 31.244a1.425 1.425 0 0 0 0 2.85h7.125a1.425 1.425 0 1 0 0-2.85H10.45Z' />
      </g>
   </svg>
);
const ForwardRef = forwardRef(SvgClipboardGrey);
export default ForwardRef;
