import { fetchDbApi } from '@/serverActions';
import { verifyToken } from '@/utilities/api/helpers';
import { cookies } from 'next/headers';
import PageProvider from '../../../../providers/PageProvider';
import MyActivityClient from './MyActivityClient';

const MyPipe = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   const userObj: any = await verifyToken(`${authToken}`);

   let callLogsData: any = null;
   let smsLogsData: any = null;
   let auditLogsData: any = null;

   await Promise.allSettled([fetchCallLogs(), fetchSmsLogs(), fetchAuditLogs(userObj.id)]).then((results: any) => {
      const [callLogsResult, smsLogsResult, auditLogsResult] = handleResults(results);

      if (callLogsResult) {
         callLogsData = callLogsResult;
      }
      if (smsLogsResult) {
         smsLogsData = smsLogsResult;
      }
      if (auditLogsResult) {
         auditLogsData = auditLogsResult.filter((auditLog: any) => auditLog?.newValue?.includes('statusId'));
      }
   });

   return (
      <PageProvider>
         <MyActivityClient
            callLogs={!!callLogsData?.length ? callLogsData : []}
            smsLogs={!!smsLogsData?.length ? smsLogsData : []}
            auditLogs={!!auditLogsData?.length ? auditLogsData : []}
         />
      </PageProvider>
   );
};

export default MyPipe;

const fetchCallLogs = () => {
   return fetchDbApi(`/api/v2/users/call-logs`, {
      method: 'GET',
      cache: 'no-store',
   }).catch((err) => console.error('err', err));
};

const fetchSmsLogs = () => {
   return fetchDbApi(`/api/v2/users/sms-logs`, {
      method: 'GET',
      cache: 'no-store',
   }).catch((err) => console.error('err', err));
};

const fetchAuditLogs = (userId: string) => {
   return fetchDbApi(`/api/v2/audit-logs/query`, {
      method: 'POST',
      body: JSON.stringify({
         where: {
            table: 'leads',
            modifiedById: userId,
         },
         order: [['modifiedAt', 'DESC']],
      }),
      cache: 'no-store',
   }).catch((err) => console.error('err', err));
};
const handleResults = (results: any) => {
   return results.map((result: any) => {
      if (result?.status === 'fulfilled') return result?.value;
   });
};
