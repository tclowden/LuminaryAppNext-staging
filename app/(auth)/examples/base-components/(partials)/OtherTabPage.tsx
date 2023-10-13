import { useState } from 'react';
import Checkbox from '../../../../../common/components/checkbox/Checkbox';
import Chip from '../../../../../common/components/chip/Chip';
import Explainer from '../../../../../common/components/explainer/Explainer';
import Icon from '../../../../../common/components/Icon';
import Radio from '../../../../../common/components/radio/Radio';
import Tabs from '../../../../../common/components/tabs/Tabs';
import Panel from '../../../../../common/components/panel/Panel';

const tabs = [{ name: 'Tab 1' }, { name: 'Tab 2' }, { name: 'Tab 3' }, { name: 'Tab 4' }];

const tabsWithIcons = [
   { name: 'Tab 1', iconName: 'Gear' },
   { name: 'Tab 2', iconName: 'Target' },
   { name: 'Tab 3', iconName: 'Users' },
   { name: 'Tab 4', iconName: 'LeadSources' },
];

const userEmailTypesData = {
   saleAnnouncements: false,
   promotions: true,
};

const userEmailFrequencyOptions = ['Daily', 'Weekly', 'Monthly'];

const users = [
   { id: 1, name: 'Buster Bluth' },
   { id: 2, name: 'George Michael' },
   { id: 3, name: 'Gob Bluth' },
   { id: 4, name: 'Tobias Fünke' },
   { id: 5, name: 'Lucille Bluth' },
   { id: 6, name: 'Lindsay Fünke' },
];

const OtherTabPage = () => {
   const [userEmailTypes, setUserEmailTypes] = useState<Object>(userEmailTypesData);
   const [userEmailFrequencySelection, setUserEmailFrequencySelection] = useState<Object>('Daily');
   const [userChips, setUserChips] = useState<{ id: number | string; name: string }[]>(users);
   const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

   const handleCheckBox = (keyName: any) => {
      const updatedSettings = {
         ...userEmailTypes,
         [keyName]: !userEmailTypes[keyName as keyof Object],
      };
      setUserEmailTypes(updatedSettings);
   };

   const handleRadioToggle = (option: any) => {
      setUserEmailFrequencySelection(option);
   };

   const handleRemoveChip = (e: any, value: string | number) => {
      const filteredChips = userChips.filter((userChip) => userChip.name !== value);
      setUserChips([...filteredChips]);
   };

   return (
      <>
         <Panel title='Checkboxes' collapsible>
            <div className='grid grid-cols-1 gap-[15px]'>
               {Object.keys(userEmailTypes).map((keyName, index) => (
                  <Checkbox
                     key={index}
                     checked={!!userEmailTypes[keyName as keyof Object]}
                     onChange={() => handleCheckBox(keyName)}>
                     {keyName}
                  </Checkbox>
               ))}
               <div className='rounded bg-lum-gray-100 dark:bg-lum-gray-700 p-4 whitespace-pre text-lum-pink-600'>
                  {`CheckboxProps = {\n   className?: string; // For additional styling. Useful in the case of putting checkboxes in a dropdown\n}`}
               </div>
            </div>
         </Panel>
         <Panel title='Radios' collapsible>
            <div className='grid grid-cols-1 gap-[15px]'>
               {userEmailFrequencyOptions.map((option, index) => (
                  <Radio
                     key={index}
                     checked={option === userEmailFrequencySelection}
                     name='email frequency'
                     label={option}
                     value={option}
                     onChange={() => handleRadioToggle(option)}
                  />
               ))}
               <div className='rounded bg-lum-gray-100 dark:bg-lum-gray-700 p-4 whitespace-pre text-lum-pink-600'>
                  {`Takes no additional props`}
               </div>
            </div>
         </Panel>
         <Panel title='Chips' collapsible>
            <div className='flex flex-col gap-4'>
               <div className='flex flex-wrap gap-[15px]'>
                  {userChips.map((chip) => (
                     <Chip key={chip.id} value={chip.name} onClick={handleRemoveChip} />
                  ))}
               </div>
               <div className='rounded bg-lum-gray-100 dark:bg-lum-gray-700 p-4 whitespace-pre text-lum-pink-600'>
                  {`type ChipProps = {\n   value: string | number;\n   onClick: (value: string | number) => void;\n}`}
               </div>
            </div>
         </Panel>
         <Panel title='Tabs' collapsible>
            <div className='flex flex-col gap-[15px]'>
               <Tabs tabs={tabs} activeTabIndex={activeTabIndex} setActiveTabIndex={setActiveTabIndex} />
               <Tabs tabs={tabsWithIcons} activeTabIndex={activeTabIndex} setActiveTabIndex={setActiveTabIndex} />
               <Tabs
                  tabs={tabs}
                  activeTabIndex={activeTabIndex}
                  setActiveTabIndex={setActiveTabIndex}
                  theme='secondary'
               />

               <div className='rounded bg-lum-gray-100 dark:bg-lum-gray-700 p-4 whitespace-pre text-lum-pink-600'>
                  {`type TabsProps = {\n   tabs: { name: string; iconName?: string }[];\n   activeTabIndex: number;\n   setActiveTabIndex: (index: number) => void;\n}`}
               </div>
            </div>
         </Panel>
         <Panel title='Icon' collapsible>
            <div className='grid grid-cols-1 gap-[15px]'>
               <Icon name='Warning' color='blue' height='60' width='60' viewBox='0 0 16 16' />
               <span>This warning icon was produced with this example code:</span>
               <div className='rounded bg-lum-gray-100 dark:bg-lum-gray-700 p-4 whitespace-pre text-lum-pink-600'>
                  {`<Icon name='Warning' color='blue' height='60' width='60' viewBox='0 0 16 16' />`}
               </div>
               <div className='rounded bg-lum-gray-100 dark:bg-lum-gray-700 p-4 whitespace-pre text-lum-pink-600'>
                  {`type IconProps {\n   name: string;\n   color?: 'blue' | 'cyan' | 'green' | 'yellow' | 'orange' | 'red' | 'pink' | 'purple' | 'gray' | 'white' | 'black';\n}`}
               </div>
            </div>
         </Panel>
         <Panel title='Container (title)' collapsible>
            <div className='flex flex-col gap-[15px]'>
               All Container children will go here.
               <div className='rounded bg-lum-gray-100 dark:bg-lum-gray-700 p-4 whitespace-pre text-lum-pink-600'>
                  {`type ContainerProps = {\n   title?: string;\n   titleSize?: 'lg';\n   titleIconName?: string;\n   titleIconColor?: | 'blue' | 'cyan' | 'green' | 'yellow' | 'orange' | 'red' | 'pink' | 'purple' | 'gray' | 'white' | 'black';\n   titleImageSource?: string; // Image will take priority if BOTH titleImageSource and titleIconName are passed in\n   collapsible?: boolean;\n   isCollapsed?: boolean;\n   children: React.ReactNode;\n}`}
               </div>
            </div>
         </Panel>
         <Explainer
            title='This is an Explainer (title)'
            description={'Explainer description will go here (description)'}>
            <div className='flex flex-col gap-4'>
               <span>• `title` prop is displayed above. Can also display a title icon with `titleIconName` prop</span>
               <span>• `Description` prop is displayed to the right. Icon can be changed with `iconName` prop</span>
               <div className='rounded bg-lum-gray-100 dark:bg-lum-gray-700 p-4 whitespace-pre text-lum-pink-600'>
                  {`type ExplainerProps = {\n   children: React.ReactNode;\n   title?: string;\n   titleIconName?: string;\n   description: string;\n   iconName?: string;\n}`}
               </div>
            </div>
         </Explainer>
      </>
   );
};

export default OtherTabPage;
