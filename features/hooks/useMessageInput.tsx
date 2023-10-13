import Button from '@/common/components/button/Button';
import LoadingSpinner from '@/common/components/loaders/loading-spinner/LoadingSpinner';
import useToaster from '@/common/hooks/useToaster';
import { fetchDbApi } from '@/serverActions';
import { useAppDispatch } from '@/store/hooks';
import { setNewLeadSmsLog } from '@/store/slices/smsLogs';
import { useRef, useState } from 'react';

type Props = {
   leadId: string;
   toNumber: string;
   userId: string;
   fromNumber: string;
   showSendButton?: boolean;
   disabled?: boolean;
};

const useMessageInput = ({ leadId, toNumber, userId, fromNumber, showSendButton = false, disabled = false }: Props) => {
   const dispatch = useAppDispatch();
   const makeToast = useToaster();
   const messageInputRef = useRef<HTMLDivElement | null>(null);

   const [isDragged, setIsDragged] = useState<boolean>(false);
   const [isSending, setIsSending] = useState<boolean>(false);

   const handleFileDrop = (e: any) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragged(false);

      if (!!e?.dataTransfer?.files?.length) {
         for (let i = 0; i < e.dataTransfer.files.length; i++) {
            const newImage: HTMLImageElement = document.createElement('img');
            newImage.src = URL.createObjectURL(e.dataTransfer.files[i]);
            newImage.style.height = '75px';
            messageInputRef.current?.appendChild(newImage);
         }
      }
   };

   const handleSendMessage = async () => {
      const textBody = messageInputRef.current?.textContent?.trim();
      const images = messageInputRef.current?.querySelectorAll('img');

      if (!images?.length && !textBody?.length) return;

      const formData = new FormData();

      if (textBody) formData.append('body', textBody);

      formData.append('fileCount', `${images?.length}`);
      if (images?.length) {
         let i = 0;
         for (const img of images) {
            const blob = await fetch(img.src).then((res) => res.blob());
            formData.append(`file[${i}]`, blob);
            i++;
         }
      }

      formData.append('toNumber', toNumber);
      formData.append('leadId', leadId);
      formData.append('fromNumber', fromNumber);
      formData.append('userId', userId);

      setIsSending(true);
      await fetch(`/api/v2/twilio/message/outgoing`, {
         method: 'POST',
         body: formData,
      })
         .then(async (res) => {
            if (!res.ok) throw new Error(`Request to send message failed`);
            const result = await res.json();

            dispatch(setNewLeadSmsLog({ leadId: result?.lead?.id, smsLog: result }));
            if (messageInputRef.current) messageInputRef.current.innerHTML = '';
            setIsSending(false);
         })
         .catch((err) => {
            console.log('handleSendMessage -> Error:', err?.message);
            makeToast(false, 'Failed to Send Message');
            setIsSending(false);
         });
   };

   const MessageInput = (
      <div
         className='relative min-h-[70px]'
         onDragOver={() => setIsDragged(true)}
         onDragLeave={() => setIsDragged(false)}
         onDrop={handleFileDrop}>
         <div
            ref={messageInputRef}
            className={`w-full min-h-[70px] p-[10px] rounded bg-lum-gray-50 dark:bg-lum-gray-700 text-lum-gray-700 dark:text-lum-white border-[1px] border-solid border-lum-gray-100 dark:border-lum-gray-600 cursor-text`}
            data-placeholder='Text Message...'
            contentEditable={!disabled}
         />
         {showSendButton && !disabled && (
            <span className='absolute right-0 bottom-0'>
               <Button size='md' color='blue' iconName='PaperAirplane' onClick={handleSendMessage} />
            </span>
         )}
         {isDragged && (
            <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center bg-lum-white dark:bg-lum-gray-800 opacity-70 border-[3px] border-dashed border-lum-blue-500 pointer-events-none'>
               <span>Drop Image/File</span>
            </div>
         )}
         {isSending && (
            <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center bg-lum-white dark:bg-lum-gray-800 opacity-70'>
               <LoadingSpinner isOpen={true} />
            </div>
         )}
      </div>
   );

   return { handleSendMessage, MessageInput };
};

export default useMessageInput;
