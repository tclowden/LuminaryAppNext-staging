'use client';

import Button from '@/common/components/button/Button';
import Icon from '@/common/components/Icon';
import PageContainer from '@/common/components/page-container/PageContainer';
import SearchBar from '@/common/components/search-bar/SearchBar';
import useDebounce from '@/common/hooks/useDebounce';
import MessageFeed from '@/features/components/message-feed/MessageFeed';
import useMessageInput from '@/features/hooks/useMessageInput';
import { fetchDbApi } from '@/serverActions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getLeadSmsLogs, selectLeadSmsLogs } from '@/store/slices/smsLogs';
import { selectUser } from '@/store/slices/user';
import { formatPostgresTimestamp, getDisplayName, getObjectProp } from '@/utilities/helpers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
   messagesData: Array<any>;
};

const MessagesClient = ({ messagesData }: Props) => {
   const router = useRouter();
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   const leadSmsLogs = useAppSelector(selectLeadSmsLogs);

   const [searchValue, setSearchValue] = useState<string>('');
   const [searchResults, setSearchResults] = useState<Array<string>>([]);

   const [messages, setMessages] = useState<Array<any>>([]);
   const [selectedLead, setSelectedLead] = useState<any>();
   const [loadingLeadMessages, setLoadingLeadMessages] = useState<boolean>();

   useEffect(() => {
      setMessages(
         messagesData.map((msg) => ({
            ...msg,
            hasNewMessages: !!msg?.lead?.smsAcknowledgedBy?.acknowledgedByUserIds
               ? !msg?.lead?.smsAcknowledgedBy?.acknowledgedByUserIds.includes(user?.id)
               : true,
         }))
      );
   }, [messagesData, user]);

   const handleSelectLead = (lead: any) => {
      setSelectedLead(lead);
      getLeadMessages(lead?.id);
   };

   const getLeadMessages = async (leadId?: string) => {
      if (!leadId) return;

      if (!leadSmsLogs[leadId]?.length) {
         setLoadingLeadMessages(true);
         await dispatch(getLeadSmsLogs(leadId));
         setLoadingLeadMessages(false);
         acknowledgeLeadMessages(leadId);
      }
   };

   const acknowledgeLeadMessages = async (leadId: string) => {
      if (!leadId) return;

      const foundMessage = messages.find((msg) => msg?.lead?.id === leadId);
      if (!foundMessage) return;

      if (foundMessage?.hasNewMessages) {
         await fetchDbApi(`/api/v2/leads/${leadId}/sms-logs/acknowledge`, {
            method: 'PUT',
         }).catch((err: any) => {
            console.log('acknowledgeLeadMessages -> Error:', err);
         });

         setMessages((prevState) => {
            const tempState = [...prevState];
            const foundMessage = tempState.find((msg) => msg?.lead?.id === leadId);
            if (!foundMessage) return prevState;
            foundMessage.hasNewMessages = false;
            return tempState;
         });
      } else {
         return;
      }
   };

   useDebounce(
      async () => {
         if (searchValue?.length < 1) return;
         const results = await fetchDbApi(`/api/v2/leads/query?fullName=${searchValue}`, {
            method: 'GET',
         }).catch((err: any) => {
            console.log('err searching leads by name:', err);
         });

         setSearchResults(results);
      },
      [searchValue],
      500
   );

   const handleSearch = async (e: any) => {
      const searchString = e.target.value;
      setSearchValue(searchString);
   };

   const { MessageInput } = useMessageInput({
      leadId: selectedLead?.id,
      toNumber: selectedLead?.phoneNumber,
      userId: `${user?.id}`,
      fromNumber: getObjectProp(user, ['phoneNumbers', 0, 'phoneNumber', 'number']),
      showSendButton: true,
      disabled: !selectedLead?.id,
   });

   return (
      <PageContainer>
         <div className='grid grid-cols-[380px_1fr] gap-[10px]'>
            <div className={`flex flex-col gap-[1px]`}>
               <div
                  className={`min-h-[60px] mb-[1px] flex flex-col justify-center px-[10px] rounded-sm bg-lum-white dark:bg-lum-gray-700`}>
                  <SearchBar
                     placeholder={'Search Leads...'}
                     searchValue={searchValue}
                     handleChange={handleSearch}
                     searchResults={searchResults}
                     onSelectSearchResult={(e: any, result: any) => {
                        if (result.id) handleSelectLead(result);
                        else console.log('hmmm.... no lead id for result:', result);
                     }}
                     keyPath={['fullName']}
                  />
               </div>
               <div className='max-h-[792px] flex flex-col gap-[1px] overflow-y-auto'>
                  {!!messages?.length &&
                     messages.map((message: any) => {
                        const isSelected = message?.lead?.id === selectedLead?.id;
                        return (
                           <div
                              key={message?.id}
                              className={twMerge(
                                 `h-[60px] p-[10px] rounded-sm cursor-pointer bg-lum-gray-50 hover:bg-lum-white dark:bg-lum-gray-750 dark:hover:bg-lum-gray-700 hover:shadow-sm ${
                                    isSelected &&
                                    'bg-lum-blue-500 dark:bg-lum-blue-500 hover:bg-lum-blue-500 dark:hover:bg-lum-blue-500'
                                 }`
                              )}
                              onClick={() => handleSelectLead(message?.lead)}>
                              <div className='flex justify-between'>
                                 <div className='flex items-center gap-[5px]'>
                                    {message?.hasNewMessages && !isSelected && (
                                       <div className='h-[8px] w-[8px] rounded-full bg-lum-blue-500'></div>
                                    )}
                                    <span className='font-medium'>
                                       {getDisplayName([message?.lead?.firstName, message?.lead?.lastName])}
                                    </span>
                                 </div>
                                 <div className='flex gap-[5px] items-center'>
                                    <span
                                       className={`text-[12px] text-lum-gray-450 ${
                                          isSelected && 'text-lum-white'
                                       }`}>{`${formatPostgresTimestamp(message?.createdAt)}`}</span>
                                    <Icon
                                       name={'ChevronRight'}
                                       color={`${isSelected ? 'white' : 'gray:450'}`}
                                       width={5}
                                       height={10}
                                    />
                                 </div>
                              </div>
                              <div
                                 className={`text-[12px] text-lum-gray-450 truncate ${isSelected && 'text-lum-white'}`}>
                                 {message?.body
                                    ? message?.body
                                    : message?.mmsUrls
                                    ? `${message?.mmsUrls?.length} Attachment${message?.mmsUrls?.length > 1 ? 's' : ''}`
                                    : '<No Message>'}
                              </div>
                           </div>
                        );
                     })}
               </div>
            </div>
            <div className={`h-[853px] flex flex-col gap-[2px]`}>
               <div className='h-[60px] flex justify-between items-center p-[15px] rounded-sm bg-lum-white dark:bg-lum-gray-700'>
                  <span className='text-[18px]'>
                     {selectedLead?.id
                        ? getDisplayName([selectedLead?.firstName, selectedLead?.lastName])
                        : 'Select a Lead'}
                  </span>
                  {selectedLead?.id ? (
                     <div className='flex items-center'>
                        {/* <Button iconName='Pin' color='transparent' size='md' tooltipContent='' /> */}
                        <Button
                           iconName='LeadSearch'
                           color='transparent'
                           size='md'
                           tooltipContent='View Lead'
                           onClick={() => router.push(`/marketing/leads/${selectedLead?.id}`)}
                        />
                        {/* <Button iconName='Disable' color='transparent' size='md' tooltipContent='' /> */}
                     </div>
                  ) : (
                     <>&nbsp;</>
                  )}
               </div>
               <MessageFeed
                  smsLogs={leadSmsLogs[selectedLead?.id]}
                  isLoading={loadingLeadMessages}
                  classNames={{
                     container:
                        'grow overflow-y-auto flex flex-col gap-[10px] p-[12px] rounded-sm bg-lum-gray-50 dark:bg-lum-gray-750',
                  }}
               />
               <div className='p-[10px] rounded-sm bg-lum-white dark:bg-lum-gray-700'>{MessageInput}</div>
            </div>
         </div>
      </PageContainer>
   );
};

export default MessagesClient;
