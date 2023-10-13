import { fetchDbApi } from '@/serverActions';

export const getAttachmentTypes = async (token: string) => {
   return fetchDbApi(`/api/v2/attachment-types/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ where: { '[Op.or]': [{ name: 'Lead Record' }] } }),
   }).catch((err) => {
      console.error('getAttachments -> Error:', err);
   });
};

export const getAttachments = async (token: string, leadId: string) => {
   return fetchDbApi(`/api/v2/leads/${leadId}/attachments`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
   }).catch((err) => {
      console.error('getAttachments -> Error:', err);
   });
};

export const getNotes = async (token: string, leadId: string) => {
   return fetchDbApi(`/api/v2/leads/${leadId}/notes`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
   }).catch((err) => {
      console.error('err:', err);
   });
};
