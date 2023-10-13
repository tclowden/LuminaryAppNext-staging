type Props = {
   score: number;
};

const ReputationBadge = ({ score }: Props) => {
   if (!score) return <span className='text-lum-gray-300'>N/A</span>;
   return (
      <span
         className={`w-[36px] h-[20px] px-[6px] rounded-full ${
            score > 59 ? 'bg-lum-green-550' : score > 29 ? 'bg-lum-yellow-500' : 'bg-lum-orange-500'
         } text-lum-white`}>
         {score}%
      </span>
   );
};

export default ReputationBadge;
