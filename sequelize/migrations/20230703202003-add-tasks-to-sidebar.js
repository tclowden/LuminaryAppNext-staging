'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // create page in db
      await queryInterface.bulkInsert('pagesLookup', [
         {
            id: 'ea572886-a3cd-4424-b7be-f44426729388',
            name: 'Tasks',
            iconName: 'Notes',
            iconColor: null,
            route: 'admin/tasks',
            archived: false,
            parentPageId: '29d1b96f-4516-44e1-bf56-8fc2f2dec910',
            displayOrder: 17,
            showOnSidebar: true,
         },
      ]);

      // since page permissions has length...
      const pagePermissions = [
         {
            id: 'f18a174e-4c17-4fe8-a449-c3dc57bdc90b',
            archived: false,
            description: 'Allow user to access the product tasks page',
            isDefaultPermission: true,
            name: 'View Product Tasks',
            addPermissionToSuperAdmin: true,
            pageId: 'ea572886-a3cd-4424-b7be-f44426729388',
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
      //    { id: '2d7a8536-06b6-45ea-9f94-820847973171', name: 'task', archived: false, action: 'create' },
      //    { id: 'cf6c2b79-7cd0-4974-8728-43880f35c668', name: 'product', archived: false, action: 'create' },
      //    { id: '8ecebe64-b3aa-4f95-b4ef-c0f60eb2a248', name: 'tasks', archived: false, action: 'create' },
      // ];

      // // since tags on permissions has length... loop through each tag for the permission & update the tagOnPermission row
      // const tagsOnPermission = [
      //    {
      //       permissionTagId: '2d7a8536-06b6-45ea-9f94-820847973171',
      //       id: 'e1388925-a05f-4953-890a-d3eb75d70ddf',
      //       archived: false,
      //       permissionId: 'f18a174e-4c17-4fe8-a449-c3dc57bdc90b',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: 'cf6c2b79-7cd0-4974-8728-43880f35c668',
      //       id: 'c6c2ba9b-6c98-4387-95db-d5d7b784758f',
      //       archived: false,
      //       permissionId: 'f18a174e-4c17-4fe8-a449-c3dc57bdc90b',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: '8ecebe64-b3aa-4f95-b4ef-c0f60eb2a248',
      //       id: '03615d5c-4f6f-42e8-97fd-9ed74daa112a',
      //       archived: false,
      //       permissionId: 'f18a174e-4c17-4fe8-a449-c3dc57bdc90b',
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
            id: 'a2901469-633d-41e4-ba59-bfbca7b18972',
            permissionId: 'f18a174e-4c17-4fe8-a449-c3dc57bdc90b',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: '89f5c1aa-7170-4696-b4e3-64c2d879b4f2',
            permissionId: 'f18a174e-4c17-4fe8-a449-c3dc57bdc90b',
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
      const pagePermissionsToRevert = ['f18a174e-4c17-4fe8-a449-c3dc57bdc90b'];
      for (const permissionId of pagePermissionsToRevert) {
         // delete the permissions on role by permissionId
         await queryInterface.bulkDelete('permissionsOnRoles', [{ permissionId: permissionId }]);
         // delete the permissionsTags on permissions by permissionId
         // await queryInterface.bulkDelete('permissionTagsOnPermissions', [{ permissionId: permissionId }]);
         // delete the page permissions by id
         await queryInterface.bulkDelete('permissions', { id: permissionId });
      }
      // // delete the created permissionTags by id
      // const permissionTagIdsToDelete = [
      //    '2d7a8536-06b6-45ea-9f94-820847973171',
      //    'cf6c2b79-7cd0-4974-8728-43880f35c668',
      //    '8ecebe64-b3aa-4f95-b4ef-c0f60eb2a248',
      // ];
      // for (const permissionTagId of permissionTagIdsToDelete) {
      //    await queryInterface.bulkDelete('permissionTagsLookup', { id: permissionTagId });
      // }

      // delete the page created by id
      await queryInterface.bulkDelete('pagesLookup', { id: 'ea572886-a3cd-4424-b7be-f44426729388' });
   },
};
