import React from 'react';
import PageProvider from '../../../../../providers/PageProvider';
import TasksClient from './TasksClient';
import { cookies } from 'next/headers';
import { fetchDbApi } from '@/serverActions';

const Tasks = async () => {
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   const allTasks: Array<any> = await fetchTasks(authToken);
   const taskCount: any = await fetchTaskCount(authToken);

   return (
      <PageProvider>
         <TasksClient allTasks={allTasks} taskCount={taskCount} />
      </PageProvider>
   );
};

export default Tasks;

const fetchTaskCount: any = async (token: string | undefined) => {
   return await fetchDbApi(`/api/v2/products/tasks/count`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      // how to handle this err?
      console.log('err:', err);
   });
};

const fetchTasks: any = (token: string | undefined) => {
   return fetchDbApi(`/api/v2/products/tasks/query`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
      body: JSON.stringify({
         limit: 100,
         offset: 0,
         order: [['name', 'ASC']],
      }),
   }).catch((err) => {
      // how to handle this err?
      console.log('err:', err);
   });
};
