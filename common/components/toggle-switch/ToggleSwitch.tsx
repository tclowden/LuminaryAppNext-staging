import { useRef } from 'react';
import Icon from '../Icon';

type Props = {
   checked: boolean;
   textOptions?: 'on/off' | 'yes/no' | 'default';
   label?: string;
   onChange?: (e: any) => void;
   errorMessage?: string;
   disabled?: boolean;
};

const ToggleSwitch = ({
   checked,
   textOptions = 'default',
   onChange,
   label,
   errorMessage,
   disabled,
   ...rest // input props
}: React.InputHTMLAttributes<HTMLInputElement> & Props) => {
   const inputRef = useRef<any>();
   const displayTextOptions: { isChecked: string | JSX.Element; notChecked: string } = {
      isChecked: '',
      notChecked: '',
   };
   const textOptionStyles: { isChecked: string; notChecked: string } = {
      isChecked: '',
      notChecked: '',
   };
   switch (textOptions) {
      case 'on/off':
         displayTextOptions['isChecked'] = 'ON';
         textOptionStyles['isChecked'] = '12px';
         displayTextOptions['notChecked'] = 'OFF';
         textOptionStyles['notChecked'] = '10px';
         break;
      case 'yes/no':
         displayTextOptions['isChecked'] = 'YES';
         textOptionStyles['isChecked'] = '10px';
         displayTextOptions['notChecked'] = 'NO';
         textOptionStyles['notChecked'] = '12px';
         break;
      default:
         displayTextOptions['isChecked'] = <Icon name='CheckMark' height='9' color='white' />;
         textOptionStyles['isChecked'] = '15px';
         break;
   }

   const handleKeyPress = (e: any) => {
      switch (e.key) {
         case ' ':
            e.preventDefault();
            inputRef.current?.click();
            break;
         case 'Enter':
            e.preventDefault();
            inputRef.current?.click();
            break;
         default:
            break;
      }
   };

   return (
      <label className={`relative block`}>
         {label && <span className='text-[12px] text-lum-gray-500 dark:text-lum-gray-300'>{label}</span>}
         <div className='flex'>
            <div
               tabIndex={0}
               onKeyDown={(e: any) => {
                  handleKeyPress(e);
               }}
               className={`
               relative h-[24px] min-w-[56px] rounded-full cursor-pointer transition-[background-color] duration-200
               ${checked ? 'bg-lum-green-500' : 'bg-lum-gray-100 dark:bg-lum-gray-650'}
               ${disabled ? 'opacity-50' : ''}
            `}>
               <span
                  className={`absolute text-[10px] select-none ${checked ? 'text-lum-white' : 'text-lum-gray-400'}`}
                  style={{
                     top: '50%',
                     transform: 'translateY(-50%)',
                     left: checked ? textOptionStyles.isChecked : 'auto',
                     right: !checked ? textOptionStyles.notChecked : 'auto',
                  }}>
                  {checked ? displayTextOptions.isChecked : displayTextOptions.notChecked}
               </span>
               <span
                  className={`
                  absolute w-[20px] h-[20px] bottom-[2px] rounded-full transition-[left] duration-200
                  ${checked ? 'bg-lum-white' : 'bg-lum-white dark:bg-lum-gray-450'}
               `}
                  style={{ left: checked ? 'calc(100% - 22px)' : '2px' }}></span>
            </div>
         </div>
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
         <input
            ref={inputRef}
            type={'checkbox'}
            name={rest.name}
            className={'hidden'}
            onChange={(e: any) => {
               if (disabled) return;
               onChange && onChange(e);
            }}
            checked={checked}
         />
      </label>
   );
};

export default ToggleSwitch;
