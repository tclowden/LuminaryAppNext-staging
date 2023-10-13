import { fetchDbApi } from '@/serverActions';

export const getOrderData = async (token: string | undefined, orderId: string) => {
   return await fetchDbApi(`/api/v2/orders/${orderId}`, {
      method: 'GET',
      headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` },
      cache: 'no-store',
   }).catch((err) => {
      console.log('err:', err);
   });
};
