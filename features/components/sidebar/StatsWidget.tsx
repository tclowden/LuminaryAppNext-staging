type Stat = {
   value: number;
   type: string; // number, time, percent
   goal: number;
   color: string;
   title: string;
};
type StatsWidgetProps = {
   stats: Stat[];
};
const StatsWidget = ({ stats }: StatsWidgetProps) => {
   const convertValueToHoursMinutesSeconds = (value: number): string => {
      return new Date(value * 1000).toISOString().substring(14, 19);
   };
   const getCustomNumberValueOutput = (value: number): JSX.Element => {
      let convertedValue = value + '';
      if (value > 1000) {
         return (
            <>
               {`${Math.floor(value / 1000)}`}
               <span className='text-lum-gray-350'>k</span>
            </>
         );
      }
      return <>{convertedValue}</>;
   };
   const calculateProgressPercent = (value: number, goal: number): number => {
      if (value > goal) return 100;
      return Math.floor((value / goal) * 100);
   };

   return (
      <div className='grid gap-[10px] grid-cols-2 my-[20px]'>
         {stats.map((stat: Stat, index) => (
            <div
               key={index}
               className='flex flex-col justify-center items-center px-[8px] pt-[9px] rounded bg-lum-gray-700 '>
               <span className='text-lum-white text-[20px] pb-[9px]'>
                  {stat.type === 'number' && <>{getCustomNumberValueOutput(stat.value)}</>}
                  {stat.type === 'time' && <>{convertValueToHoursMinutesSeconds(stat.value)}</>}
                  {stat.type === 'percent' && <>{Math.floor(stat.value * 100)}%</>}
               </span>
               <div className='w-full rounded-full h-[3px] bg-lum-black'>
                  <div
                     className={`h-full rounded-full ${stat.color || 'bg-lum-blue-500'}`}
                     style={{ width: `${calculateProgressPercent(stat.value, stat.goal)}%` }}></div>
               </div>
               <span className='text-lum-gray-350 text-[10px]'>{stat.title}</span>
            </div>
         ))}
      </div>
   );
};

export default StatsWidget;
