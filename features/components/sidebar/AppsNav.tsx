import Icon from '../../../common/components/Icon';
import { strToCamelCase } from '../../../utilities/helpers';
import { Page } from './Sidebar';

type Props = {
   apps: Page[];
   activeApp: Page | undefined;
   selectApp: (app: Page) => void;
   children: JSX.Element[];
};

const AppsNav = ({ apps, activeApp, selectApp, children }: Props) => {
   // // hide the dev app from production
   // const appsToMap = apps.filter((app) => {
   //    const isDevelopmentEnv = process?.env?.NODE_ENV === 'development';
   //    // if app is dev
   //    if (app.id === '7b31fb52-496d-4178-840f-97112c08e7ba') {
   //       if (isDevelopmentEnv) return app;
   //       else return null;
   //    } else return app;
   // });

   return (
      <div className='bg-lum-black flex flex-col'>
         {children}
         {apps.map((app, index) => {
            const iconColor: any = activeApp?.id === app.id ? app.iconColor : 'gray:550';
            return (
               <div
                  data-test={`${strToCamelCase(app.name)}AppSidebarLink`}
                  key={index}
                  onClick={() => selectApp(app)}
                  className={`
                     group flex flex-col items-center py-3  max-h-[70px] w-full cursor-pointer 
                     ${activeApp?.id === app.id ? 'bg-lum-gray-750' : 'hover:bg-lum-gray-750'}
                  `}>
                  <Icon
                     name={app.iconName || 'Gear'}
                     width={26}
                     height={26}
                     color={iconColor}
                     style={{
                        minWidth: '26px',
                        minHeight: '26px',
                     }}
                  />
                  <span
                     className={`
                        ${
                           activeApp?.id === app.id
                              ? 'text-lum-white'
                              : 'text-lum-gray-550 group-hover:text-lum-gray-450'
                        } 
                        uppercase font-bold text-[11px] mt-[8px]
                     `}>
                     {app.name}
                  </span>
               </div>
            );
         })}
      </div>
   );
};

export default AppsNav;
