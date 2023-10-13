import { fetchDbApi } from '@/serverActions';

// coordinator utilities
export const fetchCoordinators = async (token: string | undefined) => {
   return fetchDbApi(`/api/v2/products/coordinators`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'applicaiton/json' },
   }).catch((err: any) => {
      console.log('error fetching coordinators', err);
   });
};

export const fetchCoordinatorsOnProduct = async (token: string | undefined, productId: string) => {
   return fetchDbApi(`/api/v2/products/${productId}/coordinators/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'applicaiton/json' },
      body: JSON.stringify({
         include: [
            {
               model: 'productCoordinators',
               required: false,
               as: 'productCoordinator',
               include: [
                  {
                     model: 'roles',
                     as: 'roles',
                     required: false,
                  },
               ],
            },
         ],
      }),
   }).catch((err: any) => {
      console.log('error fetching coordinators on product', err);
   });
};

// fields uitilites
export const fetchProductFields = async (token: string | undefined) => {
   return fetchDbApi(`/api/v2/products/fields`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
   }).catch((err: any) => {
      console.log('error fetching fields', err);
   });
};

export const fetchFieldsOnProduct = async (token: string | undefined, productId: string) => {
   return fetchDbApi(`/api/v2/products/${productId}/fields/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'applicaiton/json' },
      body: JSON.stringify({
         include: [
            {
               model: 'productFields',
               required: false,
               include: [{ model: 'fieldTypesLookup', as: 'fieldType', required: false }],
               as: 'productField',
            },
         ],
      }),
   }).catch((err: any) => {
      console.log('error fetching fields on product', err);
   });
};

// tasks utilities
export const fetchTasks = async (token: string | undefined) => {
   return fetchDbApi(`/api/v2/products/tasks`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
   }).catch((err) => {
      console.log('err fetching tasks', err);
   });
};

export const fetchTaskDueDateTypes = async (token: string | undefined) => {
   return fetchDbApi(`/api/v2/task-due-date-types`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
   }).catch((err: any) => {
      console.log('error fetching task due date types', err);
   });
};

export const fetchTasksOnProduct = async (token: string | undefined, productId: string) => {
   return fetchDbApi(`/api/v2/products/${productId}/tasks/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'applicaiton/json' },
      body: JSON.stringify({
         include: [
            { model: 'productTasks', required: false, as: 'productTask' },
            { model: 'taskDueDateTypesLookup', as: 'taskDueDateType', required: false },
         ],
      }),
   }).catch((err: any) => {
      console.log('error fetching tasks on product', err);
   });
};

// stages utilities
export const fetchStages = async (token: string | undefined) => {
   return fetchDbApi(`/api/v2/products/stages/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
         where: { name: { '[Op.ne]': 'Beginning Stage' } },
         include: [
            { model: 'productsLookup', as: 'productsLookup', required: false },
            { model: 'stageTypesLookup', as: 'stageType', required: false },
         ],
         order: [['name', 'ASC']], // order by created at ASC
      }),
   }).catch((err) => {
      console.log('err fetching stages', err);
   });
};

export const fetchRoles = async (token: string | undefined) => {
   return fetchDbApi(`/api/v2/roles/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
         where: { name: { '[Op.notIn]': ['Super Secret Dev', 'Default Role'] } },
         include: [
            { model: 'users', required: false },
            { model: 'permissions', required: false },
         ],
         order: [['name', 'ASC']],
      }),
   }).catch((err) => {
      console.log('err fetching roles', err);
   });
};

export const fetchStagesOnProduct = async (token: string | undefined, productId: string) => {
   return fetchDbApi(`/api/v2/products/${productId}/stages/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
         where: { productId: productId },
         include: [
            {
               model: 'productStages',
               required: true, // enfore INNER JOIN
               as: 'productStage',
               where: { name: { '[Op.ne]': 'Beginning Stage' } },
            },
            {
               model: 'stageOnProductRoleConstraints',
               as: 'excludedRoles',
               required: false,
               include: [{ model: 'roles', required: false, as: 'role' }],
            },
         ],
      }),
   }).catch((err: any) => {
      console.log('error fetching stages on product', err);
   });
};

export const handleResults = (results: any) =>
   results.map((result: any) => result.status === 'fulfilled' && result.value);
