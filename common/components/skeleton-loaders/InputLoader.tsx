type Props = {
   count?: number;
};

const InputLoader = ({ count = 1 }: Props) => {
   return (
      <>
         {Array.from({ length: count }).map((sup: any, i: number) => {
            return (
               <div key={i}>
                  <div className='min-h-[12px] max-h-[12px] max-w-[30%] mb-[3px] rounded-sm bg-lum-gray-100 dark:bg-lum-gray-700 animate-pulse'></div>
                  <div className='min-h-[40px] max-h-[40px] rounded bg-lum-gray-100 dark:bg-lum-gray-700 animate-pulse'></div>
               </div>
            );
         })}
      </>
   );
};

export default InputLoader;
