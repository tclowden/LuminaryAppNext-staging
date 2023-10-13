'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // update page and save to variable
      await queryInterface.bulkUpdate(
         'pagesLookup',
         {
            name: 'Dashboard',
            iconName: 'Dashboard',
            iconColor: null,
            route: 'dashboard',
            parentPageId: 'f9b2c575-df0d-4cee-9946-16bbf0007bb7',
            displayOrder: 1,
            showOnSidebar: true,
         },
         { id: '49a14b2d-afa0-4093-bc12-0715255abe7b' }
      );

      // since page permissions has length...
      const pagePermissions = [
         {
            id: 'bf84e430-536c-403b-98ed-b89850b346c0',
            name: 'View Dashboard Page',
            description: "Allow user to access the 'Dashboard' page within the 'My Luminary' app.",
            isDefaultPermission: true,
            oldId: null,
            deletedAt: null,
            pageId: '49a14b2d-afa0-4093-bc12-0715255abe7b',
            archived: false,
            action: 'update',
         },
         {
            id: 'ee5fa96f-e9b9-48ce-8d88-a85838021ad5',
            name: 'Can View Admin Dashboard',
            description: 'User can view the admin dashboard.',
            addPermissionToSuperAdmin: false,
            tempId: '364201',
            isDefaultPermission: false,
            archived: false,
            pageId: '49a14b2d-afa0-4093-bc12-0715255abe7b',
            action: 'create',
         },
         {
            id: 'eada8239-0617-4423-847a-f75dfee94cb0',
            name: 'Can view Sales Team Dashboard',
            description: 'Gives user permission to view the sales team dashboard with access to revenue data.',
            addPermissionToSuperAdmin: false,
            tempId: '558722',
            isDefaultPermission: false,
            archived: false,
            pageId: '49a14b2d-afa0-4093-bc12-0715255abe7b',
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
            id: '5e588d44-ff91-480a-ac62-86e8fa922510',
            permissionId: 'bf84e430-536c-403b-98ed-b89850b346c0',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'update',
         },
         {
            id: '6953849c-69c5-4119-b73c-a1562e45a641',
            permissionId: 'ee5fa96f-e9b9-48ce-8d88-a85838021ad5',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: 'da0a00dd-9fd8-4904-8b82-aff8f2d9362c',
            permissionId: 'eada8239-0617-4423-847a-f75dfee94cb0',
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

      // since page permissions has length... loop through each permission & update the permission
      const pagePermissionsPrevData = [
         {
            id: 'bf84e430-536c-403b-98ed-b89850b346c0',
            name: 'View Dashboard Page',
            description: "Allow user to access the 'Dashboard' page within the 'My Luminary' app.",
            isDefaultPermission: true,
            oldId: null,
            createdAt: '2023-09-14T18:21:24.239Z',
            updatedAt: '2023-09-14T18:21:24.239Z',
            deletedAt: null,
            pageId: '49a14b2d-afa0-4093-bc12-0715255abe7b',
            action: 'revert',
         },
         { id: 'ee5fa96f-e9b9-48ce-8d88-a85838021ad5', action: 'delete' },
         { id: 'eada8239-0617-4423-847a-f75dfee94cb0', action: 'delete' },
      ];

      // since tags on permissions has length... loop through each tag & update the tagOnPermission row
      const permissionsOnRolesPrevData = [
         {
            id: '5e588d44-ff91-480a-ac62-86e8fa922510',
            oldId: null,
            createdAt: '2023-09-14T18:21:24.247Z',
            updatedAt: '2023-09-14T18:21:24.247Z',
            deletedAt: null,
            permissionId: 'bf84e430-536c-403b-98ed-b89850b346c0',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'revert',
         },
         {
            id: '6953849c-69c5-4119-b73c-a1562e45a641',
            permissionId: 'ee5fa96f-e9b9-48ce-8d88-a85838021ad5',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'delete',
         },
         {
            id: 'da0a00dd-9fd8-4904-8b82-aff8f2d9362c',
            permissionId: 'eada8239-0617-4423-847a-f75dfee94cb0',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'delete',
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
         name: 'Dashboard',
         iconName: 'Dashboard',
         iconColor: null,
         route: 'dashboard',
         displayOrder: 1,
         showOnSidebar: true,
         oldId: null,
         createdAt: '2023-09-14T18:21:24.232Z',
         updatedAt: '2023-09-14T18:21:24.232Z',
         deletedAt: null,
         parentPageId: 'f9b2c575-df0d-4cee-9946-16bbf0007bb7',
      };
      await queryInterface.bulkUpdate('pagesLookup', prevPageData, { id: '49a14b2d-afa0-4093-bc12-0715255abe7b' });
   },
};
