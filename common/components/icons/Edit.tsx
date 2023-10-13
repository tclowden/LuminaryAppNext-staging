import { SVGProps, forwardRef, Ref } from 'react';
const SvgEdit = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 16 16'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path d='M13.333 7.664a.667.667 0 0 0-.666.666v5.667a.667.667 0 0 1-.667.667H2a.667.667 0 0 1-.667-.667V2.664c0-.369.299-.667.667-.667h6.667a.667.667 0 0 0 0-1.333H2a2 2 0 0 0-2 2v11.333a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.33a.667.667 0 0 0-.667-.666Z' />
      <path d='M12.545 2.037a.344.344 0 0 0-.471 0l-5.207 5.21a.334.334 0 0 0-.074.111l-.944 2.357a.333.333 0 0 0 .074.36c.096.09.235.119.359.073l2.357-.945a.333.333 0 0 0 .112-.074l5.209-5.206a.333.333 0 0 0 0-.471l-1.415-1.415ZM15.61.388a1.365 1.365 0 0 0-1.885 0l-.708.706a.333.333 0 0 0 0 .472l1.414 1.414c.13.13.34.13.471 0l.707-.707c.52-.52.52-1.365 0-1.885h.001Z' />
   </svg>
);
const ForwardRef = forwardRef(SvgEdit);
export default ForwardRef;
