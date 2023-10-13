import Button from '@/common/components/button/Button';

type Props = {
   styles?: string;
   selectedView: string;
   handleViewChange: (view: string, date: Date) => void;
   currentDate: Date;
   hideView?: string
};

type View = {
   id: string; 
   name: string;
}

const dayview = {
   id: 'dailyView', name: 'Day'
}

const ViewSelector = ({ selectedView, handleViewChange, styles, currentDate, hideView }: Props) => {

   let views: View[] = [
      { id: 'dayGridMonth', name: 'Month' },
      { id: 'dayGridWeek', name: 'Week' }
   ];

   if (hideView !== 'daily') {
      views.push(dayview);
   }

   const handleClick = (view: string) => () => {
      handleViewChange(view, currentDate);
   };

   return (
      <div className={`flex ${styles}`}>
         <div className='bg-lum-gray-50 dark:bg-lum-gray-700 text-center rounded h-[40px] px-1 w-auto flex items-center'>
            {views.map((view) => (
               <Button
                  key={view?.id}
                  onClick={handleClick(view.id)}
                  className={`text-lum-gray-600 dark:text-lum-gray-300 font-medium px-5 py-[6px] hover:cursor-pointer ${
                     selectedView === view.id ? 'bg-lum-primary text-lum-white rounded dark:text-lum-white' : ''
                  }`}>
                  {view.name}
               </Button>
            ))}
         </div>
      </div>
   );
};

export default ViewSelector;
