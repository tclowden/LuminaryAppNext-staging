'use client';
import { useEffect, useState } from 'react';
import Checkbox from '../../../../../../common/components/checkbox/Checkbox';
import Panel from '../../../../../../common/components/panel/Panel';
import Table from '../../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../../common/components/table/tableTypes';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';

type Props = {
   leadId: string;
};

const appointmentColumns: ColumnType[] = [
   { keyPath: ['appointmentType', 'name'], title: 'Appointment Type', colSpan: 1 },
   {
      keyPath: ['createdAt'],
      title: 'Scheduled Date & Time',
      colSpan: 1,
      render: ({ item }) => {
         const formattedDate = new Date(item['createdAt']).toLocaleDateString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
         });
         return formattedDate;
      },
   },
   {
      keyPath: ['kept'],
      title: 'Appointment Kept?',
      colSpan: 1,
      // We don't want user to change the appointment kept here, do it in the status modal
      render: ({ item }) => <Checkbox checked={item['appointmentKept']} disabled={true} />,
   },
];

const Appointments = ({ leadId }: Props) => {
   const [appointmentData, setAppointmentData] = useState<any[]>([]);
   const user = useAppSelector(selectUser);

   useEffect(() => {
      async function getAppointmentData() {
         await fetch(`/api/v2/leads/${leadId}/appointments`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user.token}` },
         })
            .then(async (res) => {
               const appts = await res.json();
               console.log(appts);
               setAppointmentData([...appts]);
            })
            .catch((err) => console.log(err));
      }
      getAppointmentData();
   }, []);

   return (
      <Panel title='Appointments' titleIconName='CheckCalendar' titleIconColor='purple' collapsible isCollapsed>
         {appointmentData && <Table columns={appointmentColumns} data={appointmentData} theme='secondary' />}
      </Panel>
   );
};

export default Appointments;
