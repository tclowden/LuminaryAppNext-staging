import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Button, { ButtonColors, ButtonSizes } from '../button/Button';
import OptionSelector from '../option-selector/OptionSelector';
import Icon, { IconColors } from '../Icon';
import Grid from '../grid/Grid';
import ButtonOptionSelector from '../button-option-selector/ButtonOptionSelector';

type Props = {
   title?: string | React.ReactElement;
   titleSize?: 'lg' | 'md';
   titleIconName?: string;
   titleIconColor?: IconColors;
   titleImageSource?: string; // Image will take priority if BOTH titleImageSource and titleIconName are passed in
   collapsible?: boolean;
   isCollapsed?: boolean;
   onCollapseBtnClick?: (e: any) => void;
   optionsIconName?: string;
   optionsIconTooltip?: string;
   topRightChildren?: React.ReactNode;
   options?: {
      text: string;
      iconConfig?: { name: string; color: IconColors };
      callback?: (e: any, option: any) => void;
   }[];

   showChildButton?: boolean;

   // child button props
   childButtonText?: string;
   childButtonCallback?: (e: any) => void;
   childButtonIconName?: string;
   childButtonIconColor?: IconColors;
   disableChildButton?: boolean;
   childButtonChildren?: React.ReactNode;

   // for testing
   childBtnDataTestAttribute?: string;

   showChildButtonOptionSelector?: boolean;
   childButtonOptionSelectorConfig?: {
      buttonText: React.ReactNode;
      keyPath: Array<string>;
      options: Array<any>;
      onOptionSelect: (e: any, arg: any) => void;
      buttonColor?: ButtonColors;
      buttonSize?: ButtonSizes;
      buttonIconName?: string;
      buttonIconColor?: IconColors;
      disabled?: boolean;
      searchable?: boolean;
      tooltipContent?: string | React.ReactNode;
   };

   children: React.ReactNode;
};

const Panel = ({
   title,
   titleSize,
   titleIconName,
   titleIconColor,
   titleImageSource,
   collapsible,
   isCollapsed,
   onCollapseBtnClick,
   options,
   optionsIconName,
   optionsIconTooltip,
   showChildButton,
   childButtonText,
   childButtonCallback,
   childButtonIconName,
   childButtonIconColor,
   disableChildButton,
   childButtonChildren,
   showChildButtonOptionSelector,
   childButtonOptionSelectorConfig,
   children,
   topRightChildren,
   childBtnDataTestAttribute,
}: Props) => {
   const childBtnRef = useRef<any>();
   const optionsRef = useRef<any>();
   const [isContainerCollapsed, setIsContainerCollapsed] = useState<boolean>(!!isCollapsed);
   const [showOptions, setShowOptions] = useState<boolean>(false);

   useEffect(() => {
      if (collapsible && typeof isCollapsed !== 'undefined') {
         setIsContainerCollapsed(isCollapsed);
      }
   }, [collapsible, isCollapsed]);

   const titleSizeDict = {
      lg: 'text-[24px]',
      md: 'text-[20px]',
   };

   return (
      <div className='rounded' style={{ boxShadow: '0px 1px 2px rgba(16, 24, 30, 0.15)' }}>
         <div
            className={`flex justify-between items-center px-[20px] min-h-[60px] bg-lum-gray-50 dark:bg-lum-gray-700 ${
               isContainerCollapsed ? 'rounded' : 'rounded-t'
            }`}>
            <div className='flex flex-row items-center'>
               {titleImageSource ? (
                  <div className='relative w-[40px] h-[40px] mr-[8px]'>
                     <Image
                        className='rounded-full'
                        src={titleImageSource}
                        alt='Container Image'
                        style={{ objectFit: 'cover' }}
                        fill
                        sizes='40px'
                     />
                  </div>
               ) : (
                  titleIconName && (
                     <span className='mr-[8px]'>
                        <Icon color={titleIconColor} name={titleIconName} height='24' width='24' />
                     </span>
                  )
               )}
               <span
                  className={twMerge(
                     `w-[300px] text-[16px] text-lum-gray-700 dark:text-lum-white ${
                        titleSize && titleSizeDict[titleSize]
                     }`
                  )}>
                  {title}
               </span>
            </div>

            <div>
               {topRightChildren && topRightChildren}
               {!!options?.length && (
                  <span className='relative' ref={optionsRef}>
                     <Button
                        iconName={optionsIconName || 'Kebab'}
                        color='transparent'
                        onClick={() => setShowOptions(!showOptions)}
                        tooltipContent={optionsIconTooltip || 'Actions'}
                     />
                     <OptionSelector
                        options={options}
                        textKeyPath={['text']}
                        onOptionSelect={(e: any, option: any) => {
                           option?.callback && option.callback(e, option);
                        }}
                        showOptions={showOptions}
                        setShowOptions={setShowOptions}
                        siblingRef={optionsRef}
                        style={{ right: '0px' }}
                     />
                  </span>
               )}
               {collapsible && (
                  <Button
                     iconName={isContainerCollapsed ? 'Plus' : 'Minus'}
                     color='transparent'
                     onClick={(e: any) => {
                        setIsContainerCollapsed(!isContainerCollapsed);
                        onCollapseBtnClick && onCollapseBtnClick(e);
                     }}
                     tooltipContent={isContainerCollapsed ? 'Expand' : 'Collapse'}
                  />
               )}
            </div>
         </div>
         <Grid
            // max-h-[2000px]
            className={twMerge(
               `py-[30px] px-[20px] rounded-b bg-lum-white dark:bg-lum-gray-750 transition-[max-height,padding-top,padding-bottom] ease-in-out
               ${isContainerCollapsed && 'max-h-0 overflow-hidden py-0'}`
            )}>
            {children}

            {/* Child button */}
            {(showChildButton || showChildButtonOptionSelector) && (
               <div className='flex justify-center items-center py-[5px] rounded bg-lum-gray-50 dark:bg-lum-gray-700 relative'>
                  {showChildButton && (
                     <>
                        <Button
                           data-test={childBtnDataTestAttribute || 'panelChildBtn'}
                           disabled={disableChildButton}
                           ref={childBtnRef}
                           size='sm'
                           color='light'
                           iconName={childButtonIconName}
                           iconColor={childButtonIconColor}
                           onClick={(e: any) => {
                              childButtonCallback && childButtonCallback(e);
                           }}>
                           {childButtonText || 'Add New'}
                        </Button>
                        <div className='absolute' style={{ top: '100%' }}>
                           {childButtonChildren}
                        </div>
                     </>
                  )}
                  {showChildButtonOptionSelector && childButtonOptionSelectorConfig && (
                     <ButtonOptionSelector
                        keyPath={childButtonOptionSelectorConfig?.keyPath}
                        options={childButtonOptionSelectorConfig?.options}
                        onOptionSelect={(e: any, arg: any) => {
                           childButtonOptionSelectorConfig?.onOptionSelect &&
                              childButtonOptionSelectorConfig?.onOptionSelect(e, arg);
                        }}
                        size={childButtonOptionSelectorConfig?.buttonSize}
                        iconName={childButtonOptionSelectorConfig?.buttonIconName}
                        iconColor={childButtonOptionSelectorConfig?.buttonIconColor}
                        color={childButtonOptionSelectorConfig?.buttonColor}
                        disabled={childButtonOptionSelectorConfig?.disabled}
                        searchable={childButtonOptionSelectorConfig?.searchable}
                        tooltipContent={childButtonOptionSelectorConfig?.tooltipContent}>
                        {childButtonOptionSelectorConfig?.buttonText}
                     </ButtonOptionSelector>
                  )}
               </div>
            )}
         </Grid>
      </div>
   );
};

export default Panel;
