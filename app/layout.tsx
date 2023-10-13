'use client';
import './globals.css';
import { Outfit } from 'next/font/google';
import StoreProvider from '../providers/StoreProvider';
import TippyProvider from '../providers/TippyProvider';
import { useEffect, useState } from 'react';
import ToastProvider from '../providers/ToastProvider';
import Script from 'next/script';
import TwilioProvider from '@/providers/TwilioProvider';
import AblyProvider from '@/providers/AblyProvider';

const outfit = Outfit({
   subsets: ['latin'],
   display: 'swap',
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
   const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

   // Set light/dark theme on load
   useEffect(() => {
      if (
         localStorage.theme === 'dark' ||
         (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
         setIsDarkTheme(true);
         document.documentElement.classList.remove('light');
         document.documentElement.classList.add('dark');
      } else {
         setIsDarkTheme(false);
         document.documentElement.classList.remove('dark');
         document.documentElement.classList.add('light');
      }
   }, []);

   return (
      <html lang='en' className={outfit.className}>
         <head>
            {true ? (
               <link rel='icon' href='/favicon-dark-theme.png' />
            ) : (
               <link rel='icon' href='/favicon-light-theme.png' />
            )}
            <title>Luminary App</title>
            <Script
               strategy='lazyOnload'
               onLoad={() => {
                  //    console.log('script has loaded');
               }}
               src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`}
            />
         </head>
         <body>
            <StoreProvider>
               <AblyProvider>
                  <TwilioProvider>
                     <TippyProvider>
                        <ToastProvider>
                           <div className='bg-lum-gray-100 text-lum-gray-700 dark:bg-lum-gray-800 dark:text-lum-white'>
                              {children}
                           </div>
                        </ToastProvider>
                     </TippyProvider>
                  </TwilioProvider>
               </AblyProvider>
            </StoreProvider>
         </body>
      </html>
   );
};

export default RootLayout;
