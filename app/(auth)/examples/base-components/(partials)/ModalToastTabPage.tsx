import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from '../../../../../common/components/button/Button';
import Modal from '../../../../../common/components/modal/Modal';
import { setAddToast, Toast } from '../../../../../store/slices/toast';
import Panel from '../../../../../common/components/panel/Panel';

const sampleToasts: Toast[] = [
   {
      title: 'View',
      iconName: 'Voicemail',
      details: [{ label: 'top-right', text: 'Lucille Bluth' }],
      variant: 'warning',
      position: 'top-right',
   },
   {
      title: 'View',
      iconName: 'Voicemail',
      details: [{ label: 'bottom-right', text: 'Lucille Bluth' }],
      variant: 'warning',
      position: 'bottom-right',
   },
   {
      title: 'View',
      iconName: 'Voicemail',
      details: [{ label: 'bottom-right', text: 'Lucille Bluth' }],
      autoCloseDelay: 2,
      variant: 'warning',
      position: 'bottom-right',
   },
   {
      iconName: 'PaperAirplane',
      details: [
         { label: 'New Message From', text: 'Dwight Schrute' },
         { label: 'New Message From', text: 'Dwight Schrute' },
      ],
      variant: 'primary',
      position: 'top-right',
   },
   {
      title: 'Answer Call',
      iconName: 'PhoneRinging',
      details: [
         { label: 'top-left', text: 'Should add 33 more pixels' },
         { label: 'Calling', text: '(123) 456-7890' },
         { label: 'Lead Source', text: 'KRXOHD2 107.7 FM The Hawk' },
      ],
      variant: 'success',
      position: 'top-left',
   },
   {
      title: 'Answer Call',
      iconName: 'PhoneRinging',
      details: [
         { label: 'top-right', text: 'Should add 33 more pixels' },
         { label: 'Calling', text: '(123) 456-7890' },
         { label: 'Lead Source', text: 'KRXOHD2 107.7 FM The Hawk' },
      ],
      variant: 'success',
      position: 'top-right',
   },
   {
      title: 'Answer Call',
      iconName: 'PhoneRinging',
      details: [
         { label: 'top-right', text: 'Should add 33 more pixels' },
         { label: 'Calling', text: '(123) 456-7890' },
         { label: 'Lead Source', text: 'KRXOHD2 107.7 FM The Hawk' },
      ],
      variant: 'success',
      position: 'top-right',
   },
   {
      iconName: 'MissedCall',
      details: [{ label: 'Missed Call From', text: 'Tobias Fünke' }],
      autoCloseDelay: 2,
      variant: 'danger',
   },
   {
      title: 'Re-Route',
      iconName: 'PaperAirplane',
      details: [
         { label: 'Position', text: 'bottom-left' },
         { label: 'New Message From', text: 'Dwight Schrute' },
      ],
      destinationRoute: '/marketing/leads',
      variant: 'primary',
      position: 'bottom-right',
      animate: true,
   },
   {
      title: 'Answer Call',
      iconName: 'PhoneRinging',
      details: [
         { label: 'Calling', text: '(123) 456-7890' },
         { label: 'Lead Source', text: 'KRXOHD2 107.7 FM The Hawk' },
      ],
      disableCloseButton: true,
      variant: 'success',
      onToastClick: {
         actionType: 'toast/setHelloMessage',
         actionPayload: { name: 'Fred' },
      },
      animate: true,
   },
];

const ModalToastTabPage = () => {
   const dispatch = useDispatch();
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

   const modalPrimaryCallback = () => {
      console.log('Primary Action Called!');
   };
   const modalSecondaryCallback = () => {
      console.log('Secondary Action Called!');
   };

   const handleAddToast = () => {
      const toast = sampleToasts.pop();
      if (toast) {
         dispatch(setAddToast(toast));
      }
   };
   return (
      <>
         <Panel title={'Modal'} titleSize='lg' collapsible>
            <div className='flex flex-col gap-4'>
               <span>
                  <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
               </span>
               <Modal
                  isOpen={isModalOpen}
                  onClose={setIsModalOpen}
                  title={'title'}
                  primaryButtonCallback={modalPrimaryCallback}
                  primaryButtonText={'primaryText'}
                  secondaryButtonText={'secondaryText'}>
                  <div>All Modal children will be displayed in here</div>
               </Modal>
               <div className='rounded bg-lum-gray-100 dark:bg-lum-gray-700 p-4 whitespace-pre text-lum-pink-600'>
                  {`type ModalProps = {\n   isOpen: boolean;\n   setIsOpen: (value: boolean) => void;\n   title?: string;\n   primaryText?: string;\n   primaryCallback?: () => void;\n   secondaryText?: string;\n   secondaryCallback?: () => void;\n   children: React.ReactNode;\n};`}
               </div>
            </div>
         </Panel>
         <Panel title={'Toast'} collapsible>
            <div className='flex flex-col gap-4'>
               <span>
                  <Button onClick={handleAddToast}>Add Toast</Button>
               </span>
               <span className='whitespace-pre'>
                  Call the action `setAddToast` and pass it a payload. Example below:
               </span>
               <div className='rounded bg-lum-gray-100 dark:bg-lum-gray-700 p-4 whitespace-pre text-lum-pink-600'>
                  {`{\n   title: 'View',\n   iconName: 'Voicemail',\n   details: [{ label: 'New Voicemail', text: 'Lucille Bluth' }],\n   variant: 'warning',\n   autoCloseDelay: 2,\n   onToastClick: () => {\n      console.log('Clicking on the Toast!');\n   },\n}`}
               </div>
               <div className='rounded bg-lum-gray-100 dark:bg-lum-gray-700 p-4 whitespace-pre text-lum-pink-600'>
                  {`type ToastProps = {\n   title?: string;\n   iconName?: string;\n   details: {\n      label: string;\n      text: string;\n   }[];\n   autoCloseDelay?: number; // Delay in seconds\n   onToastClick?: () => void;\n   disableCloseButton?: boolean;\n   variant?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';\n};`}
               </div>
            </div>
         </Panel>
      </>
   );
};

export default ModalToastTabPage;
