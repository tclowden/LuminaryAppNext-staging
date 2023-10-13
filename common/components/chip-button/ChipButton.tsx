'use client';
import React, { useRef, useState } from 'react';
import { ButtonColors } from '../button/Button';
import Chip from '../chip/Chip';
import OptionSelector from '../option-selector/OptionSelector';

interface SearchConfig {
   placeholder?: string;
   searchValue: string;
   handleChange: (e: any) => void;
}

interface Props {
   options: Array<any>;
   textKeyPath: Array<string>;
   onOptionSelect: (e: any, option: any) => void;
   selectedValues?: Array<any>;
   multiSelect?: boolean;
   chipBtnText: string;
   onChipBtnClick?: (e: any) => void;
   searchable?: boolean;
   searchConfig?: SearchConfig;
   color?: ButtonColors;
}

const ChipButton = ({
   options,
   textKeyPath,
   onOptionSelect,
   selectedValues,
   multiSelect,
   chipBtnText,
   onChipBtnClick,
   searchable,
   searchConfig,
   ...rest
}: Props) => {
   const btnChipRef = useRef();
   const [showOptions, setShowOptions] = useState<boolean>(false);

   const handleClick = (e: any) => {
      setShowOptions((prevState: boolean) => !prevState);
      onChipBtnClick && onChipBtnClick(e);
   };

   return (
      <span className='relative'>
         <Chip ref={btnChipRef} value={chipBtnText} removable={false} onClick={handleClick} {...rest} />
         <OptionSelector
            options={options}
            textKeyPath={textKeyPath}
            onOptionSelect={onOptionSelect}
            showOptions={showOptions}
            setShowOptions={setShowOptions}
            selectedValues={selectedValues}
            multiSelect={multiSelect}
            siblingRef={btnChipRef}
            autoFocus={false}
            searchable={searchable}
            searchConfig={searchConfig}
         />
      </span>
   );
};

export default ChipButton;
