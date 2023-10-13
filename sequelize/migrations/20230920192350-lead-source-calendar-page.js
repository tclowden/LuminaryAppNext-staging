'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // create page in db
      await queryInterface.bulkInsert('pagesLookup', [
         {
            id: 'f340b9c4-9e2b-4862-ad0b-f88082bf0342',
            name: 'Lead Source Calendar',
            iconName: 'Calendar',
            iconColor: null,
            route: 'admin/lead-source-calendar',
            parentPageId: '2b52758c-b72f-4dca-b9b3-c176c10b5064',
            displayOrder: 4,
            showOnSidebar: true,
         },
      ]);

      // since page permissions has length...
      const pagePermissions = [
         {
            id: 'b5271369-e04b-4f99-afb3-d59c52af7b68',
            archived: false,
            description: 'Default permission description...',
            isDefaultPermission: true,
            name: 'VIEW (Default Permission)',
            addPermissionToSuperAdmin: true,
            pageId: 'f340b9c4-9e2b-4862-ad0b-f88082bf0342',
            action: 'create',
         },
         {
            id: 'f30f9385-443d-4105-ab37-6c59a4d16589',
            name: 'Can view lead source calendar',
            description: 'Can view the lead source calendar',
            addPermissionToSuperAdmin: true,
            tempId: '551432',
            isDefaultPermission: false,
            archived: false,
            pageId: 'f340b9c4-9e2b-4862-ad0b-f88082bf0342',
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
            id: '7a2711fd-ee79-4742-a5a0-3764e65345ca',
            permissionId: 'b5271369-e04b-4f99-afb3-d59c52af7b68',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: 'e9df1461-8c50-4435-8fa4-e6a926a274a6',
            permissionId: 'b5271369-e04b-4f99-afb3-d59c52af7b68',
            roleId: 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6',
            action: 'create',
         },
         {
            id: '91bbab47-45b7-4647-a985-c6dad10893e3',
            permissionId: 'f30f9385-443d-4105-ab37-6c59a4d16589',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: 'f51f4410-4124-4f95-9a82-bf8635cea064',
            permissionId: 'f30f9385-443d-4105-ab37-6c59a4d16589',
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
      const pagePermissionsToRevert = ['b5271369-e04b-4f99-afb3-d59c52af7b68', 'f30f9385-443d-4105-ab37-6c59a4d16589'];
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
      await queryInterface.bulkDelete('pagesLookup', { id: 'f340b9c4-9e2b-4862-ad0b-f88082bf0342' });
   },
};
