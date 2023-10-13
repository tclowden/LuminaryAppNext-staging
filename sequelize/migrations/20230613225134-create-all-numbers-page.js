'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // create page in db
      await queryInterface.bulkInsert('pagesLookup', [
         {
            id: '951a3752-aff4-4b69-9a69-fb08b85a1a5d',
            name: 'All Numbers',
            iconName: null,
            iconColor: null,
            route: 'admin/all-numbers',
            archived: false,
            parentPageId: '6d0df293-410d-4079-904d-36c3fb786291',
            displayOrder: 1,
            showOnSidebar: true,
         },
      ]);

      // since page permissions has length...
      const pagePermissions = [
         {
            id: 'bf231ba5-1443-4441-97b5-06002eafb2d1',
            archived: false,
            description: "Allow user to access the 'All Numbers' page within the 'Phone Numbers' section.",
            isDefaultPermission: true,
            name: 'View All Numbers Page',
            addPermissionToSuperAdmin: true,
            pageId: '951a3752-aff4-4b69-9a69-fb08b85a1a5d',
            action: 'create',
         },
      ];

      // loop through each permission & update the permission
      for (const permission of pagePermissions) {
         // handle archiving a permission
         if (permission.action === 'archive') {
            await queryInterface.bulkUpdate('permissions', { archived: true }, { id: permission.id });
         }

         // handle updating a permission
         else if (permission.action === 'update') {
            await queryInterface.bulkUpdate(
               'permissions',
               {
                  name: permission.name,
                  description: permission.description,
                  isDefaultPermission: permission.isDefaultPermission,
                  archived: permission.archived,
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
               archived: permission.archived,
               pageId: permission.pageId,
            };
            // create the permission & return it
            await queryInterface.bulkInsert('permissions', [permissionCopy]);
         }
      }

      // now attach permissions to the neccessary roles...
      const permissionsOnRoles = [
         {
            id: 'a42a20f6-5fb3-4e3b-817c-9a85eca30e09',
            permissionId: 'bf231ba5-1443-4441-97b5-06002eafb2d1',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: '05a6bb8e-1f11-478b-8f89-c8ad8d63e534',
            permissionId: 'bf231ba5-1443-4441-97b5-06002eafb2d1',
            roleId: 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6',
            action: 'create',
         },
      ];

      // loop through each permission on role & add to db...
      for (const permissionOnRole of permissionsOnRoles) {
         // handle archiving a permission on role
         if (permissionOnRole?.action === 'archive') {
            await queryInterface.bulkUpdate('permissionsOnRoles', { archived: true }, { id: permissionOnRole.id });
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
      const pagePermissionsToRevert = ['bf231ba5-1443-4441-97b5-06002eafb2d1'];
      for (const permissionId of pagePermissionsToRevert) {
         // delete the permissions on role by permissionId
         await queryInterface.bulkDelete('permissionsOnRoles', [{ permissionId: permissionId }]);
         // // delete the permissionsTags on permissions by permissionId
         // await queryInterface.bulkDelete('permissionTagsOnPermissions', [{ permissionId: permissionId }]);
         // delete the page permissions by id
         await queryInterface.bulkDelete('permissions', { id: permissionId });
      }
      // // delete the created permissionTags by id
      // const permissionTagIdsToDelete = [];
      // for (const permissionTagId of permissionTagIdsToDelete) {
      //    await queryInterface.bulkDelete('permissionTagsLookup', { id: permissionTagId });
      // }

      // delete the page created by id
      await queryInterface.bulkDelete('pagesLookup', { id: '951a3752-aff4-4b69-9a69-fb08b85a1a5d' });
   },
};
