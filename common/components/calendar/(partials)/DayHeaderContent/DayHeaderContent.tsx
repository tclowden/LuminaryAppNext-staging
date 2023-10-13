import { DayHeaderContentArg } from '@fullcalendar/core';

const DayHeaderContent: React.FC<DayHeaderContentArg> = ({ date, text, view }) => {
  const viewType = view.type;

  const currentDateLocal = new Date().toLocaleDateString();
  const headerDateLocal = date.toLocaleDateString();

  if (currentDateLocal === headerDateLocal) {
    if (viewType === 'dayGridWeek') {
      return (
        <div className='bg-lum-cyan-500 text-lum-white border-none w-[100%] -ml-0.5 rounded py-2'>
          {text} - TODAY
        </div>
      );
    } else if (viewType === 'dayGridDay') {
      return <div className='today-header day-view'>{text}</div>;
    }
  } else {
    return <>{text}</>;
  }

  // Default return value
  return null;
};

export default DayHeaderContent;