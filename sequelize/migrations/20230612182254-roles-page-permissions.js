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
            id: '90332e64-2449-4fb0-a9e7-ba86c50470b1',
            name: 'Can access create button',
            description: 'Allow user to see and toggle the button to go create a role.',
            isDefaultPermission: false,
            archived: false,
            pageId: '3fe7b159-2188-4638-ae7e-3bae45c4e430',
            action: 'update',
         },
         {
            id: 'c82fcf42-d7c5-4468-bd53-870b8c2931ff',
            name: 'View Roles Page',
            description: "Allow user to access the 'Roles' page within the 'Organization' section.",
            isDefaultPermission: true,
            archived: false,
            pageId: '3fe7b159-2188-4638-ae7e-3bae45c4e430',
            action: 'update',
         },
         {
            id: '92fd8c01-aec1-4a1d-b0a3-378b95f827dd',
            name: 'Can access edit role button',
            description: 'Allow the user to toggle and edit an individual role',
            addPermissionToSuperAdmin: true,
            tempId: '761348',
            isDefaultPermission: false,
            archived: false,
            pageId: '3fe7b159-2188-4638-ae7e-3bae45c4e430',
            action: 'create',
         },
         {
            id: '431f744f-caba-445e-8c17-d33365a0831b',
            name: 'Can access delete button',
            description: 'Allow the user to toggle and delete an individual role',
            addPermissionToSuperAdmin: true,
            tempId: '317911',
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

      // // since tags on permissions has length... loop through each tag & and see if the tag needs to be created or not
      // const permissionTags = [
      //    { id: 'f87f38c1-4ff7-435c-9c7e-2a51a6f7f5e0', name: 'role', archived: false, action: 'update' },
      //    { id: '3c3eae19-ca25-4e20-8295-c8d149e2d390', name: 'create', archived: false, action: 'update' },
      //    { id: '8250b249-0690-446b-8675-283a1cf37acb', name: 'edit', archived: false, action: 'create' },
      //    { id: '59368faf-c90e-4fba-be1f-86ee0086d0c0', name: 'toggle', archived: false, action: 'create' },
      //    { id: 'd357fd7e-10e6-40b2-af4c-e281894aeaa5', name: 'butotn', archived: false, action: 'create' },
      //    { id: '0fb6f65e-d020-4239-bd4f-a5b36de4008c', name: 'button', archived: false, action: 'create' },
      //    { id: '3c44196a-712b-4249-86ca-8b8422077cc9', name: 'delete', archived: false, action: 'create' },
      //    { id: 'c2ddd057-9584-4bd1-a526-4c0a97171938', name: 'archive', archived: false, action: 'create' },
      // ];

      // // since tags on permissions has length... loop through each tag for the permission & update the tagOnPermission row
      // const tagsOnPermission = [
      //    {
      //       id: '0f2e3054-921d-4b11-a08a-25cfcb2cc941',
      //       archived: false,
      //       permissionTagId: 'f87f38c1-4ff7-435c-9c7e-2a51a6f7f5e0',
      //       permissionId: '90332e64-2449-4fb0-a9e7-ba86c50470b1',
      //       action: 'update',
      //    },
      //    {
      //       id: '099ab325-5cd1-4a5e-ab9f-718c5340465b',
      //       archived: false,
      //       permissionTagId: '3c3eae19-ca25-4e20-8295-c8d149e2d390',
      //       permissionId: '90332e64-2449-4fb0-a9e7-ba86c50470b1',
      //       action: 'update',
      //    },
      //    {
      //       permissionTagId: '8250b249-0690-446b-8675-283a1cf37acb',
      //       id: '118c436e-b1b2-452e-a994-7c8525ecb92b',
      //       archived: false,
      //       permissionId: '92fd8c01-aec1-4a1d-b0a3-378b95f827dd',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: '59368faf-c90e-4fba-be1f-86ee0086d0c0',
      //       id: '8e5d8ba3-781e-4577-ad72-c8130bcd3e6d',
      //       archived: false,
      //       permissionId: '92fd8c01-aec1-4a1d-b0a3-378b95f827dd',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: 'f87f38c1-4ff7-435c-9c7e-2a51a6f7f5e0',
      //       id: '259dc48f-c417-4ac4-bbf6-bf0efce6b562',
      //       archived: false,
      //       permissionId: '92fd8c01-aec1-4a1d-b0a3-378b95f827dd',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: 'd357fd7e-10e6-40b2-af4c-e281894aeaa5',
      //       id: '3d5ad19f-5999-44e4-bb16-3d45c438ff6d',
      //       archived: true,
      //       permissionId: '92fd8c01-aec1-4a1d-b0a3-378b95f827dd',
      //       action: 'nothing',
      //    },
      //    {
      //       permissionTagId: '0fb6f65e-d020-4239-bd4f-a5b36de4008c',
      //       id: '79849ded-c08d-4e54-a199-9833123c751b',
      //       archived: false,
      //       permissionId: '92fd8c01-aec1-4a1d-b0a3-378b95f827dd',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: '3c44196a-712b-4249-86ca-8b8422077cc9',
      //       id: '41e908a7-7a50-452c-8ade-36fe0cc0ae55',
      //       archived: false,
      //       permissionId: '431f744f-caba-445e-8c17-d33365a0831b',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: 'c2ddd057-9584-4bd1-a526-4c0a97171938',
      //       id: 'e4dac93e-a74b-49c1-b6a6-9a8838a21058',
      //       archived: false,
      //       permissionId: '431f744f-caba-445e-8c17-d33365a0831b',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: 'f87f38c1-4ff7-435c-9c7e-2a51a6f7f5e0',
      //       id: 'c4efda39-3e4e-412e-8964-8c46b42e29c1',
      //       archived: false,
      //       permissionId: '431f744f-caba-445e-8c17-d33365a0831b',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: '0fb6f65e-d020-4239-bd4f-a5b36de4008c',
      //       id: '64e98ac8-94f7-4132-b029-86ceeea1c370',
      //       archived: false,
      //       permissionId: '431f744f-caba-445e-8c17-d33365a0831b',
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
            id: 'c205cefa-a5ef-457a-bd49-2a839b09a085',
            permissionId: '90332e64-2449-4fb0-a9e7-ba86c50470b1',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'update',
         },
         {
            id: '546ae167-44df-4a57-bc57-4e7346e4b2a3',
            permissionId: 'c82fcf42-d7c5-4468-bd53-870b8c2931ff',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'update',
         },
         {
            id: 'fc6b1533-2db8-48d8-a086-705b0fa0a8c0',
            permissionId: '92fd8c01-aec1-4a1d-b0a3-378b95f827dd',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: 'fc0a49fd-9975-4ba2-b856-0e58d7d3fdf6',
            permissionId: '92fd8c01-aec1-4a1d-b0a3-378b95f827dd',
            roleId: 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6',
            action: 'create',
         },
         {
            id: 'c6894917-dae5-4454-b8f3-f50e96b5b95e',
            permissionId: '431f744f-caba-445e-8c17-d33365a0831b',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: 'be42a475-1195-4227-9825-05f12ebeb247',
            permissionId: '431f744f-caba-445e-8c17-d33365a0831b',
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
            id: '90332e64-2449-4fb0-a9e7-ba86c50470b1',
            name: 'Create role',
            description: 'Allow user to create a role',
            isDefaultPermission: false,
            archived: false,
            createdAt: '2023-06-09T18:46:40.101Z',
            updatedAt: '2023-06-09T18:46:40.101Z',
            pageId: '3fe7b159-2188-4638-ae7e-3bae45c4e430',
            action: 'revert',
         },
         {
            id: 'c82fcf42-d7c5-4468-bd53-870b8c2931ff',
            name: 'View Roles Page',
            description: "Allow user to access the 'Roles' page within the 'Organization' section.",
            isDefaultPermission: true,
            archived: false,
            createdAt: '2023-06-09T18:46:39.984Z',
            updatedAt: '2023-06-09T18:46:39.984Z',
            pageId: '3fe7b159-2188-4638-ae7e-3bae45c4e430',
            action: 'revert',
         },
         { id: '92fd8c01-aec1-4a1d-b0a3-378b95f827dd', action: 'delete' },
         { id: '431f744f-caba-445e-8c17-d33365a0831b', action: 'delete' },
      ];

      // // since tags on permissions has length... loop through each tag & revert the tag or delete the tag
      // const permissionTagsPrevData = [
      //    {
      //       id: 'f87f38c1-4ff7-435c-9c7e-2a51a6f7f5e0',
      //       name: 'role',
      //       archived: false,
      //       createdAt: '2023-06-09T18:46:40.103Z',
      //       updatedAt: '2023-06-09T18:46:40.103Z',
      //       action: 'revert',
      //    },
      //    {
      //       id: '3c3eae19-ca25-4e20-8295-c8d149e2d390',
      //       name: 'create',
      //       archived: false,
      //       createdAt: '2023-06-09T18:46:40.105Z',
      //       updatedAt: '2023-06-09T18:46:40.105Z',
      //       action: 'revert',
      //    },
      //    { id: '8250b249-0690-446b-8675-283a1cf37acb', name: 'edit', archived: false, action: 'delete' },
      //    { id: '59368faf-c90e-4fba-be1f-86ee0086d0c0', name: 'toggle', archived: false, action: 'delete' },
      //    { id: 'd357fd7e-10e6-40b2-af4c-e281894aeaa5', name: 'butotn', archived: false, action: 'delete' },
      //    { id: '0fb6f65e-d020-4239-bd4f-a5b36de4008c', name: 'button', archived: false, action: 'delete' },
      //    { id: '3c44196a-712b-4249-86ca-8b8422077cc9', name: 'delete', archived: false, action: 'delete' },
      //    { id: 'c2ddd057-9584-4bd1-a526-4c0a97171938', name: 'archive', archived: false, action: 'delete' },
      // ];

      // // since tags on permissions has length... loop through each tag & update the tagOnPermission row
      // const tagsOnPermissionsPrevData = [
      //    {
      //       id: '0f2e3054-921d-4b11-a08a-25cfcb2cc941',
      //       archived: false,
      //       createdAt: '2023-06-09T18:46:40.106Z',
      //       updatedAt: '2023-06-09T18:46:40.106Z',
      //       permissionTagId: 'f87f38c1-4ff7-435c-9c7e-2a51a6f7f5e0',
      //       permissionId: '90332e64-2449-4fb0-a9e7-ba86c50470b1',
      //    },
      //    {
      //       id: '099ab325-5cd1-4a5e-ab9f-718c5340465b',
      //       archived: false,
      //       createdAt: '2023-06-09T18:46:40.108Z',
      //       updatedAt: '2023-06-09T18:46:40.108Z',
      //       permissionTagId: '3c3eae19-ca25-4e20-8295-c8d149e2d390',
      //       permissionId: '90332e64-2449-4fb0-a9e7-ba86c50470b1',
      //    },
      //    {
      //       id: '118c436e-b1b2-452e-a994-7c8525ecb92b',
      //       permissionId: '92fd8c01-aec1-4a1d-b0a3-378b95f827dd',
      //       action: 'delete',
      //    },
      //    {
      //       id: '8e5d8ba3-781e-4577-ad72-c8130bcd3e6d',
      //       permissionId: '92fd8c01-aec1-4a1d-b0a3-378b95f827dd',
      //       action: 'delete',
      //    },
      //    {
      //       id: '259dc48f-c417-4ac4-bbf6-bf0efce6b562',
      //       permissionId: '92fd8c01-aec1-4a1d-b0a3-378b95f827dd',
      //       action: 'delete',
      //    },
      //    {
      //       id: '3d5ad19f-5999-44e4-bb16-3d45c438ff6d',
      //       permissionId: '92fd8c01-aec1-4a1d-b0a3-378b95f827dd',
      //       action: 'delete',
      //    },
      //    {
      //       id: '79849ded-c08d-4e54-a199-9833123c751b',
      //       permissionId: '92fd8c01-aec1-4a1d-b0a3-378b95f827dd',
      //       action: 'delete',
      //    },
      //    {
      //       id: '41e908a7-7a50-452c-8ade-36fe0cc0ae55',
      //       permissionId: '431f744f-caba-445e-8c17-d33365a0831b',
      //       action: 'delete',
      //    },
      //    {
      //       id: 'e4dac93e-a74b-49c1-b6a6-9a8838a21058',
      //       permissionId: '431f744f-caba-445e-8c17-d33365a0831b',
      //       action: 'delete',
      //    },
      //    {
      //       id: 'c4efda39-3e4e-412e-8964-8c46b42e29c1',
      //       permissionId: '431f744f-caba-445e-8c17-d33365a0831b',
      //       action: 'delete',
      //    },
      //    {
      //       id: '64e98ac8-94f7-4132-b029-86ceeea1c370',
      //       permissionId: '431f744f-caba-445e-8c17-d33365a0831b',
      //       action: 'delete',
      //    },
      // ];

      // since tags on permissions has length... loop through each tag & update the tagOnPermission row
      const permissionsOnRolesPrevData = [
         {
            id: 'c205cefa-a5ef-457a-bd49-2a839b09a085',
            archived: false,
            createdAt: '2023-06-09T18:46:40.109Z',
            updatedAt: '2023-06-09T18:46:40.109Z',
            permissionId: '90332e64-2449-4fb0-a9e7-ba86c50470b1',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'revert',
         },
         {
            id: '546ae167-44df-4a57-bc57-4e7346e4b2a3',
            archived: false,
            createdAt: '2023-06-09T18:46:40.018Z',
            updatedAt: '2023-06-09T18:46:40.018Z',
            permissionId: 'c82fcf42-d7c5-4468-bd53-870b8c2931ff',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'revert',
         },
         {
            id: 'fc6b1533-2db8-48d8-a086-705b0fa0a8c0',
            permissionId: '92fd8c01-aec1-4a1d-b0a3-378b95f827dd',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'delete',
         },
         {
            id: 'fc0a49fd-9975-4ba2-b856-0e58d7d3fdf6',
            permissionId: '92fd8c01-aec1-4a1d-b0a3-378b95f827dd',
            roleId: 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6',
            action: 'delete',
         },
         {
            id: 'c6894917-dae5-4454-b8f3-f50e96b5b95e',
            permissionId: '431f744f-caba-445e-8c17-d33365a0831b',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'delete',
         },
         {
            id: 'be42a475-1195-4227-9825-05f12ebeb247',
            permissionId: '431f744f-caba-445e-8c17-d33365a0831b',
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
         name: 'Roles',
         iconName: 'PageBrowser',
         iconColor: null,
         route: 'admin/roles',
         displayOrder: 3,
         showOnSidebar: true,
         archived: false,
         createdAt: '2023-06-09T18:46:39.981Z',
         updatedAt: '2023-06-09T18:46:39.981Z',
         parentPageId: '747d14c6-81f0-4163-8217-600c24df295b',
      };
      await queryInterface.bulkUpdate('pagesLookup', prevPageData, { id: '3fe7b159-2188-4638-ae7e-3bae45c4e430' });
   },
};
