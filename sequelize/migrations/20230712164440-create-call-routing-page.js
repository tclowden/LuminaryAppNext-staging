'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // create page in db
      await queryInterface.bulkInsert('pagesLookup', [
         {
            id: 'da418469-cd32-455b-ac63-fc8d414ab027',
            name: 'Call Routing',
            iconName: null,
            iconColor: null,
            route: 'admin/call-routing',
            archived: false,
            parentPageId: '6d0df293-410d-4079-904d-36c3fb786291',
            displayOrder: 2,
            showOnSidebar: true,
         },
      ]);

      // since page permissions has length...
      const pagePermissions = [
         {
            id: '2842efd2-1d2e-4f09-974c-cba50cc51d5f',
            archived: false,
            description: "Allow user to access the 'Call Routing' page within the 'Phone Numbers' section.",
            isDefaultPermission: true,
            name: 'View Call Routing Page',
            addPermissionToSuperAdmin: true,
            pageId: 'da418469-cd32-455b-ac63-fc8d414ab027',
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

      // // since tags on permissions has length... loop through each tag & and see if the tag needs to be created or not
      // const permissionTags = [
      //    { id: 'a2f88012-80d0-4da5-b931-bd8b47b027fd', name: 'phone', archived: false, action: 'update' },
      // ];

      // // since tags on permissions has length... loop through each tag for the permission & update the tagOnPermission row
      // const tagsOnPermission = [
      //    {
      //       permissionTagId: 'a2f88012-80d0-4da5-b931-bd8b47b027fd',
      //       id: 'dca8e4ae-9edd-45b5-bd3b-81befc83c3a6',
      //       archived: false,
      //       permissionId: '2842efd2-1d2e-4f09-974c-cba50cc51d5f',
      //       action: 'create',
      //    },
      // ];

      //
      // for (const permissionTag of permissionTags) {
      //    // handle creating a permission tag if needed
      //    if (permissionTag?.action === 'create') {
      //       // before creating, let's make sure it doesn't already exist in the database by name
      //       // if it does, overwrite the current id with the id in the database inside the permissionTagsOnPermissions obj
      //       // this allows the migration to make sure there aren't any duplicate permission tags...
      //       // Ex) Matt Rapp creates a migration locally adding a tag name = 'product' & Mark Davenport does the same... when running both migrations, should only add one of the permission tags, but share it across both permissions
      //       const permissionTagExists = await queryInterface
      //          .select(null, 'permissionTagsLookup', { where: { name: permissionTag.name } })
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

      // loop through each tag on permission & update the tag on permission row
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
            id: '2181873c-1072-4d37-9331-55cf320b72fc',
            permissionId: '2842efd2-1d2e-4f09-974c-cba50cc51d5f',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: '7ee5254a-5080-4feb-af3c-f590055d1a42',
            permissionId: '2842efd2-1d2e-4f09-974c-cba50cc51d5f',
            roleId: 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6',
            action: 'create',
         },
      ];

      // loop through each permission on role & add to db...
      // for (const permissionOnRole of permissionsOnRoles) {
      //    // handle archiving a permission on role
      //    if (permissionOnRole?.action === 'archive') {
      //       await queryInterface.bulkUpdate('permissionsOnRoles', { archived: true }, { id: permissionOnRole.id });
      //    }

      //    // handle creating a permission on role
      //    if (permissionOnRole?.action === 'create') {
      //       await queryInterface.bulkInsert('permissionsOnRoles', [
      //          {
      //             id: permissionOnRole.id,
      //             permissionId: permissionOnRole.permissionId,
      //             roleId: permissionOnRole.roleId,
      //          },
      //       ]);
      //    }
      // }
   },

   async down(queryInterface, Sequelize) {
      /** Add reverting commands here. */

      // permissionIds that need to be deleted from the db
      const pagePermissionsToRevert = ['2842efd2-1d2e-4f09-974c-cba50cc51d5f'];
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
      await queryInterface.bulkDelete('pagesLookup', { id: 'da418469-cd32-455b-ac63-fc8d414ab027' });
   },
};
