'use client';
import Checkbox from '@/common/components/checkbox/Checkbox';
import PageContainer from '@/common/components/page-container/PageContainer';
import TableCellContentEditable from '@/common/components/table-cell-content-editable/TableCellContentEditable';
import Table from '@/common/components/table/Table';
import { fetchDbApi } from '@/serverActions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectPageContext, setPageContext } from '@/store/slices/pageContext';
import { decrementUserNotificationCount, selectUser, updateUser } from '@/store/slices/user';
import { formatPostgresTimestamp } from '@/utilities/helpers';
import React, { useEffect, useState } from 'react';

interface Props {}

const MyNotificationListClient = ({}: Props) => {
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const { myNotifications } = useAppSelector(selectPageContext);

   const [tableNotis, setTableNotis] = useState<Array<any>>([]);

   useEffect(() => {
      setTableNotis(() => {
         return myNotifications
            .filter((noti: any) => !noti?.complete)
            .map((noti: any) => ({
               ...noti,
               createdAtPretty: formatPostgresTimestamp(noti.createdAt),
            }));
      });
   }, [myNotifications]);

   const handleSaveNotification = (notification: any) => {
      const dataToSave = { ...notification };

      // delete unnecessary keys
      delete dataToSave['taggedByUser'];
      delete dataToSave['taggedUser'];
      delete dataToSave['createdAtPretty'];
      delete dataToSave['note'];
      delete dataToSave['notificationType'];

      console.log('dataToSave:', dataToSave);

      fetchDbApi(`/api/v2/notifications/${dataToSave?.id}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
         body: JSON.stringify(dataToSave),
      })
         .then((res: any) => {
            console.log('res:', res);
            console.log('dataToSave.id:', dataToSave.id);
            console.log('dataToSave.complete:', dataToSave.complete);
            console.log('myNotifications:', myNotifications);
            dispatch(
               setPageContext({
                  myNotifications: myNotifications.map((noti: any) => ({
                     ...noti,
                     ...(noti?.id === dataToSave?.id && { complete: dataToSave.complete }),
                  })),
               })
            );
            dispatch(decrementUserNotificationCount());
         })
         .catch((err: any) => {
            console.log('err updating notification:', err);
         });
   };

   const handleCellEvent = ({ event, item, column }: any) => {
      if (column?.keyPath[0] === 'complete') {
         item['complete'] = event.target.checked;
         handleSaveNotification(item);
      }
   };

   return (
      <PageContainer>
         <Table
            data={tableNotis}
            onCellEvent={handleCellEvent}
            columns={[
               {
                  keyPath: ['complete'],
                  title: 'Complete',
                  colSpan: 1,
                  fixedWidth: true,
                  render: ({ item, callback }: any) => {
                     console.log('item?.complete:', item?.complete);
                     return <MemoizedCheckbox item={item} callback={callback} />;
                  },
               },
               {
                  keyPath: ['note', 'content'],
                  title: 'Message',
                  colSpan: 3,
                  render: ({ item }: any) => {
                     return <TableCellContentEditable content={item?.note?.content} />;
                  },
               },
               { keyPath: ['notificationType', 'name'], title: 'Notification Type', colSpan: 1 },
               { keyPath: ['taggedByUser', 'fullName'], title: 'Tagged By', colSpan: 1 },
               { keyPath: ['createdAtPretty'], title: 'Created At', colSpan: 1 },
            ]}
         />
      </PageContainer>
   );
};

export default MyNotificationListClient;

const MemoizedCheckbox = React.memo(({ item, callback }: any) => {
   const [checkedEvent, setCheckedEvent] = useState<any>({ target: { checked: item.complete } });

   useEffect(() => {
      setCheckedEvent({ target: { checked: item.complete } });
   }, [item?.complete]);

   const isChecked = checkedEvent.target.checked;
   return (
      <Checkbox
         checked={isChecked}
         onChange={(e: any) => {
            setCheckedEvent(e);
            callback(e);
         }}
      />
   );
});
