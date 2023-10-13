import { useEffect, useState } from 'react';

interface Size {
   windowWidth: number | undefined;
   windowHeight: number | undefined;
}

const useWindowSize = () => {
   const [windowSize, setWindowSize] = useState<Size>({
      windowWidth: undefined,
      windowHeight: undefined,
   });

   useEffect(() => {
      const handleResize = () => {
         setWindowSize({
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
         });
      };

      window.addEventListener('resize', handleResize);
      handleResize();
      // Remove event listener on cleanup
      return () => window.removeEventListener('resize', handleResize);
   }, []); // Empty array ensures that effect is only run on mount

   return windowSize;
};

export default useWindowSize;
