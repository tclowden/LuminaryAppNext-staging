import Icon from '../Icon';

type ExplainerProps = {
   children: React.ReactNode;
   title?: string;
   titleIconName?: string;
   description: string | React.ReactNode;
   iconName?: string;
};

const Explainer = ({ children, title, titleIconName, description, iconName }: ExplainerProps) => {
   return (
      <div className=''>
         {title && (
            <span className='flex items-center pb-[6px] text-[18px] text-lum-gray-500 dark:text-lum-gray-300'>
               {titleIconName && (
                  <Icon
                     name={titleIconName}
                     height='14'
                     width='14'
                     viewBox='0 0 16 16'
                     className='mr-[6px] fill-lum-gray-500 dark:fill-lum-gray-300'
                  />
               )}
               {title}
            </span>
         )}
         <div className='grid grid-cols-[75%_25%] rounded bg-lum-white dark:bg-lum-gray-750'>
            <div className='p-4'>{children}</div>
            <div className='flex items-center p-4 rounded-r bg-lum-gray-50 dark:bg-lum-gray-700'>
               <Icon
                  className='min-h-[16px] min-w-[16px] fill-lum-blue-500'
                  name={iconName || 'QuestionCircle'}
                  width='16'
                  height='16'
               />
               <span className='ml-[9px] text-[14px] text-lum-gray-500 dark:text-lum-gray-300'>{description}</span>
            </div>
         </div>
      </div>
   );
};

export default Explainer;
