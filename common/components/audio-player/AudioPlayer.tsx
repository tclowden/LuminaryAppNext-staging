import { useEffect, useRef, useState } from 'react';
import Button from '../button/Button';

type Props = {
   source: string;
};

const AudioPlayer = ({ source, ...rest }: Props & React.AudioHTMLAttributes<HTMLAudioElement>) => {
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [currentTime, setCurrentTime] = useState<number>(0);
   const audioRef = useRef<any>(new Audio(source));
   const intervalRef = useRef<any>();
   const isReady = useRef(false);

   const { duration } = audioRef.current;
   const currentPercentage = duration ? `${(currentTime / Math.ceil(duration)) * 100}%` : '0%';
   const trackStyling = `
      -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #05D1FA), color-stop(${currentPercentage}, #777))
   `;
   const startTimer = () => {
      // Clear any timers already running
      clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
         if (audioRef.current.ended) {
            setIsPlaying(false);
            setCurrentTime(Math.ceil);
         } else {
            setCurrentTime(audioRef.current.currentTime);
         }
      }, 500);
   };

   const onScrub = (value: number) => {
      // Clear any timers already running
      clearInterval(intervalRef.current);
      audioRef.current.currentTime = value;
      setCurrentTime(audioRef.current.currentTime);
   };

   const onScrubEnd = () => {
      // If not already playing, start
      if (!isPlaying) {
         setIsPlaying(true);
      }
      startTimer();
   };

   useEffect(() => {
      if (isPlaying) {
         audioRef.current.play();
         startTimer();
      } else {
         audioRef.current.pause();
      }
   }, [isPlaying]);

   const handlePlayPause = () => {
      if (isPlaying) {
         audioRef.current.pause();
         setIsPlaying(false);
      } else {
         audioRef.current.play();
         setIsPlaying(true);
      }
   };

   useEffect(() => {
      audioRef.current.pause();

      audioRef.current = new Audio(source);
      setCurrentTime(audioRef.current.currentTime);

      if (isReady.current) {
         audioRef.current.play();
         setIsPlaying(true);
         startTimer();
      } else {
         // Set the isReady ref as true for the next pass
         isReady.current = true;
      }
   }, []);

   useEffect(() => {
      // Pause and clean up on unmount
      return () => {
         audioRef.current.pause();
         clearInterval(intervalRef.current);
      };
   }, []);

   return (
      <div className={`w-full flex items-center gap-2`}>
         <Button iconName={isPlaying ? 'Pause' : 'Play'} color='transparent' onClick={handlePlayPause} />
         {/* <audio controls src={source} /> */}
         <input
            type='range'
            value={currentTime}
            step='.3'
            min='0'
            max={duration ? Math.ceil(duration) : `${Math.ceil(duration)}`}
            className='progress'
            onChange={(e: any) => onScrub(e.target.value)}
            onMouseUp={onScrubEnd}
            onKeyUp={onScrubEnd}
            style={{ background: trackStyling }}
         />
         <Button iconName={'Kebab'} color='transparent' onClick={handlePlayPause} />
      </div>
   );
};

export default AudioPlayer;
