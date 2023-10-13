import { useEffect, useRef } from 'react';

const useDebounce = (callback: (args: any) => void, deps: Array<any>, delay: number) => {
   useEffect(() => {
      const handler = setTimeout(() => callback(''), delay);
      return () => clearTimeout(handler);
   }, [...(deps || []), delay]);
};

export default useDebounce;
