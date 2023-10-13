'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // update page and save to variable
      await queryInterface.bulkUpdate(
         'pagesLookup',
         {
            name: 'Task',
            iconName: 'Notes',
            iconColor: null,
            route: 'admin/tasks/*',
            archived: false,
            parentPageId: '29d1b96f-4516-44e1-bf56-8fc2f2dec910',
            displayOrder: 18,
            showOnSidebar: false,
         },
         { id: '0731a2dc-d647-4d70-99fd-b9f268614e80' }
      );

      // since page permissions has length...
      const pagePermissions = [
         {
            id: '94f9de91-6303-4ac7-aa2a-d1a226f0bef0',
            name: 'View Product Task',
            description: 'Allow user to view a single product task',
            isDefaultPermission: true,
            archived: false,
            pageId: '0731a2dc-d647-4d70-99fd-b9f268614e80',
            action: 'update',
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
            id: '1357df43-37da-40a0-b8c6-956fc149230d',
            permissionId: '94f9de91-6303-4ac7-aa2a-d1a226f0bef0',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'update',
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

      // since page permissions has length... loop through each permission & update the permission
      const pagePermissionsPrevData = [
         {
            id: '94f9de91-6303-4ac7-aa2a-d1a226f0bef0',
            name: 'View Product Task',
            description: 'Allow user to view a single product task',
            isDefaultPermission: true,
            archived: false,
            createdAt: '2023-07-03T20:21:20.706Z',
            updatedAt: '2023-07-03T20:21:20.706Z',
            pageId: '0731a2dc-d647-4d70-99fd-b9f268614e80',
            action: 'revert',
         },
      ];

      // since tags on permissions has length... loop through each tag & update the tagOnPermission row
      const permissionsOnRolesPrevData = [
         {
            id: '1357df43-37da-40a0-b8c6-956fc149230d',
            archived: false,
            createdAt: '2023-07-03T20:21:20.709Z',
            updatedAt: '2023-07-03T20:21:20.709Z',
            permissionId: '94f9de91-6303-4ac7-aa2a-d1a226f0bef0',
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
         name: 'Task',
         iconName: 'Notes',
         iconColor: null,
         route: 'admin/tasks/*',
         displayOrder: 7,
         showOnSidebar: false,
         archived: false,
         createdAt: '2023-07-03T20:21:20.705Z',
         updatedAt: '2023-07-03T20:21:20.705Z',
         parentPageId: '747d14c6-81f0-4163-8217-600c24df295b',
      };
      await queryInterface.bulkUpdate('pagesLookup', prevPageData, { id: '0731a2dc-d647-4d70-99fd-b9f268614e80' });
   },
};
