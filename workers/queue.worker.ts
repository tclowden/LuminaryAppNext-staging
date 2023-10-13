import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

export const QUEUE_NAME = 'actionsQueue';

export const redisConnection = new Redis(`${process.env.KV_URL}`, { maxRetriesPerRequest: null, tls: {} });

redisConnection.on('error', (error) => {
   console.error('Redis Error: ', error);
});

export const actionsQueue = new Queue(QUEUE_NAME, {
   connection: redisConnection,
});
