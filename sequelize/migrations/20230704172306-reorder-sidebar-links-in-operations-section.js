'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // update page and save to variable
      await queryInterface.bulkUpdate(
         'pagesLookup',
         {
            name: 'Operations',
            iconName: 'FolderClosed',
            iconColor: null,
            route: null,
            archived: false,
            parentPageId: '86964522-f161-4891-9744-f31647f1ebe2',
            displayOrder: 3,
            showOnSidebar: true,
         },
         { id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' }
      );

      // since page children pages has length... loop through each pages & update the displayOrder
      const childrenPages = [
         { id: '932f6708-4308-4af2-9e94-d61b69c0b80c', name: 'Teams', displayOrder: 1 },
         { id: '0379474d-8a6a-48f9-8b98-36d0f3f405fc', name: 'Utility Companies', displayOrder: 2 },
         { id: '950ff278-03ea-4baa-85eb-6a3d527a4bf6', name: 'Product Fields', displayOrder: 3 },
         { id: '7fb82496-4c51-4190-86a2-a2a8e9329847', name: 'Coordinators', displayOrder: 4 },
         { id: '0a601c36-c034-4257-8498-dda845b26e05', name: 'Stages', displayOrder: 5 },
         { id: 'ea572886-a3cd-4424-b7be-f44426729388', name: 'Tasks', displayOrder: 6 },
         { id: '8b3f89a6-b472-48a0-baab-b33afcd0a6ad', name: 'Products', displayOrder: 7 },
         { id: 'd0599083-a6d1-4030-8c16-aa39633d3e7d', name: 'Proposal Settings', displayOrder: 8 },
         { id: 'ffac6083-46fd-422f-96da-22c6e14c0454', name: 'Financiers', displayOrder: 9 },
      ];

      // loop through all the page permissions to create / update
      for (const page of childrenPages) {
         await queryInterface.bulkUpdate('pagesLookup', { displayOrder: page?.displayOrder }, { id: page?.id });
      }

      // since page permissions has length...
      const pagePermissions = [
         {
            id: 'cfdbdcef-93ca-4ffa-953c-c31ae375b352',
            name: 'View Operations Section',
            description: "Allow user to access the 'Operations' section within the 'Admin' app.",
            isDefaultPermission: true,
            archived: false,
            pageId: '29d1b96f-4516-44e1-bf56-8fc2f2dec910',
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
            id: '420778aa-6c9b-4da9-9c49-b592a6dfd188',
            permissionId: 'cfdbdcef-93ca-4ffa-953c-c31ae375b352',
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

      // since page children pages has length... loop through each pages & update the revert back the displayOrder
      const childrenPagesPrevData = [
         { id: '932f6708-4308-4af2-9e94-d61b69c0b80c', name: 'Teams', displayOrder: 1 },
         { id: '0379474d-8a6a-48f9-8b98-36d0f3f405fc', name: 'Utility Companies', displayOrder: 3 },
         { id: '950ff278-03ea-4baa-85eb-6a3d527a4bf6', name: 'Product Fields', displayOrder: 5 },
         { id: '7fb82496-4c51-4190-86a2-a2a8e9329847', name: 'Coordinators', displayOrder: 7 },
         { id: '8b3f89a6-b472-48a0-baab-b33afcd0a6ad', name: 'Products', displayOrder: 11 },
         { id: 'd0599083-a6d1-4030-8c16-aa39633d3e7d', name: 'Proposal Settings', displayOrder: 13 },
         { id: 'ffac6083-46fd-422f-96da-22c6e14c0454', name: 'Financiers', displayOrder: 15 },
         { id: '0a601c36-c034-4257-8498-dda845b26e05', name: 'Stages', displayOrder: 9 },
         { id: 'ea572886-a3cd-4424-b7be-f44426729388', name: 'Tasks', displayOrder: 17 },
      ];

      // loop through all the page permissions to create / update
      for (const page of childrenPagesPrevData) {
         await queryInterface.bulkUpdate('pagesLookup', { displayOrder: page?.displayOrder }, { id: page?.id });
      }

      // since page permissions has length... loop through each permission & update the permission
      const pagePermissionsPrevData = [
         {
            id: 'cfdbdcef-93ca-4ffa-953c-c31ae375b352',
            name: 'View Operations Section',
            description: "Allow user to access the 'Operations' section within the 'Admin' app.",
            isDefaultPermission: true,
            archived: false,
            createdAt: '2023-06-21T18:18:29.236Z',
            updatedAt: '2023-06-21T18:18:29.236Z',
            pageId: '29d1b96f-4516-44e1-bf56-8fc2f2dec910',
            action: 'revert',
         },
      ];

      // since tags on permissions has length... loop through each tag & update the tagOnPermission row
      const permissionsOnRolesPrevData = [
         {
            id: '420778aa-6c9b-4da9-9c49-b592a6dfd188',
            archived: false,
            createdAt: '2023-06-21T18:18:29.241Z',
            updatedAt: '2023-06-21T18:18:29.241Z',
            permissionId: 'cfdbdcef-93ca-4ffa-953c-c31ae375b352',
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
         name: 'Operations',
         iconName: 'FolderClosed',
         iconColor: null,
         route: null,
         displayOrder: 3,
         showOnSidebar: true,
         archived: false,
         createdAt: '2023-06-21T18:18:29.230Z',
         updatedAt: '2023-06-21T18:18:29.230Z',
         parentPageId: '86964522-f161-4891-9744-f31647f1ebe2',
      };
      await queryInterface.bulkUpdate('pagesLookup', prevPageData, { id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' });
   },
};
