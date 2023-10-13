import { useRef, useState } from 'react';
import OptionSelector from '../option-selector/OptionSelector';
import Input from '../input/Input';

type Props = {
   label?: string;
   placeholder?: string;
   searchValue: string;
   handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
   handleBlur?: (e: any) => void;
   searchResults: any[];
   onSelectSearchResult: (e: any, result: any) => void;
   keyPath: string[];
   border?: boolean;
   disabled?: boolean;
   shadow?: boolean;
   name?: string;
   defaultShowOptions?: boolean;
   listContainerMaxHeight?: number;
   errorMessage?: string;
   required?: boolean;
   isLoading?: boolean;
};

const SearchBar = ({
   label,
   placeholder,
   searchValue,
   handleChange,
   handleBlur,
   searchResults,
   onSelectSearchResult,
   errorMessage,
   border = true,
   shadow = false,
   disabled,
   keyPath,
   name,
   defaultShowOptions = false,
   listContainerMaxHeight = 400,
   required,
   isLoading,
   ...rest
}: Props) => {
   const searchBarRef = useRef();
   const [showOptions, setShowOptions] = useState<boolean>(false);

   // This function will invoke the passed in callback when an option is selected, but it will also set the options to hide.
   const handleSelectSearchResult = (e: any, result: any) => {
      onSelectSearchResult(e, result);
      setShowOptions(false);
   };
   return (
      <div className='relative'>
         <Input
            disabled={disabled}
            ref={searchBarRef}
            label={label}
            iconName='MagnifyingGlass'
            placeholder={placeholder}
            value={searchValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={() => setShowOptions(true)}
            border={border}
            shadow={shadow}
            name={name}
            errorMessage={errorMessage}
            required={required}
            {...rest}
         />
         {isLoading && (
            <div className='absolute text-[14px] text-lum-gray-600 dark:text-lum-gray-300 w-full animate-pulse'>
               Searching...
            </div>
         )}
         <OptionSelector
            maxHeight={listContainerMaxHeight}
            options={searchResults}
            textKeyPath={keyPath}
            onOptionSelect={handleSelectSearchResult}
            showOptions={defaultShowOptions || !!(searchValue.length > 0 && searchResults.length && showOptions)} // Show only if searchValue has at least one character and there are at least one searchResult
            setShowOptions={(bool: boolean) => {
               setShowOptions(bool);
            }}
            siblingRef={searchBarRef}
            autoFocus={false}
         />
      </div>
   );
};

export default SearchBar;
