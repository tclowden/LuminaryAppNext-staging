type Props = {
   count: number;
};
const Badge = ({ count }: Props) => {
   return (
      <div className='flex justify-center items-center h-[15px] px-[6px] rounded-full bg-lum-red-500'>
         <span className='text-lum-white text-[12px]'>{count}</span>
      </div>
   );
};

export default Badge;
