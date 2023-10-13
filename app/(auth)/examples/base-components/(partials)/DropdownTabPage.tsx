import { useState } from 'react';
import DropDown from '../../../../../common/components/drop-down/DropDown';
import Panel from '../../../../../common/components/panel/Panel';

const dropDownOptions: Array<any> = [
   {
      id: 1,
      value: 'Option 1',
   },
   {
      id: 2,
      value: 'Option 2',
   },
   {
      id: 3,
      value: 'Option 3',
   },
];
const iconDropDownOptions: Array<any> = [
   {
      id: 1,
      value: 'HVAC',
      iconConfig: { name: 'AcUnit', color: 'cyan' },
   },
   {
      id: 2,
      value: 'Solar',
      iconConfig: { name: 'SolarPanel', color: 'orange' },
   },
   {
      id: 3,
      value: 'Smart Thermostat',
      iconConfig: { name: 'Dashboard', color: 'green' },
   },
   {
      id: 4,
      value: 'Has no Icon',
   },
];
const multiDropDownOptions: Array<any> = [
   {
      id: 11,
      value: 'Option 1',
   },
   {
      id: 22,
      value: 'Option 2',
   },
   {
      id: 33,
      value: 'Option 3',
   },
   {
      id: 44,
      value: 'Option 4',
   },
   {
      id: 55,
      value: 'Option 5',
   },
   {
      id: 66,
      value: 'Option 6',
   },
];

const DropdownTabPage = () => {
   const [selectedValues, setSelectedValues] = useState<any[]>([]);
   const [iconSelectedValues, setIconSelectedValues] = useState<any[]>([]);
   const [multiSelectedValues, setMultiSelectedValues] = useState<any[]>([]);

   const handleSingleSelectDropDown = (e: any, option: any) => {
      setSelectedValues([option]);
   };
   const handleSingleIconSelectDropDown = (e: any, option: any) => {
      setIconSelectedValues([option]);
   };
   const handleMultiSelectDropDown = (e: any, option: any) => {
      const hasOptionAlready = !!multiSelectedValues.find((item) => item.id === option.id);
      const filteredValues = multiSelectedValues.filter((item) => item.id !== option.id);
      setMultiSelectedValues(hasOptionAlready ? filteredValues : [...filteredValues, option]);
   };
   return (
      <Panel title={'DropDowns'}>
         <div className='flex flex-col gap-[20px]'>
            <span>
               <DropDown
                  label='Drop Down'
                  selectedValues={selectedValues}
                  keyPath={['value']}
                  options={dropDownOptions}
                  onOptionSelect={handleSingleSelectDropDown}
                  placeholder='Select'
                  required
               />
            </span>
            <span>
               <DropDown
                  label='Drop Down with Icons'
                  selectedValues={iconSelectedValues}
                  keyPath={['value']}
                  options={iconDropDownOptions}
                  onOptionSelect={handleSingleIconSelectDropDown}
                  placeholder='Select Option with Icon'
               />
            </span>
            <span>
               <DropDown
                  label='Multi-Select Drop Down'
                  selectedValues={multiSelectedValues}
                  keyPath={['value']}
                  options={multiDropDownOptions}
                  onOptionSelect={handleMultiSelectDropDown}
                  placeholder='Select Multiple'
                  multiSelect
               />
            </span>
            <div className='rounded bg-lum-gray-100 dark:bg-lum-gray-700 p-4 whitespace-pre text-lum-pink-600'>
               {`type DropDownProps = {\n    label?: string;\n    placeholder?: string;\n    selectedValues: Array<any>;\n    keyPath: string;\n    options: Array<any>;\n    selectOption: (arg: any) => void;\n    multiSelect?: boolean;\n    isRequired?: boolean;\n};`}
            </div>
         </div>
      </Panel>
   );
};

export default DropdownTabPage;
