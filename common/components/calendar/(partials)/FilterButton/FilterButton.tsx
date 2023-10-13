import Button from '@/common/components/button/Button';
import Tooltip from '@/common/components/tooltip/Tooltip';

type Props = {
   onClick?: () => void
};

function FilterButton({onClick}: Props) {
   return (
      <div className='ml-2'>
         <Tooltip content="Filter Events">
            <Button iconName='Funnel' size='md' color='gray:50' iconColor='gray:50' onClick={onClick} />
         </Tooltip>
      </div>
   );
}

export default FilterButton;
