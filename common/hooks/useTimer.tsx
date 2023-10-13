import { useEffect, useState } from 'react';
import { formatSecondsAsTimer } from '../../utilities/helpers';

const useTimer = (startDate: string | Date = new Date()) => {
   const [timeDisplay, setTimeDisplay] = useState('');
   const [seconds, setSeconds] = useState<number>(0);

   // Get difference in seconds from provided date and set up interval to count by seconds
   useEffect(() => {
      const timeDiffInSeconds = Math.floor((new Date().getTime() - new Date(startDate).getTime()) / 1000);
      setSeconds(timeDiffInSeconds);
      const timer = setInterval(() => setSeconds((prevState) => prevState + 1), 1000);

      return () => clearInterval(timer);
   }, [startDate]);

   // take the given amount of seconds and update the timeDisplay using the format Utility function
   useEffect(() => {
      setTimeDisplay(formatSecondsAsTimer(seconds));
   }, [seconds]);

   return timeDisplay;
};

export default useTimer;
