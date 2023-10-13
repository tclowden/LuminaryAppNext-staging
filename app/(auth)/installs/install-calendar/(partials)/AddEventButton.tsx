'use client';
import Button from '@/common/components/button/Button';
import Tooltip from '@/common/components/tooltip/Tooltip';

type Props = {
   onClick: (e: any) => void
};

function AddEventButton({onClick}: Props) {
   return (
      <div className='ml-2'>
         <Tooltip content="Add Event">
            <Button iconName='Plus' size='md' color='gray:50' iconColor='gray:50' onClick={onClick} />
         </Tooltip>
      </div>
   );
}

export default AddEventButton;
