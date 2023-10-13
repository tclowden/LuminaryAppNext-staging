'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // create page in db
      await queryInterface.bulkInsert('pagesLookup', [
         {
            id: '1b312177-f33e-415f-b53e-e7c1f518975f',
            name: 'Manual Dial',
            iconName: 'PhoneKeys',
            iconColor: null,
            route: 'manual-dial',
            archived: false,
            parentPageId: 'f9b2c575-df0d-4cee-9946-16bbf0007bb7',
            displayOrder: 2,
            showOnSidebar: true,
         },
      ]);

      // since page permissions has length...
      const pagePermissions = [
         {
            id: 'f4e0f14c-d5fa-4365-9842-e2d22a90454c',
            archived: false,
            description: 'Allow user to access the manual dial page',
            isDefaultPermission: true,
            name: 'View Manual Dial Page',
            addPermissionToSuperAdmin: true,
            pageId: '1b312177-f33e-415f-b53e-e7c1f518975f',
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
      // const permissionTags = [
      //    {
      //       id: '11501ea5-2e28-4f85-b33b-416f9de702ca',
      //       name: 'view',
      //       archived: false,
      //       action: 'create',
      //    },
      //    {
      //       id: 'a2f88012-80d0-4da5-b931-bd8b47b027fd',
      //       name: 'phone',
      //       archived: false,
      //       action: 'create',
      //    },
      // ];

      // // since tags on permissions has length... loop through each tag for the permission & update the tagOnPermission row
      // const tagsOnPermission = [
      //    {
      //       permissionTagId: '11501ea5-2e28-4f85-b33b-416f9de702ca',
      //       id: '08aee919-e2fd-494e-9af5-074b8aaa05e2',
      //       archived: false,
      //       permissionId: 'f4e0f14c-d5fa-4365-9842-e2d22a90454c',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: 'a2f88012-80d0-4da5-b931-bd8b47b027fd',
      //       id: '58549e44-67d2-46a2-a56c-1a87e996607c',
      //       archived: false,
      //       permissionId: 'f4e0f14c-d5fa-4365-9842-e2d22a90454c',
      //       action: 'create',
      //    },
      // ];

      // //
      // for (const permissionTag of permissionTags) {
      //    // handle creating a permission tag if needed
      //    if (permissionTag?.action === 'create') {
      //       // before creating, let's make sure it doesn't already exist in the database by name
      //       // if it does, overwrite the current id with the id in the database inside the permissionTagsOnPermissions obj
      //       // this allows the migration to make sure there aren't any duplicate permission tags...
      //       // Ex) Matt Rapp creates a migration locally adding a tag name = 'product' & Mark Davenport does the same... when running both migrations, should only add one of the permission tags, but share it across both permissions
      //       const permissionTagExists = await queryInterface
      //          .select(null, 'permissionTagsLookup', {
      //             where: { name: permissionTag.name },
      //          })
      //          .then((res) => JSON.parse(JSON.stringify(res)));
      //       if (!!permissionTagExists && !!permissionTagExists.length) {
      //          // if here, the permissionTag already exists in the db by name
      //          // find the permissionTagId inside the tagsOnPermissions array & replace it with the first one the permissionTagExists arr
      //          const tagOnPermIndex = tagsOnPermission.findIndex(
      //             (tagOnPerm) => tagOnPerm.permissionTagId === permissionTag.id
      //          );
      //          // if not found... just move on through the loop with the next permissionTag
      //          if (tagOnPermIndex === -1) continue;
      //          tagsOnPermission[tagOnPermIndex] = permissionTagExists[0].id;
      //       } else {
      //          // if here, the permissionTag doesn't exists in the db by name
      //          // create the permission tag.. the id already exists in the tagsOnPermissionsArr... so no need to add it to the array
      //          await queryInterface.bulkInsert('permissionTagsLookup', [
      //             { id: permissionTag.id, name: permissionTag.name },
      //          ]);
      //       }
      //    }
      // }

      // // loop through each tag on permission & update the tag on permission row
      // for (const tagOnPermission of tagsOnPermission) {
      //    // handle archiving a tag on permission
      //    if (tagOnPermission.action === 'archive') {
      //       await queryInterface.bulkUpdate(
      //          'permissionTagsOnPermissions',
      //          { archived: true },
      //          { id: tagOnPermission.id }
      //       );
      //    }

      //    // handle creating a tag on permission
      //    else if (tagOnPermission.action === 'create') {
      //       await queryInterface.bulkInsert(
      //          'permissionTagsOnPermissions',
      //          [
      //             {
      //                id: tagOnPermission.id,
      //                permissionId: tagOnPermission.permissionId,
      //                permissionTagId: tagOnPermission.permissionTagId,
      //             },
      //          ],
      //          { id: tagOnPermission.id }
      //       );
      //    }
      // }

      // now attach permissions to the neccessary roles...
      const permissionsOnRoles = [
         {
            id: '8f74354a-72b0-4ac1-b18d-18675211c7f9',
            permissionId: 'f4e0f14c-d5fa-4365-9842-e2d22a90454c',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: '196a4be6-75ad-4df9-9597-27f104d4e6e6',
            permissionId: 'f4e0f14c-d5fa-4365-9842-e2d22a90454c',
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
      const pagePermissionsToRevert = ['f4e0f14c-d5fa-4365-9842-e2d22a90454c'];
      for (const permissionId of pagePermissionsToRevert) {
         // delete the permissions on role by permissionId
         await queryInterface.bulkDelete('permissionsOnRoles', [{ permissionId: permissionId }]);
         // delete the permissionsTags on permissions by permissionId
         await queryInterface.bulkDelete('permissionTagsOnPermissions', [{ permissionId: permissionId }]);
         // delete the page permissions by id
         await queryInterface.bulkDelete('permissions', { id: permissionId });
      }
      // delete the created permissionTags by id
      const permissionTagIdsToDelete = ['a2f88012-80d0-4da5-b931-bd8b47b027fd'];
      for (const permissionTagId of permissionTagIdsToDelete) {
         await queryInterface.bulkDelete('permissionTagsLookup', {
            id: permissionTagId,
         });
      }

      // delete the page created by id
      await queryInterface.bulkDelete('pagesLookup', {
         id: '1b312177-f33e-415f-b53e-e7c1f518975f',
      });
   },
};
