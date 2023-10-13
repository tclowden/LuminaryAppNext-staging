import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { getObjectProp, strToCamelCase } from '../../../utilities/helpers';
import Checkbox from '../checkbox/Checkbox';
import Icon from '../Icon';
import Input from '../input/Input';

interface SearchConfig {
   placeholder?: string;
   searchValue: string;
   handleChange: (e: any) => void;
}

type Props = {
   options: any[];
   textKeyPath?: string[]; // optional since options can be an array of strings
   onOptionSelect: (e: any, option: any) => void;
   showOptions: boolean;
   setShowOptions: (bool: boolean) => void;
   selectedValues?: Array<any>;
   multiSelect?: boolean;
   siblingRef?: any; // This ref is used to determine if the user is clicking on a sibling container that should not toggle the On/Off of displaying the options (the DropDown component currently utilizes this)
   style?: any;
   autoFocus?: boolean;
   onBlur?: any;
   maxHeight?: number;
   searchable?: boolean;
   searchConfig?: SearchConfig;
   isLoading?: boolean;
   noOptionsDisplayText?: string;
};

const OptionSelector = ({
   options,
   textKeyPath,
   onOptionSelect,
   showOptions,
   setShowOptions,
   selectedValues,
   multiSelect,
   siblingRef,
   style,
   autoFocus = true,
   onBlur,
   maxHeight = 400,
   searchable,
   searchConfig,
   isLoading,
   noOptionsDisplayText,
}: Props) => {
   const optionContainerRef = useRef<any>();

   useEffect(() => {
      const handleClickOutside = (event: Event) => {
         if (
            siblingRef?.current &&
            !siblingRef?.current?.contains(event.target) &&
            optionContainerRef.current &&
            !optionContainerRef.current?.contains(event.target) &&
            showOptions
         ) {
            setShowOptions(false);
            onBlur && onBlur(event);
            // Simulate sending an event with target value of '' so that search can clear on close
            searchable && searchConfig?.handleChange && searchConfig?.handleChange({ target: { value: '' } });
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [siblingRef, optionContainerRef, showOptions, setShowOptions]);

   // This function is used specifically for NON-Multiselect list items. This ensures that the options are hidden after only making one selection.
   const handleOptionClick = (e: any, option: any) => {
      onOptionSelect(e, option);
      // Simulate sending an event with target value of '' so that search can clear on close
      searchable && searchConfig?.handleChange && searchConfig?.handleChange({ target: { value: '' } });
      setShowOptions(false);
   };

   const handleKeyPress = (e: any, option: any, cb: (e: any, option: any) => void) => {
      e.preventDefault();
      switch (e.key) {
         case ' ':
         case 'Enter':
            cb(e, option);
            break;
         case 'Tab':
            setShowOptions(false);
            break;
         case 'ArrowUp':
            focusPreviousItem();
            break;
         case 'ArrowDown':
            focusNextItem();
            break;
         default:
            break;
      }
   };

   const focusPreviousItem = () => {
      const item = document.activeElement;
      if (item?.previousElementSibling) {
         activateItem(item.previousElementSibling);
      }
   };

   const focusNextItem = () => {
      const item = document.activeElement;
      if (item?.nextElementSibling) {
         activateItem(item.nextElementSibling);
      }
   };

   const activateItem = (item: any) => {
      item.focus();
   };

   return (
      <>
         {isLoading && (
            <div className='absolute w-full min-w-max rounded z-10 cursor-pointer bg-lum-white dark:bg-lum-gray-700 border-[1px] border-solid border-lum-gray-200 dark:border-lum-gray-650 overflow-y-auto'>
               <div className='text-[14px] text-lum-gray-600 dark:text-lum-gray-300 w-full animate-pulse flex py-[7px] px-[9px] first:rounded-t last:rounded-b hover:bg-lum-gray-50 active:bg-lum-gray-100 dark:hover:bg-lum-gray-675 dark:active:bg-lum-gray-800'>
                  Searching...
               </div>
            </div>
         )}
         {noOptionsDisplayText && (
            <div className='absolute w-full min-w-max rounded z-10 cursor-pointer bg-lum-white dark:bg-lum-gray-700 border-[1px] border-solid border-lum-gray-200 dark:border-lum-gray-650 overflow-y-auto'>
               <div className='text-[14px] text-lum-gray-600 dark:text-lum-gray-300 w-full flex py-[7px] px-[9px] first:rounded-t last:rounded-b hover:bg-lum-gray-50 active:bg-lum-gray-100 dark:hover:bg-lum-gray-675 dark:active:bg-lum-gray-800'>
                  {noOptionsDisplayText}
               </div>
            </div>
         )}
         {showOptions && (!!options.length || searchable) && (
            <div
               ref={optionContainerRef}
               className={twMerge(`
                  absolute w-full min-w-max rounded z-10 cursor-pointer bg-lum-white dark:bg-lum-gray-700 border-[1px] border-solid border-lum-gray-200 dark:border-lum-gray-650 overflow-y-auto
               `)}
               style={{
                  boxShadow: '0px 2px 5px rgba(16, 24, 30, 0.3)',
                  top: '100%',
                  maxHeight: `${maxHeight}px`,
                  ...style,
               }}
               data-test='optionSelector'>
               {searchable && (
                  <div className='sticky top-0 z-10'>
                     <Input
                        iconName='MagnifyingGlass'
                        placeholder={searchConfig?.placeholder || 'search'}
                        value={searchConfig?.searchValue || ''}
                        onKeyDown={(e: any) => {
                           if (e.key === 'Enter') {
                              onOptionSelect(e, 'Create New');
                              // setShowOptions(false);
                           }
                        }}
                        onChange={(e: any) => searchConfig?.handleChange && searchConfig?.handleChange(e)}
                        onClearInput={() => {
                           // Simulate sending an event with target value of '' so that search can clear on close
                           searchConfig?.handleChange && searchConfig?.handleChange({ target: { value: '' } });
                        }}
                        customInputClasses='rounded-b-none bg-lum-white border-x-0 border-t-0'
                     />
                  </div>
               )}

               {options
                  .sort((a, b) => (textKeyPath ? getObjectProp(a, textKeyPath) : a).localeCompare(textKeyPath ? getObjectProp(b, textKeyPath) : b))
                  .map((option: any, index) => {
                     const configuredOptionVal = textKeyPath ? getObjectProp(option, textKeyPath) : option;
                     return multiSelect ? (
                        <button
                           data-test={`${strToCamelCase(configuredOptionVal)}`}
                           type='button'
                           key={index}
                           className='flex w-full truncate first:rounded-t last:rounded-b hover:bg-lum-gray-50 active:bg-lum-gray-100 dark:hover:bg-lum-gray-675 dark:active:bg-lum-gray-800'
                           onClick={(e: any) => {
                              onOptionSelect(e, option);
                           }}
                           autoFocus={autoFocus && index === 0}
                           tabIndex={index === 0 ? 0 : -1}
                           onKeyDown={(e: any) => {
                              handleKeyPress(e, option, onOptionSelect);
                           }}>
                           <Checkbox
                              label={configuredOptionVal}
                              className={'py-[7px] px-[9px] left-[9px]'}
                              checked={
                                 !!selectedValues?.find((item) => {
                                    const tempItem = textKeyPath ? getObjectProp(item, textKeyPath) : item;
                                    if (tempItem === configuredOptionVal) return item;
                                 })
                              }
                              onChange={(e: any) => {
                                 onOptionSelect(e, option);
                              }}
                           />
                        </button>
                     ) : (
                        <button
                           data-test={`${strToCamelCase(configuredOptionVal)}`}
                           type='button'
                           key={index}
                           onClick={(e: any) => {
                              handleOptionClick(e, option);
                           }}
                           className='flex w-full py-[7px] px-[9px] first:rounded-t last:rounded-b hover:bg-lum-gray-50 active:bg-lum-gray-100 dark:hover:bg-lum-gray-675 dark:active:bg-lum-gray-800'
                           autoFocus={autoFocus && index === 0}
                           tabIndex={index === 0 ? 0 : -1}
                           onKeyDown={(e: any) => {
                              handleKeyPress(e, option, handleOptionClick);
                           }}>
                           <span className='flex flex-row items-center text-[14px] leading-[20px] text-lum-gray-600 dark:text-lum-white'>
                              {!!option.iconConfig && (
                                 <span className='mr-[10px]'>
                                    <Icon
                                       name={option.iconConfig.name}
                                       color={option.iconConfig.color}
                                       width='20'
                                       height='20'
                                    />
                                 </span>
                              )}
                              {configuredOptionVal}
                           </span>
                        </button>
                     );
                  })}
               {/* {showCreateBtn && (
                  <button
                     // data-test={`${strToCamelCase(configuredOptionVal)}`}
                     type='button'
                     onClick={(e: any) => {
                        handleOptionClick(e, 'Create New');
                     }}
                     className='flex w-full py-[7px] px-[9px] first:rounded-t last:rounded-b'
                     autoFocus={autoFocus}
                     tabIndex={-1}
                     onKeyDown={(e: any) => {
                        // handleKeyPress(e, option, handleOptionClick);
                     }}>
                     <span className='flex flex-row items-center justify-center text-[14px] leading-[20px] text-lum-gray-600 dark:text-lum-white bg-lum-gray-100 w-full p-2 rounded hover:bg-lum-gray-50 active:bg-lum-gray-100 dark:hover:bg-lum-gray-675 dark:active:bg-lum-gray-800'>
                        <span className='mr-[10px]'>
                           <Icon name={'Plus'} color={'gray'} width='12' height='12' />
                        </span>
                        Create New
                     </span>
                  </button>
               )} */}
               {!options.length && searchable && (
                  <div className='flex py-[7px] px-[9px] justify-center cursor-default'>
                     <span className='text-[14px] leading-[20px] text-lum-gray-400'>No Results</span>
                  </div>
               )}
            </div>
         )}
      </>
   );
};

export default OptionSelector;
