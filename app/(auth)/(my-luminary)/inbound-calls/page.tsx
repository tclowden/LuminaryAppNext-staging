import { cookies } from 'next/headers';
import InboundCallsClient from './InboundCallsClient';
export const dynamic = 'force-dynamic';
type Props = {};

const page = ({}: Props) => {
   const nextCookies = cookies();
   return <InboundCallsClient />;
};

export default page;
