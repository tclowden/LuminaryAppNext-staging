import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Icon from '../Icon';

type Props = {
   tabs: { name: string; iconName?: string }[];
   activeTabIndex: number;
   setActiveTabIndex: (index: number) => void;
   theme?: 'secondary';
};

const Tabs = ({ tabs, activeTabIndex, setActiveTabIndex: setActiveTab, theme }: Props) => {
   const [tabLeftValue, setTabLeftValue] = useState<number>(0);
   const [tabWidthValue, setTabWidthValue] = useState<number>(0);
   const tabsRef = useRef<any[]>([]);

   useEffect(() => {
      const setTabPosition = () => {
         const currentTab: any = tabsRef.current[activeTabIndex];
         setTabLeftValue(currentTab?.offsetLeft ?? 0);
         setTabWidthValue(currentTab?.clientWidth ?? 0);
      };

      setTabPosition();
      window.addEventListener('resize', setTabPosition);

      return () => window.removeEventListener('resize', setTabPosition);
   }, [tabs, activeTabIndex]);

   const tabHeight = tabsRef.current[activeTabIndex]?.offsetHeight;

   return (
      <div>
         <div className='relative inline-block rounded'>
            <div
               className={twMerge(`flex gap-[2px] rounded border-[2px] bg-lum-white  border-lum-white dark:bg-lum-gray-700 dark:border-lum-gray-700 w-max
                  ${theme === 'secondary' && 'bg-lum-gray-50 border-lum-gray-50'}`)}
               style={{ boxShadow: '0px 1px 2px rgba(16, 24, 30, 0.15)' }}>
               {tabs.map((tab, index: number) => {
                  return (
                     <button
                        key={index}
                        ref={(el) => (tabsRef.current[index] = el)}
                        className={`group shrink-0 flex items-center py-[8px] px-[15px] rounded-sm  hover:bg-lum-gray-50  dark:hover:bg-lum-gray-650
                           ${
                              theme === 'secondary' &&
                              'bg-lum-gray-50 border-lum-gray-50 hover:bg-lum-gray-100 dark:bg-lum-gray-750 dark:hover:bg-lum-gray-700'
                           }
                        `}
                        onClick={() => setActiveTab(index)}>
                        {!!tab.iconName && (
                           <Icon
                              name={tab.iconName}
                              width='16'
                              height='16'
                              className={twMerge(
                                 `z-10 pr-[5px] fill-lum-gray-200 group-hover:fill-lum-gray-300 dark:fill-lum-gray-550 dark:group-hover:fill-lum-gray-300
                                 ${theme === 'secondary' && 'fill-lum-gray-300 group-hover:fill-lum-gray-350'}
                                 ${
                                    index === activeTabIndex &&
                                    'fill-lum-white dark:fill-lum-white group-hover:fill-lum-white dark:group-hover:fill-lum-white transition-fill duration-200'
                                 }`
                              )}
                           />
                        )}
                        <span
                           className={twMerge(
                              `z-10 text-[14px] leading-[20px] text-lum-gray-450 group-hover:text-lum-gray-600 dark:text-lum-gray-300 dark:group-hover:text-lum-gray-100 ${
                                 index === activeTabIndex &&
                                 'text-lum-white dark:text-lum-white group-hover:text-lum-white dark:group-hover:text-lum-white transition-fill duration-200'
                              }`
                           )}>
                           {tab.name}
                        </span>
                     </button>
                  );
               })}
            </div>
            <span
               className='z-5 absolute bottom-[2px] block rounded-sm pointer-events-none bg-lum-blue-500 text-lum-white transition-all duration-200'
               style={{ height: tabHeight, left: tabLeftValue, width: tabWidthValue }}
            />
         </div>
      </div>
   );
};

export default Tabs;
