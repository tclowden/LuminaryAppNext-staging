'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // update page and save to variable
      await queryInterface.bulkUpdate(
         'pagesLookup',
         {
            name: 'Buckets',
            iconName: 'PageBrowser',
            iconColor: null,
            route: 'admin/buckets',
            archived: false,
            parentPageId: '747d14c6-81f0-4163-8217-600c24df295b',
            displayOrder: 5,
            showOnSidebar: true,
         },
         { id: 'e8fb9651-9b6d-4dec-8cdf-1469a6ce2d15' }
      );

      // since page permissions has length...
      const pagePermissions = [
         {
            id: 'd141e6ea-ab15-4890-9672-33a8391c2b4c',
            name: 'View Buckets Page',
            description: "Allow user to access the 'Buckets' page within the 'Organization' section.",
            isDefaultPermission: true,
            archived: false,
            pageId: 'e8fb9651-9b6d-4dec-8cdf-1469a6ce2d15',
            action: 'update',
         },
         {
            id: 'e6deefdd-dce3-43e4-b92f-df841eecf505',
            name: 'Create Bucket',
            description: 'Allow user to create a bucket.',
            addPermissionToSuperAdmin: true,
            tempId: '287021',
            isDefaultPermission: false,
            archived: false,
            pageId: 'e8fb9651-9b6d-4dec-8cdf-1469a6ce2d15',
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
      //    { id: 'b2e063ba-90ce-4ea6-a2ad-98f725001108', name: 'buket', archived: false, action: 'create' },
      //    { id: 'c2778710-8e48-4ef3-820f-a646bf3d2e65', name: 'create', archived: false, action: 'create' },
      //    { id: 'b05355ac-a8f1-4656-84bd-3eafec911673', name: 'bucket', archived: false, action: 'create' },
      // ];

      // // since tags on permissions has length... loop through each tag for the permission & update the tagOnPermission row
      // const tagsOnPermission = [
      //    {
      //       permissionTagId: 'b2e063ba-90ce-4ea6-a2ad-98f725001108',
      //       id: '8785b452-7699-4837-97b2-ffe0f42fa20a',
      //       archived: true,
      //       permissionId: 'e6deefdd-dce3-43e4-b92f-df841eecf505',
      //       action: 'nothing',
      //    },
      //    {
      //       permissionTagId: 'c2778710-8e48-4ef3-820f-a646bf3d2e65',
      //       id: '924add95-b906-4f84-a837-a9024ec417b3',
      //       archived: false,
      //       permissionId: 'e6deefdd-dce3-43e4-b92f-df841eecf505',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: 'b05355ac-a8f1-4656-84bd-3eafec911673',
      //       id: 'e02cbaca-8f28-4b36-a98b-e836717e43e8',
      //       archived: false,
      //       permissionId: 'e6deefdd-dce3-43e4-b92f-df841eecf505',
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
            id: '027f7687-e5a5-4a90-8c5b-782da4d2b144',
            permissionId: 'd141e6ea-ab15-4890-9672-33a8391c2b4c',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'update',
         },
         {
            id: 'cb28f848-b92b-4d83-8e5f-46c2a1dcac25',
            permissionId: 'e6deefdd-dce3-43e4-b92f-df841eecf505',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: 'f75f844a-2998-4bcf-83d0-fdb44b828dfd',
            permissionId: 'e6deefdd-dce3-43e4-b92f-df841eecf505',
            roleId: 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6',
            action: 'create',
         },
      ];

      // loop through each permission on role & add to db...
      for (const permissionOnRole of permissionsOnRoles) {
         // need to find the super secret dev permission & the super admin permission
         // let superSecretDevRoleId = await queryInterface.rawSelect('roles', { where: { name: 'Super Secret Dev' } }, ['id']);
         // let superAdminRoleId = await queryInterface.rawSelect('roles', { where: { name: 'Super Admin' } }, ['id']);

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
            id: 'd141e6ea-ab15-4890-9672-33a8391c2b4c',
            name: 'View Buckets Page',
            description: "Allow user to access the 'Buckets' page within the 'Organization' section.",
            isDefaultPermission: true,
            archived: false,
            createdAt: '2023-06-09T18:10:51.750Z',
            updatedAt: '2023-06-09T18:10:51.750Z',
            pageId: 'e8fb9651-9b6d-4dec-8cdf-1469a6ce2d15',
            action: 'revert',
         },
         { id: 'e6deefdd-dce3-43e4-b92f-df841eecf505', action: 'delete' },
      ];

      // // since tags on permissions has length... loop through each tag & revert the tag or delete the tag
      // const permissionTagsPrevData = [
      //    { id: 'b2e063ba-90ce-4ea6-a2ad-98f725001108', name: 'buket', archived: false, action: 'delete' },
      //    { id: 'c2778710-8e48-4ef3-820f-a646bf3d2e65', name: 'create', archived: false, action: 'delete' },
      //    { id: 'b05355ac-a8f1-4656-84bd-3eafec911673', name: 'bucket', archived: false, action: 'delete' },
      // ];

      // // since tags on permissions has length... loop through each tag & update the tagOnPermission row
      // const tagsOnPermissionsPrevData = [
      //    {
      //       id: '8785b452-7699-4837-97b2-ffe0f42fa20a',
      //       permissionId: 'e6deefdd-dce3-43e4-b92f-df841eecf505',
      //       action: 'delete',
      //    },
      //    {
      //       id: '924add95-b906-4f84-a837-a9024ec417b3',
      //       permissionId: 'e6deefdd-dce3-43e4-b92f-df841eecf505',
      //       action: 'delete',
      //    },
      //    {
      //       id: 'e02cbaca-8f28-4b36-a98b-e836717e43e8',
      //       permissionId: 'e6deefdd-dce3-43e4-b92f-df841eecf505',
      //       action: 'delete',
      //    },
      // ];

      // since tags on permissions has length... loop through each tag & update the tagOnPermission row
      const permissionsOnRolesPrevData = [
         {
            id: '027f7687-e5a5-4a90-8c5b-782da4d2b144',
            archived: false,
            createdAt: '2023-06-09T18:10:51.754Z',
            updatedAt: '2023-06-09T18:10:51.754Z',
            permissionId: 'd141e6ea-ab15-4890-9672-33a8391c2b4c',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'revert',
         },
         {
            id: 'cb28f848-b92b-4d83-8e5f-46c2a1dcac25',
            permissionId: 'e6deefdd-dce3-43e4-b92f-df841eecf505',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'delete',
         },
         {
            id: 'f75f844a-2998-4bcf-83d0-fdb44b828dfd',
            permissionId: 'e6deefdd-dce3-43e4-b92f-df841eecf505',
            roleId: 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6',
            action: 'delete',
         },
      ];

      // // loop through each tag on permission & revert the previous db save
      // for (const tagOnPermission of tagsOnPermissionsPrevData) {
      //    // handle deleting a tag on permission that was just created
      //    if (tagOnPermission.action === 'delete') {
      //       await queryInterface.bulkDelete('permissionTagsOnPermissions', { id: tagOnPermission?.id });
      //    }

      //    // handle reverting a permission that was just altered
      //    else if (tagOnPermission.action === 'revert') {
      //       const tagToAlterCopy = { ...JSON.parse(JSON.stringify(tagOnPermission)) };
      //       // delete unneccesary keys
      //       delete tagToAlterCopy['action'];
      //       delete tagToAlterCopy['id'];
      //       delete tagToAlterCopy['rowId'];
      //       delete tagToAlterCopy['permissionTag'];
      //       await queryInterface.bulkUpdate('permissionTagsOnPermissions', tagToAlterCopy, { id: tagOnPermission?.id });
      //    }
      // }

      // // loop through each tag & revert or delete the previous db save
      // for (const permissionTag of permissionTagsPrevData) {
      //    // handle deleting a tag that was just created
      //    // we don't need to worry about reverting it... because you can't update a permissionTag as of now
      //    if (permissionTag?.action === 'delete') {
      //       await queryInterface.bulkDelete('permissionTagsLookup', { id: permissionTag?.id });
      //    }
      // }

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
         name: 'Buckets',
         iconName: 'PageBrowser',
         iconColor: null,
         route: 'admin/buckets',
         displayOrder: 5,
         showOnSidebar: true,
         archived: false,
         createdAt: '2023-06-09T18:10:51.747Z',
         updatedAt: '2023-06-09T18:10:51.747Z',
         parentPageId: '747d14c6-81f0-4163-8217-600c24df295b',
      };
      await queryInterface.bulkUpdate('pagesLookup', prevPageData, { id: 'e8fb9651-9b6d-4dec-8cdf-1469a6ce2d15' });
   },
};
