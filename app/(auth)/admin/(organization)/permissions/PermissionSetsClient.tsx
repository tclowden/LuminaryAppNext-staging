'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Table from '../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../common/components/table/tableTypes';

const columns: ColumnType[] = [{ keyPath: ['name'], title: 'Permission Sets', colSpan: 2 }];

const PermissionsSetsClient = () => {
   const [permissions, setPermissions] = useState<any[]>([]);

   useEffect(() => {
      // axios
      //    .get(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/permission-sets`)
      //    .then((res) => {
      //       console.log(res);
      //    })
      //    .catch((err) => {
      //       console.log(err);
      //    });
      const permissionsToStore = [{ name: 'Admin Permissions' }, { name: 'Sales Permissiions' }].map(
         (p: any, i: number) => ({
            ...p,
            actionsConfig: { edit: true, delete: true, duplicate: true },
         })
      );
      setPermissions(permissionsToStore);
   }, []);

   const handleActionClick = ({ event, actionKey, item }: { event: Event; actionKey: string; item: any }) => {
      console.log(event, actionKey, item);
      switch (actionKey) {
         case 'edit':
            // route to the user's page using the item's id
            break;
         case 'delete':
            break;
         default:
            break;
      }
   };

   return (
      <div>
         <Table
            actions={[
               { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Permission Set', callback: handleActionClick },
               { icon: 'TrashCan', actionKey: 'delete', toolTip: 'Delete Permission Set', callback: handleActionClick },
               {
                  icon: 'Duplicate',
                  actionKey: 'duplicate',
                  toolTip: 'Duplicate Permission Set',
                  callback: handleActionClick,
               },
            ]}
            columns={columns}
            data={permissions}
         />
      </div>
   );
};

export default PermissionsSetsClient;
