'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // create page in db
      await queryInterface.bulkInsert('pagesLookup', [
         {
            id: 'f5fd95d4-9962-4ff1-a3a9-fa43bfce046b',
            name: 'Settings',
            iconName: 'Gear',
            iconColor: null,
            route: 'admin/settings',
            parentPageId: '747d14c6-81f0-4163-8217-600c24df295b',
            displayOrder: 7,
            showOnSidebar: true,
         },
      ]);

      // since page permissions has length...
      const pagePermissions = [
         {
            id: '9d7c3a50-68d8-49d6-9043-09b0c918a4c4',
            archived: false,
            description: 'Default permission description...',
            isDefaultPermission: true,
            name: 'VIEW (Default Permission)',
            addPermissionToSuperAdmin: true,
            pageId: 'f5fd95d4-9962-4ff1-a3a9-fa43bfce046b',
            action: 'create',
         },
         {
            id: 'b6223df1-624d-447c-9f0b-40aa1a4d5b22',
            name: 'Can edit organization settings',
            description: 'Allows the user to edit the organizational settings',
            addPermissionToSuperAdmin: true,
            tempId: '130888',
            isDefaultPermission: false,
            archived: false,
            pageId: 'f5fd95d4-9962-4ff1-a3a9-fa43bfce046b',
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
            id: '40483118-cfd9-4ac4-9cee-40a210ab9c63',
            permissionId: '9d7c3a50-68d8-49d6-9043-09b0c918a4c4',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: 'ffd382a2-d1f4-4adf-84a0-590c6996b6be',
            permissionId: '9d7c3a50-68d8-49d6-9043-09b0c918a4c4',
            roleId: 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6',
            action: 'create',
         },
         {
            id: 'cfe01d10-30e6-4522-9e9e-213878d30603',
            permissionId: 'b6223df1-624d-447c-9f0b-40aa1a4d5b22',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: 'eb8bd486-1aca-49a7-94b4-95db093b6d9d',
            permissionId: 'b6223df1-624d-447c-9f0b-40aa1a4d5b22',
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
      const pagePermissionsToRevert = ['9d7c3a50-68d8-49d6-9043-09b0c918a4c4', 'b6223df1-624d-447c-9f0b-40aa1a4d5b22'];
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
      await queryInterface.bulkDelete('pagesLookup', { id: 'f5fd95d4-9962-4ff1-a3a9-fa43bfce046b' });
   },
};
