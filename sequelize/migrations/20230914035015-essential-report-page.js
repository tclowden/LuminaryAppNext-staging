'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // create page in db
      await queryInterface.bulkInsert('pagesLookup', [
         {
            id: '63319854-3353-4515-ae29-a04d5689e0d2',
            name: 'The Essentials',
            iconName: null,
            iconColor: null,
            route: 'analytics/the-essentials',
            parentPageId: '767a5807-fc12-4b78-9a19-c71ac4b9137c',
            displayOrder: 1,
            showOnSidebar: true,
         },
      ]);

      // since page permissions has length...
      const pagePermissions = [
         {
            id: '58ac0e92-f8d0-4e32-8c90-5363a04f5582',
            archived: false,
            description: 'Default permission description...',
            isDefaultPermission: true,
            name: 'VIEW (Default Permission)',
            addPermissionToSuperAdmin: true,
            pageId: '63319854-3353-4515-ae29-a04d5689e0d2',
            action: 'create',
         },
         {
            id: '4cd5b674-042b-4e46-9f5d-830181ec8f70',
            name: 'Can view the essentials report',
            description: 'User has access to the essentials report page',
            addPermissionToSuperAdmin: false,
            tempId: '907670',
            isDefaultPermission: false,
            archived: false,
            pageId: '63319854-3353-4515-ae29-a04d5689e0d2',
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
            id: 'f3451797-15a7-4b91-be4e-88bd3fc6c4cb',
            permissionId: '58ac0e92-f8d0-4e32-8c90-5363a04f5582',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: 'c6820504-b3d4-4aed-bb46-a42ecf85720f',
            permissionId: '58ac0e92-f8d0-4e32-8c90-5363a04f5582',
            roleId: 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6',
            action: 'create',
         },
         {
            id: '398342e5-d767-4d5e-986d-7a9c8a36a636',
            permissionId: '4cd5b674-042b-4e46-9f5d-830181ec8f70',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
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
      const pagePermissionsToRevert = ['58ac0e92-f8d0-4e32-8c90-5363a04f5582', '4cd5b674-042b-4e46-9f5d-830181ec8f70'];
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
      await queryInterface.bulkDelete('pagesLookup', { id: '63319854-3353-4515-ae29-a04d5689e0d2' });
   },
};
