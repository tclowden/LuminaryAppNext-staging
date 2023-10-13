'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // create page in db
      await queryInterface.bulkInsert('pagesLookup', [
         {
            id: '4f0e3443-2e54-46f8-9276-26321c3c140c',
            name: 'Acquisition Report',
            iconName: null,
            iconColor: null,
            route: 'analytics/acquisition-report',
            parentPageId: '767a5807-fc12-4b78-9a19-c71ac4b9137c',
            displayOrder: 2,
            showOnSidebar: true,
         },
      ]);

      // since page permissions has length...
      const pagePermissions = [
         {
            id: '869c961a-15c2-49f6-b5a5-94336d044015',
            archived: false,
            description: 'Default permission description...',
            isDefaultPermission: true,
            name: 'VIEW (Default Permission)',
            addPermissionToSuperAdmin: true,
            pageId: '4f0e3443-2e54-46f8-9276-26321c3c140c',
            action: 'create',
         },
         {
            id: 'b5da68a2-94da-40c5-8b99-5b8579e00f0c',
            name: 'Can view acquisition report',
            description: 'Can view acquisition report',
            addPermissionToSuperAdmin: true,
            tempId: '697225',
            isDefaultPermission: false,
            archived: false,
            pageId: '4f0e3443-2e54-46f8-9276-26321c3c140c',
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
            id: '7df40bf7-ebeb-411c-8f80-cb05531c79df',
            permissionId: '869c961a-15c2-49f6-b5a5-94336d044015',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: 'f63b5c8c-b991-49a1-9474-52dcc1171a55',
            permissionId: '869c961a-15c2-49f6-b5a5-94336d044015',
            roleId: 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6',
            action: 'create',
         },
         {
            id: 'aa759348-f777-45cb-8310-e02e1aa021d7',
            permissionId: 'b5da68a2-94da-40c5-8b99-5b8579e00f0c',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: 'd2e8f043-7c92-40bb-8d5b-ccb193f2bb5a',
            permissionId: 'b5da68a2-94da-40c5-8b99-5b8579e00f0c',
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
      const pagePermissionsToRevert = ['869c961a-15c2-49f6-b5a5-94336d044015', 'b5da68a2-94da-40c5-8b99-5b8579e00f0c'];
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
      await queryInterface.bulkDelete('pagesLookup', { id: '4f0e3443-2e54-46f8-9276-26321c3c140c' });
   },
};
