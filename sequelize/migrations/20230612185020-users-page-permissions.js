'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // update page and save to variable
      await queryInterface.bulkUpdate(
         'pagesLookup',
         {
            name: 'Users',
            iconName: 'PageBrowser',
            iconColor: null,
            route: 'admin/users',
            archived: false,
            parentPageId: '747d14c6-81f0-4163-8217-600c24df295b',
            displayOrder: 1,
            showOnSidebar: true,
         },
         { id: 'd52fac4c-072b-4a12-b948-0827252602a7' }
      );

      // since page permissions has length...
      const pagePermissions = [
         {
            id: '0f52b67a-e684-41d0-8abe-d620a8eefd8b',
            name: 'Access delete user button',
            description: 'Allow the user to toggle delete user button.',
            isDefaultPermission: false,
            archived: false,
            pageId: 'd52fac4c-072b-4a12-b948-0827252602a7',
            action: 'update',
         },
         {
            id: '1c6bfe82-0d2a-4287-8507-457fd8892de9',
            name: 'Access edit user button',
            description: 'Allow user to toggle the edit button to edit an individual user.',
            isDefaultPermission: false,
            archived: false,
            pageId: 'd52fac4c-072b-4a12-b948-0827252602a7',
            action: 'update',
         },
         {
            id: 'bad5c54a-1a2e-40a7-86b2-681cfea34f21',
            name: 'View Users Page',
            description: "Allow user to access the 'Users' page",
            isDefaultPermission: true,
            archived: false,
            pageId: 'd52fac4c-072b-4a12-b948-0827252602a7',
            action: 'update',
         },
         {
            id: 'd81bedf8-5bc0-4182-9598-ba94bd37fea2',
            name: 'Access create user button',
            description: 'Allow user to be able to see and toggle the button to configure a new user.',
            isDefaultPermission: false,
            archived: false,
            pageId: 'd52fac4c-072b-4a12-b948-0827252602a7',
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

      // // since tags on permissions has length... loop through each tag & and see if the tag needs to be created or not
      // const permissionTags = [
      //    { id: '9609d2a2-6858-4340-81cb-e1a70ce5235e', name: 'user', archived: false, action: 'create' },
      //    { id: '0fb6f65e-d020-4239-bd4f-a5b36de4008c', name: 'button', archived: false, action: 'update' },
      //    { id: 'c2ddd057-9584-4bd1-a526-4c0a97171938', name: 'archive', archived: false, action: 'update' },
      //    { id: '3c44196a-712b-4249-86ca-8b8422077cc9', name: 'delete', archived: false, action: 'update' },
      //    { id: '8250b249-0690-446b-8675-283a1cf37acb', name: 'edit', archived: false, action: 'update' },
      //    { id: '3c3eae19-ca25-4e20-8295-c8d149e2d390', name: 'create', archived: false, action: 'update' },
      // ];

      // // since tags on permissions has length... loop through each tag for the permission & update the tagOnPermission row
      // const tagsOnPermission = [
      //    {
      //       permissionTagId: '9609d2a2-6858-4340-81cb-e1a70ce5235e',
      //       id: 'bd0cc127-73a5-4771-a597-4c12479a7e62',
      //       archived: false,
      //       permissionId: '0f52b67a-e684-41d0-8abe-d620a8eefd8b',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: '0fb6f65e-d020-4239-bd4f-a5b36de4008c',
      //       id: '7fa8b807-4172-447c-bf77-476631851696',
      //       archived: false,
      //       permissionId: '0f52b67a-e684-41d0-8abe-d620a8eefd8b',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: 'c2ddd057-9584-4bd1-a526-4c0a97171938',
      //       id: 'e93d3cd3-953d-4698-9656-0c93d8465fb1',
      //       archived: false,
      //       permissionId: '0f52b67a-e684-41d0-8abe-d620a8eefd8b',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: '3c44196a-712b-4249-86ca-8b8422077cc9',
      //       id: '36f795a2-436c-4f9e-966c-85ae4abd1b5b',
      //       archived: false,
      //       permissionId: '0f52b67a-e684-41d0-8abe-d620a8eefd8b',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: '8250b249-0690-446b-8675-283a1cf37acb',
      //       id: '4f95a200-632d-44b6-a22d-198cdcd50f1a',
      //       archived: false,
      //       permissionId: '1c6bfe82-0d2a-4287-8507-457fd8892de9',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: '9609d2a2-6858-4340-81cb-e1a70ce5235e',
      //       id: '087d5ed6-815b-443d-ab61-ef4c33a50fb8',
      //       archived: false,
      //       permissionId: '1c6bfe82-0d2a-4287-8507-457fd8892de9',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: '0fb6f65e-d020-4239-bd4f-a5b36de4008c',
      //       id: '10f52ca5-3a07-41af-9804-33b28c88fc70',
      //       archived: false,
      //       permissionId: '1c6bfe82-0d2a-4287-8507-457fd8892de9',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: '3c3eae19-ca25-4e20-8295-c8d149e2d390',
      //       id: 'a7e7bcef-faa0-4b7a-8e66-c2617172c8fa',
      //       archived: false,
      //       permissionId: 'd81bedf8-5bc0-4182-9598-ba94bd37fea2',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: '9609d2a2-6858-4340-81cb-e1a70ce5235e',
      //       id: '888cebfa-8948-4276-98c4-a481edfa60ae',
      //       archived: false,
      //       permissionId: 'd81bedf8-5bc0-4182-9598-ba94bd37fea2',
      //       action: 'create',
      //    },
      //    {
      //       permissionTagId: '0fb6f65e-d020-4239-bd4f-a5b36de4008c',
      //       id: '8b4eafd4-ecdd-4d96-865a-d6c581a1b98c',
      //       archived: false,
      //       permissionId: 'd81bedf8-5bc0-4182-9598-ba94bd37fea2',
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
            id: '7942d23f-b0c0-4e94-89e1-5ca604a9c8b8',
            permissionId: '0f52b67a-e684-41d0-8abe-d620a8eefd8b',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'update',
         },
         {
            id: 'ce7d435d-01b2-4a51-baac-7c18817fd376',
            permissionId: '1c6bfe82-0d2a-4287-8507-457fd8892de9',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'update',
         },
         {
            id: '9943c5ec-39c7-4311-b760-030de059e627',
            permissionId: 'bad5c54a-1a2e-40a7-86b2-681cfea34f21',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'update',
         },
         {
            id: '76b26baf-2ab1-4ff9-b235-06c27e75c249',
            permissionId: 'd81bedf8-5bc0-4182-9598-ba94bd37fea2',
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

      // since page permissions has length... loop through each permission & update the permission
      const pagePermissionsPrevData = [
         {
            id: '0f52b67a-e684-41d0-8abe-d620a8eefd8b',
            name: 'Archive a User',
            description: 'Allow user to archive an existing user',
            isDefaultPermission: false,
            archived: false,
            createdAt: '2023-06-12T18:47:40.355Z',
            updatedAt: '2023-06-12T18:47:40.355Z',
            pageId: 'd52fac4c-072b-4a12-b948-0827252602a7',
            action: 'revert',
         },
         {
            id: '1c6bfe82-0d2a-4287-8507-457fd8892de9',
            name: 'Share A User',
            description: 'Allow user to share an existing user',
            isDefaultPermission: false,
            archived: false,
            createdAt: '2023-06-12T18:47:40.355Z',
            updatedAt: '2023-06-12T18:47:40.355Z',
            pageId: 'd52fac4c-072b-4a12-b948-0827252602a7',
            action: 'revert',
         },
         {
            id: 'bad5c54a-1a2e-40a7-86b2-681cfea34f21',
            name: 'View Users Page',
            description: "Allow user to access the 'Users' page",
            isDefaultPermission: true,
            archived: false,
            createdAt: '2023-06-12T18:47:40.355Z',
            updatedAt: '2023-06-12T18:47:40.355Z',
            pageId: 'd52fac4c-072b-4a12-b948-0827252602a7',
            action: 'revert',
         },
         {
            id: 'd81bedf8-5bc0-4182-9598-ba94bd37fea2',
            name: 'Create A New User',
            description: 'Allow user to create a new user',
            isDefaultPermission: false,
            archived: false,
            createdAt: '2023-06-12T18:47:40.355Z',
            updatedAt: '2023-06-12T18:47:40.355Z',
            pageId: 'd52fac4c-072b-4a12-b948-0827252602a7',
            action: 'revert',
         },
      ];

      // // since tags on permissions has length... loop through each tag & revert the tag or delete the tag
      // const permissionTagsPrevData = [
      //    { id: '9609d2a2-6858-4340-81cb-e1a70ce5235e', name: 'user', archived: false, action: 'delete' },
      //    {
      //       id: '0fb6f65e-d020-4239-bd4f-a5b36de4008c',
      //       name: 'button',
      //       archived: false,
      //       createdAt: '2023-06-12T18:47:40.437Z',
      //       updatedAt: '2023-06-12T18:47:40.437Z',
      //       action: 'revert',
      //    },
      //    {
      //       id: 'c2ddd057-9584-4bd1-a526-4c0a97171938',
      //       name: 'archive',
      //       archived: false,
      //       createdAt: '2023-06-12T18:47:40.440Z',
      //       updatedAt: '2023-06-12T18:47:40.440Z',
      //       action: 'revert',
      //    },
      //    {
      //       id: '3c44196a-712b-4249-86ca-8b8422077cc9',
      //       name: 'delete',
      //       archived: false,
      //       createdAt: '2023-06-12T18:47:40.439Z',
      //       updatedAt: '2023-06-12T18:47:40.439Z',
      //       action: 'revert',
      //    },
      //    {
      //       id: '8250b249-0690-446b-8675-283a1cf37acb',
      //       name: 'edit',
      //       archived: false,
      //       createdAt: '2023-06-12T18:47:40.434Z',
      //       updatedAt: '2023-06-12T18:47:40.434Z',
      //       action: 'revert',
      //    },
      //    {
      //       id: '3c3eae19-ca25-4e20-8295-c8d149e2d390',
      //       name: 'create',
      //       archived: false,
      //       createdAt: '2023-06-12T18:47:40.384Z',
      //       updatedAt: '2023-06-12T18:47:40.384Z',
      //       action: 'revert',
      //    },
      // ];

      // // since tags on permissions has length... loop through each tag & update the tagOnPermission row
      // const tagsOnPermissionsPrevData = [
      //    {
      //       id: 'bd0cc127-73a5-4771-a597-4c12479a7e62',
      //       permissionId: '0f52b67a-e684-41d0-8abe-d620a8eefd8b',
      //       action: 'delete',
      //    },
      //    {
      //       id: '7fa8b807-4172-447c-bf77-476631851696',
      //       permissionId: '0f52b67a-e684-41d0-8abe-d620a8eefd8b',
      //       action: 'delete',
      //    },
      //    {
      //       id: 'e93d3cd3-953d-4698-9656-0c93d8465fb1',
      //       permissionId: '0f52b67a-e684-41d0-8abe-d620a8eefd8b',
      //       action: 'delete',
      //    },
      //    {
      //       id: '36f795a2-436c-4f9e-966c-85ae4abd1b5b',
      //       permissionId: '0f52b67a-e684-41d0-8abe-d620a8eefd8b',
      //       action: 'delete',
      //    },
      //    {
      //       id: '4f95a200-632d-44b6-a22d-198cdcd50f1a',
      //       permissionId: '1c6bfe82-0d2a-4287-8507-457fd8892de9',
      //       action: 'delete',
      //    },
      //    {
      //       id: '087d5ed6-815b-443d-ab61-ef4c33a50fb8',
      //       permissionId: '1c6bfe82-0d2a-4287-8507-457fd8892de9',
      //       action: 'delete',
      //    },
      //    {
      //       id: '10f52ca5-3a07-41af-9804-33b28c88fc70',
      //       permissionId: '1c6bfe82-0d2a-4287-8507-457fd8892de9',
      //       action: 'delete',
      //    },
      //    {
      //       id: 'a7e7bcef-faa0-4b7a-8e66-c2617172c8fa',
      //       permissionId: 'd81bedf8-5bc0-4182-9598-ba94bd37fea2',
      //       action: 'delete',
      //    },
      //    {
      //       id: '888cebfa-8948-4276-98c4-a481edfa60ae',
      //       permissionId: 'd81bedf8-5bc0-4182-9598-ba94bd37fea2',
      //       action: 'delete',
      //    },
      //    {
      //       id: '8b4eafd4-ecdd-4d96-865a-d6c581a1b98c',
      //       permissionId: 'd81bedf8-5bc0-4182-9598-ba94bd37fea2',
      //       action: 'delete',
      //    },
      // ];

      // since tags on permissions has length... loop through each tag & update the tagOnPermission row
      const permissionsOnRolesPrevData = [
         {
            id: '7942d23f-b0c0-4e94-89e1-5ca604a9c8b8',
            archived: false,
            createdAt: '2023-06-12T18:47:40.359Z',
            updatedAt: '2023-06-12T18:47:40.359Z',
            permissionId: '0f52b67a-e684-41d0-8abe-d620a8eefd8b',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'revert',
         },
         {
            id: 'ce7d435d-01b2-4a51-baac-7c18817fd376',
            archived: false,
            createdAt: '2023-06-12T18:47:40.359Z',
            updatedAt: '2023-06-12T18:47:40.359Z',
            permissionId: '1c6bfe82-0d2a-4287-8507-457fd8892de9',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'revert',
         },
         {
            id: '9943c5ec-39c7-4311-b760-030de059e627',
            archived: false,
            createdAt: '2023-06-12T18:47:40.359Z',
            updatedAt: '2023-06-12T18:47:40.359Z',
            permissionId: 'bad5c54a-1a2e-40a7-86b2-681cfea34f21',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'revert',
         },
         {
            id: '76b26baf-2ab1-4ff9-b235-06c27e75c249',
            archived: false,
            createdAt: '2023-06-12T18:47:40.359Z',
            updatedAt: '2023-06-12T18:47:40.359Z',
            permissionId: 'd81bedf8-5bc0-4182-9598-ba94bd37fea2',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'revert',
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
         name: 'Users',
         iconName: 'PageBrowser',
         iconColor: null,
         route: 'admin/users',
         displayOrder: 1,
         showOnSidebar: true,
         archived: false,
         createdAt: '2023-06-12T18:47:40.352Z',
         updatedAt: '2023-06-12T18:47:40.352Z',
         parentPageId: '747d14c6-81f0-4163-8217-600c24df295b',
      };
      await queryInterface.bulkUpdate('pagesLookup', prevPageData, { id: 'd52fac4c-072b-4a12-b948-0827252602a7' });
   },
};
