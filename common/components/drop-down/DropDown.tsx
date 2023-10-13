import { ComponentProps, ReactNode, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { getObjectProp } from '../../../utilities/helpers';
import Icon from '../Icon';
import OptionSelector from '../option-selector/OptionSelector';

type IconProps = ComponentProps<typeof Icon>;

type Props = {
   label?: string;
   placeholder?: string; // defaults to this when there is no selected values
   placeHolderStyles?: string;
   selectedValues: Array<any>; // selected object(s) of options
   keyPath?: string[]; // optional, since options can be an array of strings

   // this is for easy configuration when options & selectedValues have different keyPaths
   // check out creating an order for reference `marketing/leads` --> `Orders` partial
   selectedValueKeyPath?: string[];
   options: Array<any>;
   onOptionSelect: (e: any, arg: any) => void;
   multiSelect?: boolean;
   required?: boolean;
   className?: string;
   description?: string;
   errorMessage?: string;
   name?: string;
   onBlur?: (e: any) => void;
   disabled?: boolean;
   searchable?: boolean;
   iconConfig?: IconProps;
   placeholderTag?: ReactNode;
};

const DropDown = ({
   label,
   placeholder,
   placeHolderStyles,
   placeholderTag,
   selectedValues,
   keyPath,
   selectedValueKeyPath,
   options,
   onOptionSelect,
   multiSelect,
   required,
   className,
   description,
   errorMessage,
   onBlur,
   name,
   disabled,
   searchable,
   iconConfig,
   ...rest
}: Props) => {
   const containerRef = useRef<any>(); // This ref is used inside the OptionSelector component to determine if the user clicks on the DropDown component container or outside the container
   const [showOptions, setShowOptions] = useState<boolean>(false);
   const [dropdownSearchVal, setDropdownSearchVal] = useState<string>('');

   const labelHtmlFor = label ? label.replace(' ', '-').toLowerCase() : '';

   const keyPathToUse = selectedValueKeyPath ? selectedValueKeyPath : keyPath;
   const selectedValuesString = selectedValues
      .map((sValue: any) => {
         if (!keyPathToUse) return sValue; // if no keyPath, treat selectedValues as an array of strings
         return getObjectProp(sValue, keyPathToUse);
      })
      .join(', ');

   // create a filtered array for the searchResults
   const dropdownSearchResults = [...options].filter((option: any) => {
      if (!keyPath) return option?.toLowerCase().includes(dropdownSearchVal?.toLowerCase()); // if no keyPath, treat options as an array of strings
      return getObjectProp(option, keyPath)?.toLowerCase().includes(dropdownSearchVal?.toLowerCase());
   });

   const handleKeyPress = (e: any) => {
      switch (e.key) {
         case ' ':
            setShowOptions(!showOptions);
            break;
         case 'Tab':
            setShowOptions(false);
            break;
         default:
            break;
      }
   };

   return (
      <label
         className={`
            relative block
            ${className ? className : ''}
         `}
         htmlFor={labelHtmlFor}>
         {label && (
            <span className='text-[12px] leading-[20px] text-lum-gray-500 dark:text-lum-gray-300'>
               {label}
               {required && <span className='pl-[3px]'>*</span>}
            </span>
         )}
         <div ref={containerRef}>
            <div
               tabIndex={0}
               className={`
               min-h-[40px] max-h-[40px] flex items-center rounder-md
               ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
               onClick={() => {
                  !disabled && setShowOptions(!showOptions);
               }}
               onKeyDown={(e: any) => {
                  handleKeyPress(e);
               }}>
               <div
                  className={twMerge(`
                     min-h-[40px] w-full pl-[10px] pr-[30px] flex items-center rounded border-[1px] border-solid
                     bg-lum-gray-50 dark:bg-lum-gray-700
                     ${errorMessage
                        ? 'border-[1px] border-solid border-lum-red-500'
                        : 'border-lum-gray-100 dark:border-lum-gray-600'
                     }
                     ${!disabled
                        ? 'hover:bg-lum-gray-100 active:bg-lum-gray-150 dark:hover:bg-lum-gray-750 dark:active:bg-lum-gray-800'
                        : 'focus-visible:outline-none opacity-70'
                     }
                     ${selectedValues.length && !disabled
                        ? 'text-lum-gray-600 dark:text-lum-white'
                        : 'text-lum-gray-400'
                     }
                     ${placeHolderStyles ? placeHolderStyles : ''}
                  `)}
                  {...rest}>
                  {!multiSelect && !!selectedValues.length && !!selectedValues[0]?.iconConfig && (
                     <span className='mr-[10px]'>
                        <Icon
                           name={selectedValues[0].iconConfig.name}
                           color={selectedValues[0].iconConfig.color}
                           height='20'
                           width='20'
                        />
                     </span>
                  )}
                  {iconConfig && (
                     <Icon
                        name={iconConfig.name}
                        color={iconConfig.color}
                        height='20'
                        width='20'
                        style={{ position: 'absolute', left: '15px' }}
                     />
                  )}
                  {selectedValues.length ? selectedValuesString : placeholder}
                  {placeholderTag && placeholderTag}
               </div>
               <Icon
                  className={`absolute right-[10px] fill-none h-[9px] stroke-lum-gray-400 stroke-2 ${
                     showOptions && 'rotate-180'
                  }`}
                  name={'ChevronDown'}
                  width='12'
                  height='10'
               />
            </div>
         </div>
         {/* {description && <div className='dark:text-lum-gray-200 text-[10px] mt-[6px]'>{description}</div>} */}
         <OptionSelector
            options={searchable ? dropdownSearchResults : options}
            textKeyPath={keyPath ? keyPath : undefined}
            onOptionSelect={(e: any, option: any) => {
               onOptionSelect(e, option);
            }}
            showOptions={showOptions}
            setShowOptions={setShowOptions}
            selectedValues={selectedValues}
            multiSelect={multiSelect}
            siblingRef={containerRef}
            onBlur={(e: any) => {
               if (onBlur) {
                  if (name) e.target.name = name;
                  onBlur(e);
               }
            }}
            searchable={searchable}
            searchConfig={{
               placeholder: 'Search',
               searchValue: dropdownSearchVal,
               handleChange: (e: any) => {
                  setDropdownSearchVal(e.target.value);
               },
            }}
         />

         {/* Error message handling */}
         {errorMessage && (
            <div className='flex pt-[6px]'>
               <Icon
                  className='min-w-[11px] min-h-[11px] fill-lum-red-500'
                  name='Warning'
                  height='11'
                  width='11'
                  viewBox='0 0 16 16'
               />
               <span className='mt-[-3px] pl-[6px] text-[11px] leading-[14px] text-lum-gray-600 dark:text-lum-gray-300'>
                  {errorMessage}
               </span>
            </div>
         )}
      </label>
   );
};

export default DropDown;
