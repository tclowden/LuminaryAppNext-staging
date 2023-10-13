import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import Icon from '../../../common/components/Icon';
import { strToCamelCase } from '../../../utilities/helpers';
import { Page } from './Sidebar';

type Props = {
   page: Page;
   showLink?: boolean;
   activeRouteStack: Array<any>;
   handleSectionClicked?: (e: any, section: any) => void;
   isButton?: boolean;
   className?: string;
};

const PageLink = ({ page, showLink, activeRouteStack, handleSectionClicked, isButton, className }: Props) => {
   const isActive = activeRouteStack?.find((item: any) => item?.id === page?.id);

   return (
      <>
         {page.route ? (
            <Link
               data-test={`${strToCamelCase(page.name)}PageSidebarLink`}
               href={`/${page.route}`}
               className={twMerge(`
                  group relative flex items-center rounded px-[10px] cursor-pointer min-h-[40px] 
                  ${isActive ? 'bg-lum-gray-700' : 'hover:bg-lum-gray-700'}
                  ${className ? className : ''}
                  ${!showLink && 'hidden'}
               `)}>
               <Icon
                  name={page.iconName || 'Gear'}
                  width={18}
                  height={18}
                  className={`
                     min-w-[18px] min-h-[18px]
                     ${isActive ? 'fill-lum-gray-300' : 'fill-lum-gray-550 group-hover:fill-lum-gray-450'}
                  `}
               />
               <span
                  className={`
                     text-[14px] ml-[11px] capitalize truncate 
                     ${isActive ? 'text-lum-white font-semibold' : 'text-lum-gray-400 group-hover:text-lum-gray-300'}
                  `}>
                  {page.name}
               </span>
            </Link>
         ) : (
            <div
               className={twMerge(`
                  group relative flex items-center rounded px-[10px] cursor-pointer min-h-[40px] 
                  ${isActive ? 'bg-lum-gray-700' : 'hover:bg-lum-gray-700'}
                  ${className ? className : ''}
                  ${!showLink && 'hidden'}
               `)}
               onClick={(e: any) => handleSectionClicked && handleSectionClicked(e, page)}>
               <Icon
                  name={page.iconName || 'Gear'}
                  width={18}
                  height={18}
                  className={`
                     min-w-[18px] min-h-[18px]
                     ${isActive ? 'fill-lum-gray-300' : 'fill-lum-gray-550 group-hover:fill-lum-gray-450'}
               `}
               />
               <span
                  className={`
                     text-[14px] ml-[11px] capitalize truncate mr-auto
                     ${isActive ? 'text-lum-white font-semibold' : 'text-lum-gray-400 group-hover:text-lum-gray-300'}
                  `}>
                  {page.name}
               </span>
               {!isButton && (
                  <Icon
                     name={'ChevronRight'}
                     width={16}
                     height={16}
                     className={`
                     min-w-[16px] min-h-[16px]
                     ${isActive ? 'fill-lum-gray-300' : 'fill-lum-gray-550 group-hover:fill-lum-gray-450'}
                  `}
                  />
               )}
            </div>
         )}
      </>
   );
};

export default PageLink;
