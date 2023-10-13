'use client';

import Button from '@/common/components/button/Button';
import Icon from '@/common/components/Icon';
import MessageFeed from '@/features/components/message-feed/MessageFeed';
import useMessageInput from '@/features/hooks/useMessageInput';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
   acknowledgeLeadSmsLogs,
   getLeadSmsLogs,
   selectAcknowledgedSmsLogs,
   selectLeadSmsLogs,
} from '@/store/slices/smsLogs';
import { selectUser } from '@/store/slices/user';
import { getDisplayName, getObjectProp } from '@/utilities/helpers';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Props = {
   lead: { id: string; phoneNumber: string; firstName?: string; lastName?: string; smsAcknowledgedBy?: any };
   isCollapsed: boolean;
   onCollapse: () => void;
};

const MessagesTab = ({ lead, isCollapsed, onCollapse }: Props) => {
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   const leadSmsLogs = useAppSelector(selectLeadSmsLogs)[lead.id];
   const acknowledgedByUsers = useAppSelector(selectAcknowledgedSmsLogs)[lead.id];

   const [initialLoad, setInitialLoad] = useState<boolean>(true);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   useEffect(() => {
      if (!user?.token) return redirect('/login');

      const getLogs = async () => {
         await dispatch(getLeadSmsLogs(lead.id));
         setIsLoading(false);
         await dispatch(acknowledgeLeadSmsLogs({ leadId: lead.id, userId: `${user.id}` }));
      };
      if (initialLoad && !isCollapsed) {
         setIsLoading(true);
         setInitialLoad(false);
         getLogs();
      }
   }, [isCollapsed]);

   const { MessageInput, handleSendMessage } = useMessageInput({
      leadId: lead?.id,
      toNumber: lead?.phoneNumber,
      userId: `${user?.id}`,
      fromNumber: getObjectProp(user, ['phoneNumbers', 0, 'phoneNumber', 'number']),
   });

   return createPortal(
      <>
         <div
            className='absolute bottom-0 right-[10px] w-[300px] rounded-t bg-lum-blue-500'
            style={{
               zIndex: 700,
            }}>
            <div className='flex p-[10px] items-center justify-between cursor-pointer' onClick={onCollapse}>
               <div className='flex items-center gap-[10px]'>
                  <Icon name={'PaperAirplane'} color={'white'} width={18} />
                  <span className='flex items-center gap-[5px]'>
                     {!acknowledgedByUsers?.includes(`${user?.id}`) && (
                        <span className='h-[12px] w-[12px] bg-lum-red-500 rounded-full' />
                     )}
                     {getDisplayName([lead?.firstName, lead?.lastName], `Lead: ${lead.id}`)}
                  </span>
               </div>
               <Button iconName={isCollapsed ? 'Plus' : 'Minus'} iconColor='white' color='blue:500' />
            </div>
            {!isCollapsed && (
               <div>
                  <MessageFeed
                     smsLogs={leadSmsLogs}
                     isLoading={isLoading}
                     classNames={{
                        container:
                           'min-h-[100px] max-h-[350px] overflow-y-auto flex flex-col gap-[10px] p-[12px] bg-lum-gray-50 dark:bg-lum-gray-750',
                     }}
                  />

                  <div className='flex flex-col gap-[10px] p-[10px] bg-lum-white dark:bg-lum-gray-700'>
                     {MessageInput}
                     <Button color='blue' size='sm' onClick={handleSendMessage}>
                        Send Message
                     </Button>
                  </div>
               </div>
            )}
         </div>
      </>,
      document.body
   );
};

export default MessagesTab;
