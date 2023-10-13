'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // create page in db
      await queryInterface.bulkInsert('pagesLookup', [
         {
            id: '69ad3c08-ef8a-4f87-95c7-16cd843b7c29',
            name: 'My Notification List',
            iconName: 'Notes',
            iconColor: null,
            route: 'my-notification-list',
            parentPageId: 'f9b2c575-df0d-4cee-9946-16bbf0007bb7',
            displayOrder: 6,
            showOnSidebar: true,
         },
      ]);

      // since page permissions has length...
      const pagePermissions = [
         {
            id: 'ed7e9850-76e8-4472-ace4-52cecc3dcee0',
            archived: false,
            description: 'Default permission description...',
            isDefaultPermission: true,
            name: 'VIEW (Default Permission)',
            addPermissionToSuperAdmin: true,
            pageId: '69ad3c08-ef8a-4f87-95c7-16cd843b7c29',
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
            id: '8760e003-f7a0-4a55-ad77-d942c8d02593',
            permissionId: 'ed7e9850-76e8-4472-ace4-52cecc3dcee0',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: 'a61818e5-867e-47ef-97f5-aebede9751ba',
            permissionId: 'ed7e9850-76e8-4472-ace4-52cecc3dcee0',
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
      const pagePermissionsToRevert = ['ed7e9850-76e8-4472-ace4-52cecc3dcee0'];
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
      await queryInterface.bulkDelete('pagesLookup', { id: '69ad3c08-ef8a-4f87-95c7-16cd843b7c29' });
   },
};
