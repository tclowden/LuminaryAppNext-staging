import SingleKey from './SingleKey';

type Props = {
   handleKeyClick: (digit: string) => void;
};

const KeyPad = ({ handleKeyClick }: Props) => {
   return (
      <div className='flex flex-col gap-y-[10px] w-full py-[10px]'>
         <div className='flex flex-row w-full justify-between'>
            <SingleKey digit='1' subText='' handleKeyClick={handleKeyClick} />
            <SingleKey digit='2' subText='ABC' handleKeyClick={handleKeyClick} />
            <SingleKey digit='3' subText='DEF' handleKeyClick={handleKeyClick} />
         </div>
         <div className='flex flex-row w-full justify-between'>
            <SingleKey digit='4' subText='GHI' handleKeyClick={handleKeyClick} />
            <SingleKey digit='5' subText='JKL' handleKeyClick={handleKeyClick} />
            <SingleKey digit='6' subText='MNO' handleKeyClick={handleKeyClick} />
         </div>
         <div className='flex flex-row w-full justify-between'>
            <SingleKey digit='7' subText='PQRS' handleKeyClick={handleKeyClick} />
            <SingleKey digit='8' subText='TUV' handleKeyClick={handleKeyClick} />
            <SingleKey digit='9' subText='WXYZ' handleKeyClick={handleKeyClick} />
         </div>
         <div className='flex flex-row w-full justify-between items-center'>
            <SingleKey digit='*' subText='' handleKeyClick={handleKeyClick} />
            <SingleKey digit='0' subText='' handleKeyClick={handleKeyClick} />
            <SingleKey digit='#' subText='' handleKeyClick={handleKeyClick} />
         </div>
      </div>
   );
};

export default KeyPad;
