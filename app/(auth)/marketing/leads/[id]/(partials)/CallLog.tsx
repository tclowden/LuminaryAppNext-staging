import Link from 'next/link';
import { useEffect, useState } from 'react';
import Icon from '../../../../../../common/components/Icon';
import Table from '../../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../../common/components/table/tableTypes';
import Panel from '../../../../../../common/components/panel/Panel';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import { redirect } from 'next/navigation';
import { selectPageContext, setPageContext } from '@/store/slices/pageContext';
import { fetchDbApi } from '@/serverActions';
import { getObjectProp } from '@/utilities/helpers';

const callLogColumns: ColumnType[] = [
   {
      title: 'Call Recording',
      colSpan: 2,
      render: ({ item }) => {
         return item?.recordingUrl ? (
            <div className='flex'>
               <audio controls src={item.recordingUrl} />
            </div>
         ) : (
            <span className='text-lum-gray-300'>N/A</span>
         );
      },
   },
   {
      title: 'Call Type',
      colSpan: 1,
      render: ({ item }) => {
         return item['direction'] === 'inbound' ? (
            <div className='flex items-center'>
               <Icon name='PhoneInbound' color='gray' width='14' />
               <span className='ml-[10px] text-[14px]'>Inbound Call</span>
            </div>
         ) : (
            <div className='flex items-center'>
               <Icon name='PhoneOutbound' color='blue' width='14' />
               <span className='ml-[10px] text-[14px]'>Outbound Call</span>
            </div>
         );
      },
   },
   {
      title: 'Duration',
      colSpan: 1,
      render: ({ item }) => {
         const formattedDuration = new Date(item['duration'] * 1000).toISOString().substring(14, 19);
         return formattedDuration[0] === '0'
            ? formattedDuration.substring(1, formattedDuration.length)
            : formattedDuration;
      },
   },
   {
      title: 'Consultant',
      colSpan: 1,
      render: ({ item }) => {
         return (
            <Link className='text-lum-blue-500' href={`admin/users/${getObjectProp(item, ['consultant', 'id'])}`}>
               {getObjectProp(item, ['consultant', 'fullName'])}
            </Link>
         );
      },
   },
   {
      title: 'Call Date & Time',
      colSpan: 1,
      render: ({ item }) => {
         const formattedDate = new Date(item['createdAt']).toLocaleDateString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
         });
         return formattedDate;
      },
   },
];
const CallLog = () => {
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   const contextData = useAppSelector(selectPageContext);
   const { lead } = contextData;

   const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
   const [initialLoad, setInitialLoad] = useState<boolean>(true);

   const [callLogs, setCallLogs] = useState<any[]>([]);

   const [isLoading, setIsLoading] = useState<boolean>(false);

   useEffect(() => {
      if (!user?.token) return redirect('/login');

      if (initialLoad && !isCollapsed) {
         setInitialLoad(false);
         setIsLoading(true);

         if (!contextData?.callLogs?.length) {
            const fetchAsyncCallLogs = async () => {
               const leadCallLogs = await getCallLogs();
               dispatch(setPageContext({ callLogs: leadCallLogs }));
               setCallLogs(leadCallLogs);
            };
            fetchAsyncCallLogs();
         }
      }
   }, [isCollapsed]);

   const getCallLogs = async () => {
      setIsLoading(true);
      return fetchDbApi(`/api/v2/leads/${lead?.id}/call-logs`, {
         method: 'GET',
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      })
         .then((res) => {
            setIsLoading(false);
            return res;
         })
         .catch((err) => {
            setIsLoading(false);
            console.log('getCallLogs -> Error:', err);
         });
   };

   const handleCheckboxClick = ({ item }: { item: any }) => {
      const tempData = [...callLogs];
      const updatedItemIndex = tempData.findIndex((appointment) => appointment.id === item.id);
      if (updatedItemIndex === -1) return;
      tempData[updatedItemIndex].appointmentKept = !tempData[updatedItemIndex].appointmentKept;
      setCallLogs(tempData);
   };

   return (
      <Panel
         title='Call Log'
         titleIconName='PhoneLog'
         titleIconColor='green'
         collapsible
         isCollapsed={isCollapsed}
         onCollapseBtnClick={(e: any) => {
            setIsCollapsed((prevState: boolean) => !prevState);
         }}>
         <Table
            columns={callLogColumns}
            data={callLogs}
            onCellEvent={handleCheckboxClick}
            theme='secondary'
            showEmptyState
            emptyStateDisplayText='No Call Logs'
            isLoading={isLoading}
         />
      </Panel>
   );
};

export default CallLog;
