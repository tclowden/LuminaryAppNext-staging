import Button, { ButtonColors } from '../button/Button';
import { createPortal } from 'react-dom';

type Props = {
   isOpen: boolean;
   onClose: (e: any) => void;
   closeOnBackdropClick?: boolean;
   hideCloseButton?: boolean;
   title?: string;
   titleBackgroundColor?: string | null;
   customHeader?: React.ReactNode;
   primaryButtonText?: string;
   hidePrimaryCloseButton?: boolean;
   primaryButtonCallback?: (e: any) => void;
   primaryButtonColor?: ButtonColors;
   disablePrimaryButton?: boolean;
   secondaryButtonText?: string;
   secondaryButtonCallback?: (e: any) => void;
   secondaryButtonColor?: ButtonColors;
   disableSecondaryButton?: boolean;
   size?: 'small' | 'default' | 'large';
   zIndex?: number;
   children: React.ReactNode;
   customFooter?: React.ReactNode;
};

const Modal = ({
   isOpen,
   onClose,
   closeOnBackdropClick,
   hideCloseButton,
   hidePrimaryCloseButton,
   title,
   titleBackgroundColor = 'bg-lum-gray-50 dark:bg-lum-gray-750',
   customHeader,
   primaryButtonText,
   primaryButtonCallback,
   primaryButtonColor = 'blue',
   disablePrimaryButton = false,
   secondaryButtonText,
   secondaryButtonCallback,
   secondaryButtonColor = 'light',
   disableSecondaryButton,
   customFooter,
   size = 'default',
   zIndex = 900,
   children,
}: Props) => {
   if (isOpen)
      return createPortal(
         <>
            <div
               className='absolute top-0 left-0 w-screen h-screen bg-lum-black opacity-50 dark:opacity-75'
               onClick={(e: any) => {
                  closeOnBackdropClick && onClose(e);
               }}
               style={{
                  zIndex: zIndex,
               }}></div>
            <div
               onClick={(e) => e.stopPropagation()}
               className={`
                  absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]
                  ${
                     size === 'small'
                        ? 'min-w-[600px] max-w-[600px]'
                        : size === 'large'
                        ? 'min-w-[1024px] max-w-[1200px] '
                        : 'min-w-[768px] max-w-[800px]'
                  } 
               `}
               style={{
                  zIndex: zIndex + 1,
               }}>
               {/* Add option to have a green background below */}
               <div
                  className={`h-[70px] flex justify-between items-center px-[30px] rounded-t-lg ${titleBackgroundColor}`}>
                  {customHeader && customHeader}
                  {title && <span className='text-[18px] text-lum-gray-700 dark:text-lum-white'>{title}</span>}
                  {!hideCloseButton && (
                     <Button
                        className={`${customHeader && 'ml-4'}`}
                        onClick={(e: any) => onClose(e)}
                        iconName='XCross'
                        color='transparent'
                     />
                  )}
               </div>

               <div className='px-[50px] py-[26px] bg-lum-white dark:bg-lum-gray-700 max-h-[70vh] overflow-auto min-h-[400px]'>
                  {children}
               </div>
               <div className='h-[70px] flex justify-end items-center gap-4 px-[30px] rounded-b-lg bg-lum-gray-50 dark:bg-lum-gray-750'>
                  {customFooter && customFooter}
                  <div className='col-start-2 justify-self-end flex gap-4'>
                     {!hidePrimaryCloseButton && (
                        <Button
                           onClick={(e: any) => {
                              secondaryButtonCallback && secondaryButtonCallback(e);
                              onClose(e);
                           }}
                           color={secondaryButtonColor}
                           disabled={!!disableSecondaryButton}>
                           {secondaryButtonText || 'Close'}
                        </Button>
                     )}
                     {primaryButtonCallback && (
                        <Button
                           onClick={(e: any) => {
                              primaryButtonCallback && primaryButtonCallback(e);
                           }}
                           color={primaryButtonColor}
                           disabled={!!disablePrimaryButton}>
                           {primaryButtonText || 'Okay'}
                        </Button>
                     )}
                  </div>
               </div>
            </div>
         </>,
         document.body
      );

   return null;
};

export default Modal;
