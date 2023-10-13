'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      /** Add altering commands here. */


      // create page in db
      await queryInterface.bulkInsert('pagesLookup', [{ id: "87195e14-3bc0-40d2-b798-631dee5dd181", name: "Lead Ingestion", iconName: "ArrowButtonUp", iconColor: null, route: "marketing/lead-ingestion", parentPageId: "2b52758c-b72f-4dca-b9b3-c176c10b5064", displayOrder: 3, showOnSidebar: true }]);

      // since page permissions has length...
      const pagePermissions = [{ id: "1d3e7658-5277-41f4-b94f-6e37effc2940", archived: false, description: "Default permission description...", isDefaultPermission: true, name: "VIEW (Default Permission)", addPermissionToSuperAdmin: true, pageId: "87195e14-3bc0-40d2-b798-631dee5dd181", action: "create" }]



      // loop through each permission & update the permission
      for (const permission of pagePermissions) {
         // handle archiving a permission
         if (permission.action === 'archive') {
            await queryInterface.bulkUpdate('permissions', { deletedAt: Date.now() }, { id: permission.id })
         }

         // handle updating a permission
         else if (permission.action === 'update') {
            await queryInterface.bulkUpdate('permissions', { name: permission.name, description: permission.description, isDefaultPermission: permission.isDefaultPermission, pageId: permission.pageId }, { id: permission.id })
         }

         // handle creating a permission
         else if (permission.action === 'create') {


            // make a copy of the permission
            const permissionCopy = { id: permission.id, name: permission.name, description: permission.description, isDefaultPermission: permission.isDefaultPermission, pageId: permission.pageId };
            // create the permission & return it
            await queryInterface.bulkInsert('permissions', [permissionCopy])
         }
      }

      // now attach permissions to the neccessary roles...
      const permissionsOnRoles = [{ id: "5994f899-1b70-4d89-bed5-c0b40074c3f4", permissionId: "1d3e7658-5277-41f4-b94f-6e37effc2940", roleId: "b1421034-7ad9-40fc-bc3b-dc4f00c7e285", action: "create" }, { id: "3eed10e8-591e-4f81-bd5d-a1c1db20249d", permissionId: "1d3e7658-5277-41f4-b94f-6e37effc2940", roleId: "dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6", action: "create" }]

      // loop through each permission on role & add to db...
      for (const permissionOnRole of permissionsOnRoles) {


         // handle archiving a permission on role
         if (permissionOnRole?.action === 'archive') {
            await queryInterface.bulkUpdate('permissionsOnRoles', { deletedAt: new Date() }, { id: permissionOnRole.id })
         }

         // handle creating a permission on role
         if (permissionOnRole?.action === 'create') {
            await queryInterface.bulkInsert('permissionsOnRoles', [{ id: permissionOnRole.id, permissionId: permissionOnRole.permissionId, roleId: permissionOnRole.roleId }])
         }
      }
   },

   async down(queryInterface, Sequelize) {
      /** Add reverting commands here. */


      // permissionIds that need to be deleted from the db
      const pagePermissionsToRevert = ["1d3e7658-5277-41f4-b94f-6e37effc2940"]
      for (const permissionId of pagePermissionsToRevert) {
         // delete the permissions on role by permissionId
         await queryInterface.bulkDelete('permissionsOnRoles', [{ permissionId: permissionId }]);
         // delete the permissionsTags on permissions by permissionId
         await queryInterface.bulkDelete('permissionTagsOnPermissions', [{ permissionId: permissionId }]);
         // delete the page permissions by id
         await queryInterface.bulkDelete('permissions', { id: permissionId });
      }
      // delete the created permissionTags by id
      const permissionTagIdsToDelete = []
      for (const permissionTagId of permissionTagIdsToDelete) {

         await queryInterface.bulkDelete('permissionTagsLookup', { id: permissionTagId });
      }

      // delete the page created by id
      await queryInterface.bulkDelete('pagesLookup', { id: '87195e14-3bc0-40d2-b798-631dee5dd181' });
   }
}