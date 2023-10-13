'use client';
import React from 'react';
import Table from '../../../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../../../common/components/table/tableTypes';
import { defaultPitchReport } from './dummyData';

const columns: ColumnType[] = [
   { keyPath: ['customerName'], title: 'Customer Name', colSpan: 1 },
   { keyPath: ['status', 'name'], title: 'Current Status', colSpan: 2 },
   { keyPath: ['apptKept'], title: 'Appointment Kept', colSpan: 1 },
   { keyPath: ['lastAppt'], title: 'Last Appointment', colSpan: 1 },
   { keyPath: ['nextAppt'], title: 'Next Appointment', colSpan: 1 },
];

interface Props {}

const PitchReport = ({}: Props) => {
   const handleActionClick = (e: any, actionKey: string, item: any) => {};

   return <Table columns={columns} data={defaultPitchReport} />;
};

export default PitchReport;
