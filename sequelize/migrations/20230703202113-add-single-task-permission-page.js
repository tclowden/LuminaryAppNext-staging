'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // create page in db
      await queryInterface.bulkInsert('pagesLookup', [
         {
            id: '0731a2dc-d647-4d70-99fd-b9f268614e80',
            name: 'Task',
            iconName: 'Notes',
            iconColor: null,
            route: 'admin/tasks/*',
            archived: false,
            parentPageId: '747d14c6-81f0-4163-8217-600c24df295b',
            displayOrder: 7,
            showOnSidebar: false,
         },
      ]);

      // since page permissions has length...
      const pagePermissions = [
         {
            id: '94f9de91-6303-4ac7-aa2a-d1a226f0bef0',
            archived: false,
            description: 'Allow user to view a single product task',
            isDefaultPermission: true,
            name: 'View Product Task',
            addPermissionToSuperAdmin: true,
            pageId: '0731a2dc-d647-4d70-99fd-b9f268614e80',
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
      //    { id: '3cdf1e8e-21a8-4341-84b2-045505b5b9e6', name: 'task', archived: false, action: 'create' },
      //    { id: '477d2d33-3ab8-4322-a1ee-fef96584713d', name: 'tasks', archived: false, action: 'create' },
      // ];

      // // since tags on permissions has length... loop through each tag for the permission & update the tagOnPermission row
      // const tagsOnPermission = [
      //    {
      //       permissionTagId: '3cdf1e8e-21a8-4341-84b2-045505b5b9e6',
      //       id: 'e28bea7e-70f0-4e30-92c5-00867eaee921',
      //       archived: true,
      //       permissionId: '94f9de91-6303-4ac7-aa2a-d1a226f0bef0',
      //       action: 'nothing',
      //    },
      //    {
      //       permissionTagId: '477d2d33-3ab8-4322-a1ee-fef96584713d',
      //       id: '7aeea9e5-bbcd-4d60-99fa-f2d70d4a5bd1',
      //       archived: true,
      //       permissionId: '94f9de91-6303-4ac7-aa2a-d1a226f0bef0',
      //       action: 'nothing',
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
            id: '1357df43-37da-40a0-b8c6-956fc149230d',
            permissionId: '94f9de91-6303-4ac7-aa2a-d1a226f0bef0',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: 'cb3d9503-e7da-4007-8ef4-027e4710e7d8',
            permissionId: '94f9de91-6303-4ac7-aa2a-d1a226f0bef0',
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
      const pagePermissionsToRevert = ['94f9de91-6303-4ac7-aa2a-d1a226f0bef0'];
      for (const permissionId of pagePermissionsToRevert) {
         // delete the permissions on role by permissionId
         await queryInterface.bulkDelete('permissionsOnRoles', [{ permissionId: permissionId }]);
         // delete the permissionsTags on permissions by permissionId
         // await queryInterface.bulkDelete('permissionTagsOnPermissions', [{ permissionId: permissionId }]);
         // delete the page permissions by id
         await queryInterface.bulkDelete('permissions', { id: permissionId });
      }
      // // delete the created permissionTags by id
      // const permissionTagIdsToDelete = ['3cdf1e8e-21a8-4341-84b2-045505b5b9e6', '477d2d33-3ab8-4322-a1ee-fef96584713d'];
      // for (const permissionTagId of permissionTagIdsToDelete) {
      //    await queryInterface.bulkDelete('permissionTagsLookup', { id: permissionTagId });
      // }

      // delete the page created by id
      await queryInterface.bulkDelete('pagesLookup', { id: '0731a2dc-d647-4d70-99fd-b9f268614e80' });
   },
};
