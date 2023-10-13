'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // create page in db
      await queryInterface.bulkInsert('pagesLookup', [
         {
            id: '956c3e87-2421-4c47-ace5-9333d2cc3362',
            name: 'Pitch Calendar',
            iconName: 'StarCalendar',
            iconColor: null,
            route: 'sales/pitch-calendar',
            parentPageId: 'a116d6dc-b5d4-43c2-99d5-56cf53da88d4',
            displayOrder: 1,
            showOnSidebar: true,
         },
      ]);

      // since page permissions has length...
      const pagePermissions = [
         {
            id: 'eda159ec-e137-4f44-a7a7-de954c9322d5',
            archived: false,
            description: 'Default permission description...',
            isDefaultPermission: true,
            name: 'VIEW (Default Permission)',
            addPermissionToSuperAdmin: true,
            pageId: '956c3e87-2421-4c47-ace5-9333d2cc3362',
            action: 'create',
         },
         {
            id: '4dcaab04-1be8-4a5a-80c8-6d58860f5ea5',
            name: 'Can view pitch calendar',
            description: 'User will have read access to pitch calendar',
            addPermissionToSuperAdmin: true,
            tempId: '382286',
            isDefaultPermission: false,
            archived: false,
            pageId: '956c3e87-2421-4c47-ace5-9333d2cc3362',
            action: 'create',
         },
      ];

      // loop through each permission & update the permission
      for (const permission of pagePermissions) {
         // handle archiving a permission
         if (permission.action === 'archive') {
            await queryInterface.bulkUpdate('permissions', { deletedAt: Date.now() }, { id: permission.id });
         }

         // handle updating a permission
         else if (permission.action === 'update') {
            await queryInterface.bulkUpdate(
               'permissions',
               {
                  name: permission.name,
                  description: permission.description,
                  isDefaultPermission: permission.isDefaultPermission,
                  pageId: permission.pageId,
               },
               { id: permission.id }
            );
         }

         // handle creating a permission
         else if (permission.action === 'create') {
            // make a copy of the permission
            const permissionCopy = {
               id: permission.id,
               name: permission.name,
               description: permission.description,
               isDefaultPermission: permission.isDefaultPermission,
               pageId: permission.pageId,
            };
            // create the permission & return it
            await queryInterface.bulkInsert('permissions', [permissionCopy]);
         }
      }

      // now attach permissions to the neccessary roles...
      const permissionsOnRoles = [
         {
            id: '63d61c90-1bd7-4dae-8fd6-c0148254e84b',
            permissionId: 'eda159ec-e137-4f44-a7a7-de954c9322d5',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: 'd116235e-3000-4033-83c7-8bea52c155b1',
            permissionId: 'eda159ec-e137-4f44-a7a7-de954c9322d5',
            roleId: 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6',
            action: 'create',
         },
         {
            id: '9d8dfad2-064f-4cc8-bb38-4daf08c3c529',
            permissionId: '4dcaab04-1be8-4a5a-80c8-6d58860f5ea5',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: '6bcb2f98-1a77-4837-81b0-acc0ccedd081',
            permissionId: '4dcaab04-1be8-4a5a-80c8-6d58860f5ea5',
            roleId: 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6',
            action: 'create',
         },
      ];

      // loop through each permission on role & add to db...
      for (const permissionOnRole of permissionsOnRoles) {
         // handle archiving a permission on role
         if (permissionOnRole?.action === 'archive') {
            await queryInterface.bulkUpdate(
               'permissionsOnRoles',
               { deletedAt: new Date() },
               { id: permissionOnRole.id }
            );
         }

         // handle creating a permission on role
         if (permissionOnRole?.action === 'create') {
            await queryInterface.bulkInsert('permissionsOnRoles', [
               {
                  id: permissionOnRole.id,
                  permissionId: permissionOnRole.permissionId,
                  roleId: permissionOnRole.roleId,
               },
            ]);
         }
      }
   },

   async down(queryInterface, Sequelize) {
      /** Add reverting commands here. */

      // permissionIds that need to be deleted from the db
      const pagePermissionsToRevert = ['eda159ec-e137-4f44-a7a7-de954c9322d5', '4dcaab04-1be8-4a5a-80c8-6d58860f5ea5'];
      for (const permissionId of pagePermissionsToRevert) {
         // delete the permissions on role by permissionId
         await queryInterface.bulkDelete('permissionsOnRoles', [{ permissionId: permissionId }]);
         // delete the permissionsTags on permissions by permissionId
         await queryInterface.bulkDelete('permissionTagsOnPermissions', [{ permissionId: permissionId }]);
         // delete the page permissions by id
         await queryInterface.bulkDelete('permissions', { id: permissionId });
      }
      // delete the created permissionTags by id
      const permissionTagIdsToDelete = [];
      for (const permissionTagId of permissionTagIdsToDelete) {
         await queryInterface.bulkDelete('permissionTagsLookup', { id: permissionTagId });
      }

      // delete the page created by id
      await queryInterface.bulkDelete('pagesLookup', { id: '956c3e87-2421-4c47-ace5-9333d2cc3362' });
   },
};
