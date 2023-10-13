import { SVGProps, forwardRef, Ref } from 'react';
const SvgLuminaryAppsColorIconLogo = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
   <svg
      viewBox='0 0 30 34'
      xmlns='http://www.w3.org/2000/svg'
      width={props.width || '100%'}
      height={props.height || '100%'}
      ref={ref}
      {...props}>
      <path
         d='m13.899 33.762-6.556-3.785 3.762-2.17 3.71 2.144 11.122-6.417V10.423L22.34 8.347 11.062 14.86v8.657l-3.72 2.145V13.699c0-.636.34-1.223.891-1.541l14.08-8.126 6.462 3.732c.55.318.89.906.89 1.541v15.347a1.78 1.78 0 0 1-.89 1.54l-13.096 7.57a1.78 1.78 0 0 1-1.78 0Z'
         fill='#20CAF7'
      />
      <path
         d='m15.766.238 6.556 3.785-3.762 2.17-3.71-2.144-11.123 6.417v13.111l3.598 2.076 11.278-6.513v-8.657l3.719-2.145v11.963a1.78 1.78 0 0 1-.89 1.541l-14.08 8.126-6.463-3.732A1.78 1.78 0 0 1 0 24.695V9.348c0-.635.34-1.223.89-1.54L13.985.237a1.78 1.78 0 0 1 1.78 0Z'
         fill='#fff'
      />
   </svg>
);
const ForwardRef = forwardRef(SvgLuminaryAppsColorIconLogo);
export default ForwardRef;
