import { cookies } from 'next/headers';
import React from 'react';
import PageProvider from '../../../../../../providers/PageProvider';
import TaskClient from './TaskClient';
import { fetchDbApi } from '@/serverActions';

interface Props {
   params: { id: string };
   searchParams?: { type: string };
}

const Task = async ({ params, searchParams }: Props) => {
   const taskId = params.id !== 'new' ? params.id : null;
   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;

   let taskDataRes: any = null;
   if (taskId) {
      // get the task data by id that needs to be updated
      taskDataRes = await fetchTask(authToken, taskId);
   } else taskDataRes = {};

   return (
      <PageProvider>
         <TaskClient task={taskDataRes} />
      </PageProvider>
   );
};

export default Task;

const fetchTask = async (token: string | undefined, taskId: number | string) => {
   return await fetchDbApi(`/api/v2/products/tasks/${taskId}`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      console.log('err in task with id:', taskId, ' err -->', err);
   });
};
