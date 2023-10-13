import { useAppSelector } from '../../../../../store/hooks';
import { InboundCall, selectInboundCalls } from '../../../../../store/slices/twilio';
import InboundCallCard from './InboundCallCard';

type Props = {};

const InboundCallsTab = ({}: Props) => {
   const inboundCalls = useAppSelector(selectInboundCalls);

   return (
      <div className='flex flex-wrap gap-[10px]'>
         {!!inboundCalls?.length &&
            inboundCalls.map((inboundCall: InboundCall, index:number) => (
               <InboundCallCard key={index} inboundCall={inboundCall} />
            ))}
      </div>
   );
};

export default InboundCallsTab;
