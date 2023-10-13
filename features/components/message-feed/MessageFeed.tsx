import ScrollContainer from '@/app/(auth)/(my-luminary)/my-pipe/(partials)/(board-modal-partials)/ScrollContainer';
import LoadingSpinner from '@/common/components/loaders/loading-spinner/LoadingSpinner';
import Tooltip from '@/common/components/tooltip/Tooltip';
import { getDisplayName } from '@/utilities/helpers';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

type BasicNameType = {
   id: string;
   firstName: string;
   lastName: string;
};

type SmsLog = {
   id: string;
   body?: string;
   mmsUrls?: Array<string>;
   direction: 'inbound' | 'outbound';
   sentFromUser: BasicNameType;
   sentToUser: BasicNameType;
   lead: BasicNameType;
};

type Props = {
   smsLogs?: Array<SmsLog>;
   isLoading?: boolean;
   classNames?: Partial<Record<'container', string>>;
};

const MessageFeed = ({ smsLogs, isLoading = false, classNames }: Props) => {
   return (
      <ScrollContainer
         className={twMerge(`${isLoading && 'justify-center'} ${classNames?.container ? classNames.container : ''}`)}>
         {!isLoading ? (
            !!smsLogs?.length &&
            smsLogs.map((smsLog) => {
               const isInbound = smsLog?.direction === 'inbound';
               return (
                  <div key={smsLog?.id} className={`w-full flex flex-col ${isInbound ? 'items-start' : 'items-end'}`}>
                     <div className={`w-[65%] flex flex-col gap-[10px] ${isInbound ? 'justify-start' : 'justify-end'}`}>
                        <span
                           className={`text-[12px] text-lum-gray-450 dark:text-lum-gray-300 ${
                              isInbound ? 'text-left' : 'text-right'
                           }`}>
                           {isInbound
                              ? getDisplayName(
                                   [smsLog?.lead?.firstName, smsLog?.lead?.lastName],
                                   `Lead: ${smsLog?.lead?.id}`
                                )
                              : getDisplayName([smsLog?.sentFromUser?.firstName, smsLog?.sentFromUser?.lastName])}
                        </span>
                        {smsLog?.body && (
                           <span
                              className={twMerge(
                                 `p-[12px] rounded-xl [overflow-wrap:anywhere] ${
                                    isInbound
                                       ? 'bg-lum-white dark:bg-lum-gray-700 self-start'
                                       : 'text-lum-white bg-lum-blue-500 self-end'
                                 }`
                              )}>
                              {smsLog?.body}
                           </span>
                        )}
                        {!!smsLog?.mmsUrls?.length &&
                           smsLog?.mmsUrls?.map((imgUrl: string, index: number) => (
                              <Tooltip
                                 key={index}
                                 content='Open in new tab'
                                 position={isInbound ? 'right' : 'left'}
                                 openDelay={1000}>
                                 <div
                                    className={`relative w-[200px] h-[200px] hover:opacity-80 cursor-pointer ${
                                       isInbound ? 'self-start' : 'self-end'
                                    }`}
                                    onClick={() => !!window && window.open(imgUrl)}>
                                    <Image
                                       src={imgUrl}
                                       alt='Message Attachment'
                                       fill
                                       style={{
                                          objectFit: 'cover',
                                          objectPosition: 'center',
                                          borderRadius: '10px',
                                       }}
                                    />
                                 </div>
                              </Tooltip>
                           ))}
                     </div>
                  </div>
               );
            })
         ) : (
            <div className='flex justify-center'>
               <LoadingSpinner isOpen={isLoading} size={60} />
            </div>
         )}
      </ScrollContainer>
   );
};

export default MessageFeed;
