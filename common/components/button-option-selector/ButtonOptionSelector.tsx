import { useRef, useState } from 'react';
import { getObjectProp } from '../../../utilities/helpers';
import Button, { ButtonColors, ButtonSizes } from '../button/Button';
import { IconColors } from '../Icon';
import OptionSelector from '../option-selector/OptionSelector';

type Props = {
   keyPath: string[];
   options: Array<any>;
   onOptionSelect: (e: any, arg: any) => void;
   color?: ButtonColors;
   size?: ButtonSizes;
   iconName?: string;
   iconColor?: IconColors;
   disabled?: boolean;
   searchable?: boolean;
   tooltipContent?: string | React.ReactNode;
   children?: React.ReactNode;
};

const ButtonOptionSelector = ({
   keyPath,
   options,
   onOptionSelect,
   color,
   size,
   iconName,
   iconColor,
   disabled,
   searchable,
   tooltipContent,
   children,
}: Props) => {
   const buttonRef = useRef<any>();
   const [showOptions, setShowOptions] = useState<boolean>(false);
   const [optionSearchVal, setOptionSearchVal] = useState<string>('');

   const optionSearchResults = options.filter((option: any) => {
      return getObjectProp(option, keyPath)?.toLowerCase().includes(optionSearchVal?.toLowerCase());
   });

   return (
      <div className={'relative block'}>
         <Button
            ref={buttonRef}
            color={color || 'light'}
            size={size || 'sm'}
            iconName={iconName}
            iconColor={iconColor}
            disabled={disabled}
            tooltipContent={tooltipContent}
            onClick={() => {
               !disabled && setShowOptions(!showOptions);
            }}>
            {children}
         </Button>
         <OptionSelector
            options={searchable ? optionSearchResults : options}
            textKeyPath={keyPath}
            onOptionSelect={(e: any, option: any) => {
               searchable && setOptionSearchVal('');
               onOptionSelect(e, option);
            }}
            showOptions={showOptions}
            setShowOptions={setShowOptions}
            siblingRef={buttonRef}
            searchable={searchable}
            searchConfig={{
               placeholder: 'Search',
               searchValue: optionSearchVal,
               handleChange: (e: any) => {
                  setOptionSearchVal(e.target.value);
               },
            }}
            autoFocus={false}
         />
      </div>
   );
};

export default ButtonOptionSelector;
