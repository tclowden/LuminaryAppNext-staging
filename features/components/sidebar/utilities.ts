export const convertValueToHoursMinutesSeconds = (value: number): string => {
   const totalSeconds = Math.floor(value / 1000);
   const hours = Math.floor(totalSeconds / 3600);
   const minutes = Math.floor((totalSeconds % 3600) / 60);

   const formattedHours = hours.toString().padStart(2, '0');
   const formattedMinutes = minutes.toString().padStart(2, '0');

   return `${formattedHours}:${formattedMinutes}`;
};

export const getCustomNumberValueOutput = (value: number): string => {
   let convertedValue = value + '';
   if (value > 1000) return Math.floor(value / 1000) + 'k';
   else return convertedValue;
};

export const calculateProgressPercent = (value: number, goal: number): number => {
   if (value > goal) return 100;
   return Math.floor((value / goal) * 100);
};
