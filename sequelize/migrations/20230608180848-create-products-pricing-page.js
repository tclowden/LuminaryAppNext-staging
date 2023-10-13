'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */

      // create page in db
      await queryInterface.bulkInsert('pagesLookup', [
         {
            id: '081ccd78-7ca0-42e8-b6bf-34e709566d06',
            name: 'Product Pricing',
            iconName: 'Tools',
            iconColor: null,
            route: 'admin/product-pricing',
            archived: false,
            parentPageId: '29d1b96f-4516-44e1-bf56-8fc2f2dec910',
            displayOrder: 17,
            showOnSidebar: true,
         },
      ]);

      // since page permissions has length...
      const pagePermissions = [
         {
            id: 'c6c5a157-987c-4629-adf8-d028d23f3ebd',
            name: 'View Product Pricing Page',
            description: 'Allow user to view the Product Pricing page',
            addPermissionToSuperAdmin: true,
            tempId: '916054',
            isDefaultPermission: false,
            archived: false,
            pageId: '081ccd78-7ca0-42e8-b6bf-34e709566d06',
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
      // const permissionTags = [{ id: "768f6a8d-d21d-4581-b489-2fe8e2f06f01", name: "view", archived: false, action: "create" }, { id: "9e75b302-3a2c-40b0-8e2d-ecbbfbbd4c97", name: "proposal", archived: false, action: "create" }, { id: "b3a96da8-2728-4679-af4c-f88eed344c9b", name: "product", archived: false, action: "create" }, { id: "94fbdda6-0a83-48f2-b84b-ce5d09de8ef4", name: "pricing", archived: false, action: "create" }]

      // // since tags on permissions has length... loop through each tag for the permission & update the tagOnPermission row
      // const tagsOnPermission = [{ permissionTagId: "768f6a8d-d21d-4581-b489-2fe8e2f06f01", id: "9b7bd094-a4d7-4ad8-bd28-ec8847823eca", archived: false, permissionId: "c6c5a157-987c-4629-adf8-d028d23f3ebd", action: "create" }, { permissionTagId: "9e75b302-3a2c-40b0-8e2d-ecbbfbbd4c97", id: "78d9d7e7-5691-4552-aef6-9ed84f5d323d", archived: false, permissionId: "c6c5a157-987c-4629-adf8-d028d23f3ebd", action: "create" }, { permissionTagId: "b3a96da8-2728-4679-af4c-f88eed344c9b", id: "4c9bce1f-1177-48d4-9329-32b1ddaf313e", archived: false, permissionId: "c6c5a157-987c-4629-adf8-d028d23f3ebd", action: "create" }, { permissionTagId: "94fbdda6-0a83-48f2-b84b-ce5d09de8ef4", id: "c6ed66ca-5ce4-4459-a197-a6667736051b", archived: false, permissionId: "c6c5a157-987c-4629-adf8-d028d23f3ebd", action: "create" }]

      // //
      // for (const permissionTag of permissionTags) {
      //   // handle creating a permission tag if needed
      //   if (permissionTag?.action === 'create') {
      //     // before creating, let's make sure it doesn't already exist in the database by name
      //     // if it does, overwrite the current id with the id in the database inside the permissionTagsOnPermissions obj
      //     // this allows the migration to make sure there aren't any duplicate permission tags...
      //     // Ex) Matt Rapp creates a migration locally adding a tag name = 'product' & Mark Davenport does the same... when running both migrations, should only add one of the permission tags, but share it across both permissions
      //     const permissionTagExists = await queryInterface.select(null, 'permissionTagsLookup', { where: { name: permissionTag.name } }).then((res) => JSON.parse(JSON.stringify(res)))
      //     if (!!permissionTagExists && !!permissionTagExists.length) {
      //       // if here, the permissionTag already exists in the db by name
      //       // find the permissionTagId inside the tagsOnPermissions array & replace it with the first one the permissionTagExists arr
      //       const tagOnPermIndex = tagsOnPermission.findIndex((tagOnPerm) => tagOnPerm.permissionTagId === permissionTag.id);
      //       // if not found... just move on through the loop with the next permissionTag
      //       if (tagOnPermIndex === -1) continue;
      //       tagsOnPermission[tagOnPermIndex] = permissionTagExists[0].id
      //     }
      //     else {
      //       // if here, the permissionTag doesn't exists in the db by name
      //       // create the permission tag.. the id already exists in the tagsOnPermissionsArr... so no need to add it to the array
      //       await queryInterface.bulkInsert('permissionTagsLookup', [{ id: permissionTag.id, name: permissionTag.name }])
      //     }
      //   }
      // }

      // // loop through each tag on permission & update the tag on permission row
      // for (const tagOnPermission of tagsOnPermission) {

      //   // handle archiving a tag on permission
      //   if (tagOnPermission.action === 'archive') {
      //     await queryInterface.bulkUpdate('permissionTagsOnPermissions', { archived: true }, { id: tagOnPermission.id })
      //   }

      //   // handle creating a tag on permission
      //   else if (tagOnPermission.action === 'create') {
      //     await queryInterface.bulkInsert('permissionTagsOnPermissions', [{ id: tagOnPermission.id, permissionId: tagOnPermission.permissionId, permissionTagId: tagOnPermission.permissionTagId }], { id: tagOnPermission.id })
      //   }
      // }

      // now attach permissions to the neccessary roles...
      const permissionsOnRoles = [
         {
            id: '933319b3-3001-455c-828e-4a4d06a90a0b',
            permissionId: 'c6c5a157-987c-4629-adf8-d028d23f3ebd',
            roleId: 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285',
            action: 'create',
         },
         {
            id: 'a4d92672-3997-4741-9def-3e2df51c71d2',
            permissionId: 'c6c5a157-987c-4629-adf8-d028d23f3ebd',
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
      const pagePermissionsToRevert = ['c6c5a157-987c-4629-adf8-d028d23f3ebd'];
      for (const permissionId of pagePermissionsToRevert) {
         // delete the permissions on role by permissionId
         await queryInterface.bulkDelete('permissionsOnRoles', [{ permissionId: permissionId }]);
         // delete the permissionsTags on permissions by permissionId
         //  await queryInterface.bulkDelete('permissionTagsOnPermissions', [{ permissionId: permissionId }]);
         // delete the page permissions by id
         await queryInterface.bulkDelete('permissions', { id: permissionId });
      }
      // delete the created permissionTags by id
      // const permissionTagIdsToDelete = [
      //    '768f6a8d-d21d-4581-b489-2fe8e2f06f01',
      //    '9e75b302-3a2c-40b0-8e2d-ecbbfbbd4c97',
      //    'b3a96da8-2728-4679-af4c-f88eed344c9b',
      //    '94fbdda6-0a83-48f2-b84b-ce5d09de8ef4',
      // ];
      // for (const permissionTagId of permissionTagIdsToDelete) {
      //    await queryInterface.bulkDelete('permissionTagsLookup', { id: permissionTagId });
      // }

      // delete the page created by id
      await queryInterface.bulkDelete('pagesLookup', { id: '081ccd78-7ca0-42e8-b6bf-34e709566d06' });
   },
};
