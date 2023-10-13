'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // update page and save to variable
      await queryInterface.bulkUpdate(
         'pagesLookup',
         {
            name: 'Proposal',
            iconName: 'MagnifyPaper',
            iconColor: null,
            route: 'installs/proposals/*',
            archived: false,
            parentPageId: '5a758c4c-1361-41f2-a993-30333a029f7b',
            displayOrder: 1,
            showOnSidebar: false,
         },
         { id: '742aee79-cf6f-47e6-ad4a-4c4da5f43209' }
      );

      // since page permissions has length...
      const pagePermissions = [
         {
            id: 'f61ea75a-3313-4d96-b73b-98f2013a319f',
            name: 'View Proposal Page',
            description: "Allow user to access an individual 'Proposal' page within the 'Installs' section.",
            isDefaultPermission: true,
            archived: false,
            pageId: '742aee79-cf6f-47e6-ad4a-4c4da5f43209',
            action: 'update',
         },
         {
            id: '53c6f540-b51c-4adf-a419-551b07965fed',
            name: 'View Proposal Revenue',
            description: 'View Proposal Revenue on the edit modal',
            addPermissionToSuperAdmin: true,
            tempId: '720392',
            isDefaultPermission: false,
            archived: false,
            pageId: '742aee79-cf6f-47e6-ad4a-4c4da5f43209',
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
      //    { id: '9e75b302-3a2c-40b0-8e2d-ecbbfbbd4c97', name: 'proposal', archived: false, action: 'update' },
      //    { id: 'd089e187-6da6-4738-ad8b-6e698ceba6c6', name: 'revenue', archived: false, action: 'create' },
      // ];

      // // since tags on permissions has length... loop through each tag for the permission & update the tagOnPermission row
      // const tagsOnPermission = [
      //    {
      //       permissionTagId: '9e75b302-3a2c-40b0-8e2d-ecbbfbbd4c97',
      //       id: 'a1730282-08fd-40b8-8add-095acb1cd622',
      //       archived: false,
      //       permissionId: '53c6f540-b51c-4adf-a419-551b07965fed',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: 'd089e187-6da6-4738-ad8b-6e698ceba6c6',
      //       id: '28dfb46e-0c57-4b57-bd6e-a5acf491dffc',
      //       archived: false,
      //       permissionId: '53c6f540-b51c-4adf-a419-551b07965fed',
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
            id: 'eba8cef4-aa32-4694-9924-02cf4ecb7619',
            permissionId: 'f61ea75a-3313-4d96-b73b-98f2013a319f',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'update',
         },
         {
            id: '8a132869-3917-4a30-8415-da65907298ed',
            permissionId: '53c6f540-b51c-4adf-a419-551b07965fed',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: '7438c8b0-0b9d-44b5-b474-0e06d05ffcc1',
            permissionId: '53c6f540-b51c-4adf-a419-551b07965fed',
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
            id: 'f61ea75a-3313-4d96-b73b-98f2013a319f',
            name: 'View Proposal Page',
            description: "Allow user to access an individual 'Proposal' page within the 'Installs' section.",
            isDefaultPermission: true,
            archived: false,
            createdAt: '2023-06-21T16:58:42.037Z',
            updatedAt: '2023-06-21T16:58:42.037Z',
            pageId: '742aee79-cf6f-47e6-ad4a-4c4da5f43209',
            action: 'revert',
         },
         { id: '53c6f540-b51c-4adf-a419-551b07965fed', action: 'delete' },
      ];

      // // since tags on permissions has length... loop through each tag & revert the tag or delete the tag
      // const permissionTagsPrevData = [
      //    {
      //       id: '9e75b302-3a2c-40b0-8e2d-ecbbfbbd4c97',
      //       name: 'proposal',
      //       archived: false,
      //       createdAt: '2023-06-21T16:58:42.149Z',
      //       updatedAt: '2023-06-21T16:58:42.149Z',
      //       action: 'revert',
      //    },
      //    {
      //       id: 'd089e187-6da6-4738-ad8b-6e698ceba6c6',
      //       name: 'revenue',
      //       archived: false,
      //       createdAt: '2023-06-21T18:23:47.397Z',
      //       updatedAt: '2023-06-21T18:23:47.397Z',
      //       action: 'revert',
      //    },
      // ];

      // // since tags on permissions has length... loop through each tag & update the tagOnPermission row
      // const tagsOnPermissionsPrevData = [
      //    {
      //       id: 'a1730282-08fd-40b8-8add-095acb1cd622',
      //       permissionId: '53c6f540-b51c-4adf-a419-551b07965fed',
      //       action: 'delete',
      //    },
      //    {
      //       id: '28dfb46e-0c57-4b57-bd6e-a5acf491dffc',
      //       permissionId: '53c6f540-b51c-4adf-a419-551b07965fed',
      //       action: 'delete',
      //    },
      // ];

      // since tags on permissions has length... loop through each tag & update the tagOnPermission row
      const permissionsOnRolesPrevData = [
         {
            id: 'eba8cef4-aa32-4694-9924-02cf4ecb7619',
            archived: false,
            createdAt: '2023-06-21T16:58:42.043Z',
            updatedAt: '2023-06-21T16:58:42.043Z',
            permissionId: 'f61ea75a-3313-4d96-b73b-98f2013a319f',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'revert',
         },
         {
            id: '8a132869-3917-4a30-8415-da65907298ed',
            permissionId: '53c6f540-b51c-4adf-a419-551b07965fed',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'delete',
         },
         {
            id: '7438c8b0-0b9d-44b5-b474-0e06d05ffcc1',
            permissionId: '53c6f540-b51c-4adf-a419-551b07965fed',
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
         name: 'Proposal',
         iconName: 'MagnifyPaper',
         iconColor: null,
         route: 'installs/proposals/*',
         displayOrder: 1,
         showOnSidebar: false,
         archived: false,
         createdAt: '2023-06-21T16:58:42.024Z',
         updatedAt: '2023-06-21T16:58:42.024Z',
         parentPageId: '5a758c4c-1361-41f2-a993-30333a029f7b',
      };
      await queryInterface.bulkUpdate('pagesLookup', prevPageData, { id: '742aee79-cf6f-47e6-ad4a-4c4da5f43209' });
   },
};
