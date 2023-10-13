import { useAppDispatch } from '@/store/hooks';
import Link from 'next/link';
import Button from '../../../../../common/components/button/Button';
import Grid from '../../../../../common/components/grid/Grid';
import Icon from '../../../../../common/components/Icon';
import useTimer from '../../../../../common/hooks/useTimer';
import { connectQueueCall, InboundCall, setRemoveInboundCall } from '../../../../../store/slices/twilio';
import { getFormattedPhoneNumber } from '../../../../../utilities/helpers';

type Props = {
   inboundCall: InboundCall;
};

const InboundCallCard = ({ inboundCall }: Props) => {
   const dispatch = useAppDispatch();
   const timeSinceCalled = useTimer(inboundCall?.callStartTime);

   const handleAnswerCall = () => {
      dispatch(
         connectQueueCall({
            callSid: inboundCall.callSid,
            notifiedChannels: inboundCall.notifiedChannels,
            lead: { id: inboundCall?.leadId, firstName: inboundCall?.leadName },
         })
      );

      dispatch(setRemoveInboundCall({ callSid: inboundCall.callSid }));
   };

   return (
      <div
         key={inboundCall.callSid}
         className='rounded min-w-[250px]'
         style={{ boxShadow: '0px 1px 2px rgba(16, 24, 30, 0.15)' }}>
         <div
            className='flex justify-between items-center px-[20px] min-h-[60px] rounded-t bg-lum-gray-50 dark:bg-lum-gray-700
'>
            <div className='flex items-center gap-[5px]'>
               <Icon name='PhoneInbound' color='green' width={22} />
               <span className='text-lum-gray-500 dark:text-lum-gray-200'>Inbound Call</span>
            </div>
            <span className='text-[22px] font-medium'>{timeSinceCalled}</span>
         </div>
         <Grid className='p-[20px] rounded-b bg-lum-white dark:bg-lum-gray-750'>
            <Grid rowGap={0}>
               <span className='text-lum-gray-500 dark:text-lum-gray-200 text-[12px]'>Phone Number</span>
               <span className='text-lum-gray-700 dark:text-lum-white leading-[16px]'>
                  {getFormattedPhoneNumber(inboundCall.from)}
               </span>
            </Grid>
            <Grid rowGap={0}>
               <span className='text-lum-gray-500 dark:text-lum-gray-200 text-[12px]'>Existing Lead?</span>
               <span className='text-lum-gray-700 dark:text-lum-white leading-[16px]'>
                  {!!inboundCall.leadId ? 'Yes' : 'No'}
               </span>
            </Grid>
            <Grid rowGap={0} className='mb-[10px]'>
               <span className='text-lum-gray-500 dark:text-lum-gray-200 text-[12px]'>Lead Name</span>
               {inboundCall?.leadId && inboundCall?.leadName ? (
                  <Link className='text-lum-primary leading-[16px]' href={`/marketing/leads/${inboundCall?.leadId}`}>
                     {inboundCall.leadName}
                  </Link>
               ) : (
                  <span className='text-lum-gray-300 leading-[16px]'>Unknown</span>
               )}
            </Grid>
            <Button color='green' size='lg' onClick={handleAnswerCall}>
               <Icon name={'PhoneAngled'} color='green:200' width={20} />
               <span className='ml-[10px]'>Answer Call</span>
            </Button>
         </Grid>
      </div>
   );
};

export default InboundCallCard;
