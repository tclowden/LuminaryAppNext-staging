import { SVGProps, forwardRef, Ref } from 'react';
const SvgTagEdit = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 15 14'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         fillRule='evenodd'
         clipRule='evenodd'
         d='m5.611 13.388.317-1.109a.1.1 0 0 0-.165-.097.598.598 0 0 1-.825 0l-3.6-3.603a.583.583 0 0 1 0-.825l6.416-6.417a.58.58 0 0 1 .413-.17h3.892a.292.292 0 0 1 .292.291v3.935a.145.145 0 0 0 .146.157h.007c.275 0 .548.046.808.137a.145.145 0 0 0 .172-.059.146.146 0 0 0 .022-.06c.009-.073.013-.146.013-.218V1.167A1.167 1.167 0 0 0 12.352 0H8.168a1.737 1.737 0 0 0-1.238.513L.512 6.93a1.75 1.75 0 0 0 0 2.475l3.601 3.6a1.745 1.745 0 0 0 1.237.512c.042 0 .084 0 .126-.005a.145.145 0 0 0 .13-.107l.005-.017Zm4.406-9.013a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75Zm-2.56 7.318a.29.29 0 0 0-.488.126l-.517 1.809a.292.292 0 0 0 .36.36l1.81-.516a.291.291 0 0 0 .128-.486l-1.294-1.293Zm3.312-4.062c.077 0 .152.03.206.085l1.753 1.75a.292.292 0 0 1 0 .413l-2.924 2.923a.292.292 0 0 1-.412 0l-1.75-1.75a.292.292 0 0 1 0-.413l2.92-2.922a.292.292 0 0 1 .207-.086Zm.556-.648a.293.293 0 0 1 .065-.094 1.55 1.55 0 0 1 2.188-.025 1.532 1.532 0 0 1 0 2.163.34.34 0 0 1-.22.099.315.315 0 0 1-.22-.072l-1.75-1.75a.296.296 0 0 1-.063-.32Z'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgTagEdit);
export default ForwardRef;
