'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // create page in db
      await queryInterface.bulkInsert('pagesLookup', [
         {
            id: 'cb59b411-c37e-4924-9d9f-81a32c058729',
            name: 'Install Calendar',
            iconName: 'Calendar',
            iconColor: null,
            route: 'installs/install-calendar',
            parentPageId: '5a758c4c-1361-41f2-a993-30333a029f7b',
            displayOrder: 5,
            showOnSidebar: true,
         },
      ]);

      // since page permissions has length...
      const pagePermissions = [
         {
            id: 'ffa2e4e1-85b7-4d8b-9898-97532221fef6',
            archived: false,
            description: 'Default permission description...',
            isDefaultPermission: true,
            name: 'VIEW (Default Permission)',
            addPermissionToSuperAdmin: true,
            pageId: 'cb59b411-c37e-4924-9d9f-81a32c058729',
            action: 'create',
         },
         {
            id: 'ff2722e6-8ead-458b-a4d9-2ac991603d4f',
            name: 'Can view install calendar',
            description: 'read access to the calendar',
            addPermissionToSuperAdmin: true,
            tempId: '321123',
            isDefaultPermission: false,
            archived: false,
            pageId: 'cb59b411-c37e-4924-9d9f-81a32c058729',
            action: 'create',
         },
         {
            id: '60338ce4-864d-46bc-bf18-c8d02ce9e30d',
            name: 'Can create install appointments',
            description: 'User will be able to schedule appointments on the install calendar',
            addPermissionToSuperAdmin: true,
            tempId: '681682',
            isDefaultPermission: false,
            archived: false,
            pageId: 'cb59b411-c37e-4924-9d9f-81a32c058729',
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
            id: 'a44faeff-4017-402f-a256-032bdd8a276d',
            permissionId: 'ffa2e4e1-85b7-4d8b-9898-97532221fef6',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: 'c98a1846-1478-4c31-889e-a7d71d0b97fe',
            permissionId: 'ffa2e4e1-85b7-4d8b-9898-97532221fef6',
            roleId: 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6',
            action: 'create',
         },
         {
            id: '95eba9f0-b830-4a62-9ba6-b726e52d6ef1',
            permissionId: 'ff2722e6-8ead-458b-a4d9-2ac991603d4f',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: '326aadae-5ba0-4693-bc7f-028fb2e021b9',
            permissionId: 'ff2722e6-8ead-458b-a4d9-2ac991603d4f',
            roleId: 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6',
            action: 'create',
         },
         {
            id: '7b762759-d727-4b0e-9401-c8625eedadf4',
            permissionId: '60338ce4-864d-46bc-bf18-c8d02ce9e30d',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: '63979d9e-01b4-49ad-8299-b8d7b93077cf',
            permissionId: '60338ce4-864d-46bc-bf18-c8d02ce9e30d',
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
      const pagePermissionsToRevert = [
         'ffa2e4e1-85b7-4d8b-9898-97532221fef6',
         'ff2722e6-8ead-458b-a4d9-2ac991603d4f',
         '60338ce4-864d-46bc-bf18-c8d02ce9e30d',
      ];
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
      await queryInterface.bulkDelete('pagesLookup', { id: 'cb59b411-c37e-4924-9d9f-81a32c058729' });
   },
};
