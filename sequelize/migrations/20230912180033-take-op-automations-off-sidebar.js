'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // update page and save to variable
      await queryInterface.bulkUpdate(
         'pagesLookup',
         {
            name: 'Automations',
            iconName: 'PageBrowser',
            iconColor: null,
            route: 'admin/ops-automations',
            parentPageId: '29d1b96f-4516-44e1-bf56-8fc2f2dec910',
            displayOrder: 19,
            showOnSidebar: false,
         },
         { id: '30a752c0-83c5-4d45-92ff-ef636c1785d9' }
      );

      // since page permissions has length...
      const pagePermissions = [
         {
            id: 'b87dbae8-b875-4eab-a351-781dfaba94d8',
            name: 'VIEW (Default Permission)',
            description: 'Default permission description...',
            isDefaultPermission: true,
            oldId: null,
            deletedAt: null,
            pageId: '30a752c0-83c5-4d45-92ff-ef636c1785d9',
            archived: false,
            action: 'update',
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
            id: '3e77872d-a5fa-4895-9444-26861cc9d9ac',
            permissionId: 'b87dbae8-b875-4eab-a351-781dfaba94d8',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'update',
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

      // since page permissions has length... loop through each permission & update the permission
      const pagePermissionsPrevData = [
         {
            id: 'b87dbae8-b875-4eab-a351-781dfaba94d8',
            name: 'VIEW (Default Permission)',
            description: 'Default permission description...',
            isDefaultPermission: true,
            oldId: null,
            createdAt: '2023-09-05T19:55:18.635Z',
            updatedAt: '2023-09-05T19:55:18.635Z',
            deletedAt: null,
            pageId: '30a752c0-83c5-4d45-92ff-ef636c1785d9',
            action: 'revert',
         },
      ];

      // since tags on permissions has length... loop through each tag & update the tagOnPermission row
      const permissionsOnRolesPrevData = [
         {
            id: '3e77872d-a5fa-4895-9444-26861cc9d9ac',
            oldId: null,
            createdAt: '2023-09-05T19:55:18.669Z',
            updatedAt: '2023-09-05T19:55:18.669Z',
            deletedAt: null,
            permissionId: 'b87dbae8-b875-4eab-a351-781dfaba94d8',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'revert',
         },
      ];

      // loop through each permission & revert the previous db save
      for (const permissionOnRole of permissionsOnRolesPrevData) {
         // handle deleting a permission that was just created
         if (permissionOnRole.action === 'delete') {
            await queryInterface.bulkDelete('permissionsOnRoles', {
               permissionId: permissionOnRole?.permissionId,
               roleId: permissionOnRole?.roleId,
            });
         }

         // handle reverting a permission that was just altered
         else if (permissionOnRole.action === 'revert') {
            const roleOnPermissionCopy = { ...JSON.parse(JSON.stringify(permissionOnRole)) };
            // delete unneccesary keys
            delete roleOnPermissionCopy['action'];
            await queryInterface.bulkUpdate('permissionsOnRoles', roleOnPermissionCopy, { id: permissionOnRole?.id });
         }
      }

      // loop through each permission & revert the previous db save
      for (const permission of pagePermissionsPrevData) {
         // handle deleting a permission that was just created
         if (permission.action === 'delete') {
            await queryInterface.bulkDelete('permissions', { id: permission?.id });
         }

         // handle reverting a permission that was just altered
         else if (permission.action === 'revert') {
            const permissionToAlterCopy = { ...JSON.parse(JSON.stringify(permission)) };
            // delete unneccesary keys
            delete permissionToAlterCopy['action'];
            delete permissionToAlterCopy['id'];
            delete permissionToAlterCopy['rowId'];
            await queryInterface.bulkUpdate('permissions', permissionToAlterCopy, { id: permission.id });
         }
      }

      // previous page data
      const prevPageData = {
         name: 'Automations',
         iconName: 'PageBrowser',
         iconColor: null,
         route: 'admin/ops-automations',
         displayOrder: 19,
         showOnSidebar: true,
         oldId: null,
         createdAt: '2023-09-05T19:55:18.625Z',
         updatedAt: '2023-09-05T19:55:18.625Z',
         deletedAt: null,
         parentPageId: '29d1b96f-4516-44e1-bf56-8fc2f2dec910',
      };
      await queryInterface.bulkUpdate('pagesLookup', prevPageData, { id: '30a752c0-83c5-4d45-92ff-ef636c1785d9' });
   },
};
