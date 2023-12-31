import { SVGProps, forwardRef, Ref } from 'react';
const SvgUsage = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 20 20'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <g fill='#7D8D9A' fillRule='nonzero'>
         <rect width={1.667} height={6.667} x={12.083} y={4.583} rx={0.5} />
         <rect width={1.667} height={5} x={15} y={6.25} rx={0.5} />
         <path d='M12 15.592a6.697 6.697 0 0 1-.303 1.216.203.203 0 0 0 .19.275h6.446c.92 0 1.667-.746 1.667-1.666V3.678c0-.442-.176-.866-.488-1.178L17.5.488A1.671 1.671 0 0 0 16.32 0H6.668C5.747 0 5 .746 5 1.667v6.062c0 .113.089.206.202.208.305.006.865.029 1.237.069a.2.2 0 0 0 .16-.052.205.205 0 0 0 .068-.155V2.083c0-.23.186-.416.416-.416h9.066c.11 0 .216.043.294.121l1.769 1.769a.415.415 0 0 1 .121.294V15c0 .23-.186.417-.416.417h-5.715a.204.204 0 0 0-.202.175z' />
         <path d='M9.583 8.333a.417.417 0 0 0-.416.417v.19a.27.27 0 0 0 .13.227c.433.312.828.676 1.175 1.083.058.064.15.084.23.053a.209.209 0 0 0 .131-.196V8.75a.417.417 0 0 0-.416-.417h-.834zM5.417 20A5.416 5.416 0 1 0 0 14.583 5.424 5.424 0 0 0 5.417 20zm-.758-8.5v-.007a.159.159 0 0 0 .137-.166v-.292a.625.625 0 0 1 1.25 0v.28a.143.143 0 0 0 .14.137h.48a.625.625 0 1 1 .001 1.25H4.973a.494.494 0 0 0-.184.95l1.72.689a1.732 1.732 0 0 1-.353 3.326.152.152 0 0 0-.114.166v.295a.625.625 0 1 1-1.25 0v-.278a.141.141 0 0 0-.137-.138h-.488a.625.625 0 1 1 0-1.25H5.86a.494.494 0 0 0 .183-.951l-1.719-.692a1.733 1.733 0 0 1 .333-3.317l.001-.002z' />
      </g>
   </svg>
);
const ForwardRef = forwardRef(SvgUsage);
export default ForwardRef;
