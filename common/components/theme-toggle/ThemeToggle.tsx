'use client';
import { useEffect, useState } from 'react';
import Icon from '../Icon';

const ThemeToggle = () => {
   const [isLightTheme, setIsLightTheme] = useState<boolean>(false);

   useEffect(() => {
      if (localStorage.theme && localStorage.theme === 'light') {
         setIsLightTheme(true);
      } else {
         setIsLightTheme(false);
      }
   }, []);

   const handleSetTheme = (theme: 'light' | 'dark') => {
      if (theme === 'dark') {
         document.documentElement.classList.remove('light');
         document.documentElement.classList.add('dark');
         setIsLightTheme(false);
      } else {
         document.documentElement.classList.remove('dark');
         document.documentElement.classList.add('light');
         setIsLightTheme(true);
      }
      localStorage.theme = theme;
   };

   return (
      <div className='rounded p-[1px] flex h-[36px] w-full my-[20px] bg-lum-gray-700'>
         <button
            className={`flex justify-center items-center w-2/4 rounded ${isLightTheme ? 'bg-lum-blue-500' : ''}`}
            onClick={() => handleSetTheme('light')}>
            <Icon
               name={'Sun'}
               width={16}
               height={16}
               className={`${isLightTheme ? 'fill-lum-white' : 'fill-[#7E8F9C]'}`}
            />
            <span className={`pl-[3px] ${isLightTheme ? 'text-lum-white' : 'text-lum-gray-400'}`}>Light</span>
         </button>
         <button
            className={`flex justify-center items-center w-2/4 rounded ${isLightTheme ? '' : 'bg-lum-blue-500'}`}
            onClick={() => handleSetTheme('dark')}>
            <Icon
               name={'Moon'}
               width={16}
               height={16}
               className={`${isLightTheme ? 'fill-[#7E8F9C]' : 'fill-lum-white'}`}
            />
            <span className={`pl-[3px] ${isLightTheme ? 'text-lum-gray-400' : 'text-lum-white'}`}>Dark</span>
         </button>
      </div>
   );
};

export default ThemeToggle;
