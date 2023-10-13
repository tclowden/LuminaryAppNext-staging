export const register = async () => {
   if (process.env.NEXT_RUNTIME === 'nodejs') {
      const { Worker } = await import('bullmq');
      const { ringRole, ringUser } = await import('@/workers/callRouteActionHandlers');
      const { QUEUE_NAME, redisConnection } = await import('@/workers/queue.worker');

      new Worker(
         QUEUE_NAME,
         async (job) => {
            try {
               switch (job.name) {
                  case 'Ring a specific user':
                     await ringUser(job.data);
                     break;
                  case 'Ring a user role':
                     await ringRole(job.data);
                     break;
               }
               return;
            } catch (err: any) {
               console.log('Queue Worker Error:', err);
               throw new Error(err.message);
            }
         },
         {
            concurrency: 50,
            connection: redisConnection,
         }
      );
   }
};
