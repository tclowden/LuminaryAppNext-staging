import { SVGProps, forwardRef, Ref } from 'react';
const SvgCheckCalendar = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 18 19'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='M14.283 2.348h2.152A1.565 1.565 0 0 1 18 3.913v13.304a1.566 1.566 0 0 1-1.565 1.566H1.565A1.565 1.565 0 0 1 0 17.217V3.913a1.565 1.565 0 0 1 1.565-1.565H2.74a.391.391 0 0 1 .391.391V4.5a.587.587 0 1 0 1.174 0V.783a.783.783 0 1 1 1.566 0v1.37a.196.196 0 0 0 .195.195h4.891a.391.391 0 0 1 .392.391V4.5a.587.587 0 0 0 1.174 0V.783a.783.783 0 0 1 1.565 0v1.37a.196.196 0 0 0 .196.195Zm2.037 14.755a.391.391 0 0 0 .115-.277V7.435a.391.391 0 0 0-.391-.392H1.957a.391.391 0 0 0-.392.392v9.391a.391.391 0 0 0 .392.391h14.087a.391.391 0 0 0 .276-.114ZM6.826 8.877a3.913 3.913 0 1 1 4.348 6.507 3.913 3.913 0 0 1-4.348-6.507Zm2.493 4.998 1.895-2.527a.587.587 0 0 0-.94-.705l-1.827 2.434-.899-.9a.587.587 0 1 0-.83.83l.977.981a1.077 1.077 0 0 0 1.624-.113Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgCheckCalendar);
export default ForwardRef;
