'use client';
import React, { useState } from 'react';
import Button from '../../../../common/components/button/Button';
import Tabs from '../../../../common/components/tabs/Tabs';
import ButtonTabPage from './(partials)/ButtonTabPage';
import DropdownTabPage from './(partials)/DropdownTabPage';
import InputTabPage from './(partials)/InputTabPage';
import ModalToastTabPage from './(partials)/ModalToastTabPage';
import OtherTabPage from './(partials)/OtherTabPage';
import SearchBarTabPage from './(partials)/SearchBarTabPage';

const tabs = [
   { name: 'Button' },
   { name: 'Input' },
   { name: 'Dropdown' },
   { name: 'SearchBar' },
   { name: 'Modal/Toast' },
   { name: 'Other' },
];

const tabsWithIcons = [
   { name: 'Button', iconName: 'Gear' },
   { name: 'Input', iconName: 'Target' },
   { name: 'Dropdown', iconName: 'Users' },
   { name: 'SearchBar', iconName: 'LeadSources' },
   { name: 'Modal/Toast', iconName: 'LeadSources' },
   { name: 'Other', iconName: 'Proposal' },
];

const BaseComponents = () => {
   const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
   const [showTabWithIcons, setShowTabWithIcons] = useState<boolean>(false);

   return (
      <div className='flex flex-col gap-4'>
         <div className='flex flex-row items-start gap-4'>
            {showTabWithIcons ? (
               <Tabs tabs={tabs} activeTabIndex={activeTabIndex} setActiveTabIndex={setActiveTabIndex} />
            ) : (
               <Tabs tabs={tabsWithIcons} activeTabIndex={activeTabIndex} setActiveTabIndex={setActiveTabIndex} />
            )}
            <Button onClick={() => setShowTabWithIcons(!showTabWithIcons)}>Toggle Tab Icons</Button>
         </div>
         {activeTabIndex === 0 && <ButtonTabPage />}
         {activeTabIndex === 1 && <InputTabPage />}
         {activeTabIndex === 2 && <DropdownTabPage />}
         {activeTabIndex === 3 && <SearchBarTabPage />}
         {activeTabIndex === 4 && <ModalToastTabPage />}
         {activeTabIndex === 5 && <OtherTabPage />}
      </div>
   );
};

export default BaseComponents;
