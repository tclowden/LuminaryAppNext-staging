'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // update page and save to variable
      await queryInterface.bulkUpdate(
         'pagesLookup',
         {
            name: 'Roles',
            iconName: 'PageBrowser',
            iconColor: null,
            route: 'admin/roles',
            archived: false,
            parentPageId: '747d14c6-81f0-4163-8217-600c24df295b',
            displayOrder: 3,
            showOnSidebar: true,
         },
         { id: '3fe7b159-2188-4638-ae7e-3bae45c4e430' }
      );

      // since page permissions has length...
      const pagePermissions = [
         {
            name: 'View Roles Page',
            id: 'c82fcf42-d7c5-4468-bd53-870b8c2931ff',
            description: "Allow user to access the 'Roles' page within the 'Organization' section.",
            isDefaultPermission: true,
            archived: false,
            pageId: '3fe7b159-2188-4638-ae7e-3bae45c4e430',
            action: 'update',
         },
         {
            id: '90332e64-2449-4fb0-a9e7-ba86c50470b1',
            name: 'Create role',
            description: 'Allow user to create a role',
            addPermissionToSuperAdmin: true,
            tempId: '173017',
            isDefaultPermission: false,
            archived: false,
            pageId: '3fe7b159-2188-4638-ae7e-3bae45c4e430',
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

      // since tags on permissions has length... loop through each tag & and see if the tag needs to be created or not
      const permissionTags = [
         { id: 'f87f38c1-4ff7-435c-9c7e-2a51a6f7f5e0', name: 'role', archived: false, action: 'create' },
         { id: '3c3eae19-ca25-4e20-8295-c8d149e2d390', name: 'create', archived: false, action: 'create' },
      ];

      // since tags on permissions has length... loop through each tag for the permission & update the tagOnPermission row
      const tagsOnPermission = [
         {
            permissionTagId: 'f87f38c1-4ff7-435c-9c7e-2a51a6f7f5e0',
            id: '0f2e3054-921d-4b11-a08a-25cfcb2cc941',
            archived: false,
            permissionId: '90332e64-2449-4fb0-a9e7-ba86c50470b1',
            action: 'create',
         },
         {
            permissionTagId: '3c3eae19-ca25-4e20-8295-c8d149e2d390',
            id: '099ab325-5cd1-4a5e-ab9f-718c5340465b',
            archived: false,
            permissionId: '90332e64-2449-4fb0-a9e7-ba86c50470b1',
            action: 'create',
         },
      ];

      //
      for (const permissionTag of permissionTags) {
         // handle creating a permission tag if needed
         if (permissionTag?.action === 'create') {
            // before creating, let's make sure it doesn't already exist in the database by name
            // if it does, overwrite the current id with the id in the database inside the permissionTagsOnPermissions obj
            // this allows the migration to make sure there aren't any duplicate permission tags...
            // Ex) Matt Rapp creates a migration locally adding a tag name = 'product' & Mark Davenport does the same... when running both migrations, should only add one of the permission tags, but share it across both permissions
            const permissionTagExists = await queryInterface
               .select(null, 'permissionTagsLookup', { where: { name: permissionTag.name } })
               .then((res) => JSON.parse(JSON.stringify(res)));
            if (!!permissionTagExists && !!permissionTagExists.length) {
               // if here, the permissionTag already exists in the db by name
               // find the permissionTagId inside the tagsOnPermissions array & replace it with the first one the permissionTagExists arr
               const tagOnPermIndex = tagsOnPermission.findIndex(
                  (tagOnPerm) => tagOnPerm.permissionTagId === permissionTag.id
               );
               // if not found... just move on through the loop with the next permissionTag
               if (tagOnPermIndex === -1) continue;
               tagsOnPermission[tagOnPermIndex] = permissionTagExists[0].id;
            } else {
               // if here, the permissionTag doesn't exists in the db by name
               // create the permission tag.. the id already exists in the tagsOnPermissionsArr... so no need to add it to the array
               await queryInterface.bulkInsert('permissionTagsLookup', [
                  { id: permissionTag.id, name: permissionTag.name },
               ]);
            }
         }
      }

      // loop through each tag on permission & update the tag on permission row
      for (const tagOnPermission of tagsOnPermission) {
         // handle archiving a tag on permission
         if (tagOnPermission.action === 'archive') {
            await queryInterface.bulkUpdate(
               'permissionTagsOnPermissions',
               { archived: true },
               { id: tagOnPermission.id }
            );
         }

         // handle creating a tag on permission
         else if (tagOnPermission.action === 'create') {
            await queryInterface.bulkInsert(
               'permissionTagsOnPermissions',
               [
                  {
                     id: tagOnPermission.id,
                     permissionId: tagOnPermission.permissionId,
                     permissionTagId: tagOnPermission.permissionTagId,
                  },
               ],
               { id: tagOnPermission.id }
            );
         }
      }

      // now attach permissions to the neccessary roles...
      const permissionsOnRoles = [
         {
            id: '3e44b757-9fd3-4304-b0cf-74627cae1c3c',
            permissionId: 'c82fcf42-d7c5-4468-bd53-870b8c2931ff',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'update',
         },
         {
            id: 'c205cefa-a5ef-457a-bd49-2a839b09a085',
            permissionId: '90332e64-2449-4fb0-a9e7-ba86c50470b1',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: 'feffafd8-cee6-4620-99c7-d2dffa7123c4',
            permissionId: '90332e64-2449-4fb0-a9e7-ba86c50470b1',
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

      // since page permissions has length... loop through each permission & update the permission
      const pagePermissionsPrevData = [
         {
            name: 'View Roles Page',
            id: 'c82fcf42-d7c5-4468-bd53-870b8c2931ff',
            description: "Allow user to access the 'Roles' page within the 'Organization' section.",
            isDefaultPermission: true,
            archived: false,
            createdAt: '2023-06-05T17:59:28.035Z',
            updatedAt: '2023-06-05T17:59:28.035Z',
            pageId: '3fe7b159-2188-4638-ae7e-3bae45c4e430',
            action: 'revert',
         },
         { id: '90332e64-2449-4fb0-a9e7-ba86c50470b1', action: 'delete' },
      ];

      // since tags on permissions has length... loop through each tag & revert the tag or delete the tag
      const permissionTagsPrevData = [
         { id: 'f87f38c1-4ff7-435c-9c7e-2a51a6f7f5e0', name: 'role', archived: false, action: 'delete' },
         { id: '3c3eae19-ca25-4e20-8295-c8d149e2d390', name: 'create', archived: false, action: 'delete' },
      ];

      // since tags on permissions has length... loop through each tag & update the tagOnPermission row
      const tagsOnPermissionsPrevData = [
         {
            id: '0f2e3054-921d-4b11-a08a-25cfcb2cc941',
            permissionId: '90332e64-2449-4fb0-a9e7-ba86c50470b1',
            action: 'delete',
         },
         {
            id: '099ab325-5cd1-4a5e-ab9f-718c5340465b',
            permissionId: '90332e64-2449-4fb0-a9e7-ba86c50470b1',
            action: 'delete',
         },
      ];

      // since tags on permissions has length... loop through each tag & update the tagOnPermission row
      const permissionsOnRolesPrevData = [
         {
            id: '3e44b757-9fd3-4304-b0cf-74627cae1c3c',
            archived: false,
            createdAt: '2023-06-05T17:59:28.088Z',
            updatedAt: '2023-06-05T17:59:28.088Z',
            permissionId: 'c82fcf42-d7c5-4468-bd53-870b8c2931ff',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'revert',
         },
         {
            id: 'c205cefa-a5ef-457a-bd49-2a839b09a085',
            permissionId: '90332e64-2449-4fb0-a9e7-ba86c50470b1',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'delete',
         },
         {
            id: 'feffafd8-cee6-4620-99c7-d2dffa7123c4',
            permissionId: '90332e64-2449-4fb0-a9e7-ba86c50470b1',
            roleId: 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6',
            action: 'delete',
         },
      ];

      // loop through each tag on permission & revert the previous db save
      for (const tagOnPermission of tagsOnPermissionsPrevData) {
         // handle deleting a tag on permission that was just created
         if (tagOnPermission.action === 'delete') {
            await queryInterface.bulkDelete('permissionTagsOnPermissions', { id: tagOnPermission?.id });
         }

         // handle reverting a permission that was just altered
         else if (tagOnPermission.action === 'revert') {
            const tagToAlterCopy = { ...JSON.parse(JSON.stringify(tagOnPermission)) };
            // delete unneccesary keys
            delete tagToAlterCopy['action'];
            delete tagToAlterCopy['id'];
            delete tagToAlterCopy['permissionTag'];
            await queryInterface.bulkUpdate('permissionTagsOnPermissions', tagToAlterCopy, { id: tagOnPermission?.id });
         }
      }

      // loop through each tag & revert or delete the previous db save
      for (const permissionTag of permissionTagsPrevData) {
         // handle deleting a tag that was just created
         // we don't need to worry about reverting it... because you can't update a permissionTag as of now
         if (permissionTag?.action === 'delete') {
            await queryInterface.bulkDelete('permissionTagsLookup', { id: permissionTag?.id });
         }
      }

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
            await queryInterface.bulkUpdate('permissions', permissionToAlterCopy, { id: permission.id });
         }
      }

      // previous page data
      const prevPageData = {
         name: 'Roles',
         iconName: 'PageBrowser',
         iconColor: null,
         route: 'admin/roles',
         displayOrder: 3,
         showOnSidebar: true,
         archived: false,
         createdAt: '2023-06-05T17:59:27.908Z',
         updatedAt: '2023-06-05T17:59:27.908Z',
         parentPageId: '747d14c6-81f0-4163-8217-600c24df295b',
      };
      await queryInterface.bulkUpdate('pagesLookup', prevPageData, { id: '3fe7b159-2188-4638-ae7e-3bae45c4e430' });
   },
};
