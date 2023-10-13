import MessageFeed from '@/features/components/message-feed/MessageFeed';
import { useAppSelector } from '@/store/hooks';
import { selectLeadSmsLogs } from '@/store/slices/smsLogs';

type Props = {
   show: boolean;
   leadId: string;
   isLoading: boolean;
};

const TextHistory = ({ show, leadId, isLoading }: Props) => {
   const leadSmsLogs = useAppSelector(selectLeadSmsLogs)[leadId];

   return (
      <>
         {show && (
            <MessageFeed
               smsLogs={leadSmsLogs}
               isLoading={isLoading}
               classNames={{
                  container:
                     'max-h-[275px] overflow-y-auto flex flex-col gap-[10px] p-[12px] rounded-sm bg-lum-gray-50 dark:bg-lum-gray-750',
               }}
            />
         )}
      </>
   );
};

export default TextHistory;
