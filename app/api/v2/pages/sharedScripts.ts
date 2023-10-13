// FILE CONTAINS REUSABLE SCRIPT TO STRING UTILITIES BETWEEN THE CREATE & UPDATE PAGE SCRIPTS

export const generatePagePermissionsScript = () => {
   let pagePermissionsLoopScript = ``;

   let archivePagePermissionScript = ``;
   archivePagePermissionScript += `<tab><tab><tab><tab><tab>await queryInterface.bulkUpdate('permissions', { deletedAt: Date.now() }, { id: permission.id })`;
   pagePermissionsLoopScript += `<tab><tab><tab><tab>// handle archiving a permission`;
   pagePermissionsLoopScript += `<break><tab><tab><tab><tab>if (permission.action === 'archive') {<break>${archivePagePermissionScript}<break><tab><tab><tab><tab>}`;

   let updatePagePermissionScript = ``;
   updatePagePermissionScript += `<tab><tab><tab><tab><tab>await queryInterface.bulkUpdate('permissions', { name: permission.name, description: permission.description, isDefaultPermission: permission.isDefaultPermission, pageId: permission.pageId }, { id: permission.id })`;
   pagePermissionsLoopScript += `<break2><tab><tab><tab><tab>// handle updating a permission`;
   pagePermissionsLoopScript += `<break><tab><tab><tab><tab>else if (permission.action === 'update') {<break>${updatePagePermissionScript}<break><tab><tab><tab><tab>}`;

   let createPagePermissionScript = ``;
   createPagePermissionScript += `<break2><tab><tab><tab><tab><tab>// make a copy of the permission`;
   createPagePermissionScript += `<break><tab><tab><tab><tab><tab>const permissionCopy = { id: permission.id, name: permission.name, description: permission.description, isDefaultPermission: permission.isDefaultPermission, pageId: permission.pageId };`;
   createPagePermissionScript += `<break><tab><tab><tab><tab><tab>// create the permission & return it`;
   createPagePermissionScript += `<break><tab><tab><tab><tab><tab>await queryInterface.bulkInsert('permissions', [permissionCopy])`;

   pagePermissionsLoopScript += `<break2><tab><tab><tab><tab>// handle creating a permission`;
   pagePermissionsLoopScript += `<break><tab><tab><tab><tab>else if (permission.action === 'create') {<break>${createPagePermissionScript}<break><tab><tab><tab><tab>}`;

   return pagePermissionsLoopScript;
};

export const generatePermissionTagsScript = () => {
   let permissionTagsLoopScript = ``;

   let createPermissionTagScript = ``;
   createPermissionTagScript += `<tab><tab><tab><tab><tab>// before creating, let's make sure it doesn't already exist in the database by name`;
   createPermissionTagScript += `<break><tab><tab><tab><tab><tab>// if it does, overwrite the current id with the id in the database inside the permissionTagsOnPermissions obj`;
   createPermissionTagScript += `<break><tab><tab><tab><tab><tab>// this allows the migration to make sure there aren't any duplicate permission tags...`;
   createPermissionTagScript += `<break><tab><tab><tab><tab><tab>// Ex) Matt Rapp creates a migration locally adding a tag name = 'product' & Mark Davenport does the same... when running both migrations, should only add one of the permission tags, but share it across both permissions`;
   let permissionTagExistsScript = ``;
   permissionTagExistsScript += `<tab><tab><tab><tab><tab><tab>// if here, the permissionTag already exists in the db by name`;
   permissionTagExistsScript += `<break><tab><tab><tab><tab><tab><tab>// find the permissionTagId inside the tagsOnPermissions array & replace it with the first one the permissionTagExists arr`;
   permissionTagExistsScript += `<break><tab><tab><tab><tab><tab><tab>const tagOnPermIndex = tagsOnPermission.findIndex((tagOnPerm) => tagOnPerm.permissionTagId === permissionTag.id);`;
   permissionTagExistsScript += `<break><tab><tab><tab><tab><tab><tab>// if not found... just move on through the loop with the next permissionTag`;
   permissionTagExistsScript += `<break><tab><tab><tab><tab><tab><tab>if (tagOnPermIndex === -1) continue;`;

   // MADE PERMISSION TAG CHANGE HERE... I DON'T KNOW HOW THIS ISN'T CAUSING ERRORS... KEEPING THIS COMMENT FOR NOTES AS OF RIGHT NOW
   permissionTagExistsScript += `<break><tab><tab><tab><tab><tab><tab>tagsOnPermission[tagOnPermIndex].permissionTagId = permissionTagExists[0]?.id`;

   createPermissionTagScript += `<break><tab><tab><tab><tab><tab>const permissionTagExists = await queryInterface.select(null, 'permissionTagsLookup', { where: { name: permissionTag.name } }).then((res) => JSON.parse(JSON.stringify(res)))`;
   createPermissionTagScript += `<break><tab><tab><tab><tab><tab>if (!!permissionTagExists && !!permissionTagExists.length) {<break>${permissionTagExistsScript}<break><tab><tab><tab><tab><tab>}`;
   let permissionTagDoesNotExistsScript = ``;
   permissionTagDoesNotExistsScript += `<tab><tab><tab><tab><tab><tab>// if here, the permissionTag doesn't exists in the db by name`;
   permissionTagDoesNotExistsScript += `<break><tab><tab><tab><tab><tab><tab>// create the permission tag.. the id already exists in the tagsOnPermissionsArr... so no need to add it to the array`;
   permissionTagDoesNotExistsScript += `<break><tab><tab><tab><tab><tab><tab>await queryInterface.bulkInsert('permissionTagsLookup', [{ id: permissionTag.id, name: permissionTag.name }])`;

   createPermissionTagScript += `<break><tab><tab><tab><tab><tab>else {<break>${permissionTagDoesNotExistsScript}<break><tab><tab><tab><tab><tab>}`;
   permissionTagsLoopScript += `<tab><tab><tab><tab>// handle creating a permission tag if needed`;
   permissionTagsLoopScript += `<break><tab><tab><tab><tab>if (permissionTag?.action === 'create') {<break>${createPermissionTagScript}<break><tab><tab><tab><tab>}`;

   return permissionTagsLoopScript;
};

export const generateTagsOnPermissionsScript = () => {
   let tagsOnPermissionLoopScript = ``;

   // let createPermissionTagScript = ``;
   // createPermissionTagScript += `<tab><tab><tab><tab><tab>await queryInterface.bulkInsert('permissionTagsLookup', [{ id: tagOnPermission.permissionTag.id, name: tagOnPermission.permissionTag.name }], { returning: true })`;
   // tagsOnPermissionLoopScript += `<tab><tab><tab><tab>// handle creating a permission tag if needed`;
   // tagsOnPermissionLoopScript += `<break><tab><tab><tab><tab>if (tagOnPermission.permissionTag?.action === 'create') {<break>${createPermissionTagScript}<break><tab><tab><tab><tab>}`;

   let archiveTagOnPermissionScript = ``;
   archiveTagOnPermissionScript += `<tab><tab><tab><tab><tab>await queryInterface.bulkUpdate('permissionTagsOnPermissions', { deletedAt: Date.now() }, { id: tagOnPermission.id })`;
   tagsOnPermissionLoopScript += `<break2><tab><tab><tab><tab>// handle archiving a tag on permission`;
   tagsOnPermissionLoopScript += `<break><tab><tab><tab><tab>if (tagOnPermission.action === 'archive') {<break>${archiveTagOnPermissionScript}<break><tab><tab><tab><tab>}`;

   let createTagOnPermissionScript = ``;
   createTagOnPermissionScript += `<tab><tab><tab><tab><tab>await queryInterface.bulkInsert('permissionTagsOnPermissions', [{ id: tagOnPermission.id, permissionId: tagOnPermission.permissionId, permissionTagId: tagOnPermission.permissionTagId }], { id: tagOnPermission.id })`;
   tagsOnPermissionLoopScript += `<break2><tab><tab><tab><tab>// handle creating a tag on permission`;
   tagsOnPermissionLoopScript += `<break><tab><tab><tab><tab>else if (tagOnPermission.action === 'create') {<break>${createTagOnPermissionScript}<break><tab><tab><tab><tab>}`;

   return tagsOnPermissionLoopScript;
};

export const generatePermissionsOnRolesScript = () => {
   // let superSecretDevRoleId = await queryInterface.rawSelect('roles', { where: { name: 'Super Secret Dev' } }, ['id']);
   // let superAdminRoleId = await queryInterface.rawSelect('roles', { where: { name: 'Super Admin' } }, ['id']);

   let permissionsOnRolesLoopScript = ``;

   let archivePermissionOnRoleScript = ``;
   archivePermissionOnRoleScript += `<tab><tab><tab><tab><tab>await queryInterface.bulkUpdate('permissionsOnRoles', { deletedAt: new Date() }, { id: permissionOnRole.id })`;
   permissionsOnRolesLoopScript += `<break2><tab><tab><tab><tab>// handle archiving a permission on role`;
   permissionsOnRolesLoopScript += `<break><tab><tab><tab><tab>if (permissionOnRole?.action === 'archive') {<break>${archivePermissionOnRoleScript}<break><tab><tab><tab><tab>}`;

   // // i don't think we need this update script... all we do with permissions on roles is add or archive... permissionIds don't change, neither do roleIds
   // let updatePermissionOnRoleScript = ``;
   // updatePermissionOnRoleScript += `<tab><tab><tab><tab><tab>await queryInterface.bulkUpdate('permissionsOnRoles', {}, { permissionId: permissionOnRole.permissionId, roleId: permissionOnRole.roleId })`;
   // permissionsOnRolesLoopScript += `<break2><tab><tab><tab><tab>// handle updated a permission on role`;
   // permissionsOnRolesLoopScript += `<break><tab><tab><tab><tab>if (permissionOnRole?.action === 'update') {<break>${updatePermissionOnRoleScript}<break><tab><tab><tab><tab>}`;

   let createPermissionOnRoleScript = ``;
   createPermissionOnRoleScript += `<tab><tab><tab><tab><tab>await queryInterface.bulkInsert('permissionsOnRoles', [{ id: permissionOnRole.id, permissionId: permissionOnRole.permissionId, roleId: permissionOnRole.roleId }])`;
   permissionsOnRolesLoopScript += `<break2><tab><tab><tab><tab>// handle creating a permission on role`;
   permissionsOnRolesLoopScript += `<break><tab><tab><tab><tab>if (permissionOnRole?.action === 'create') {<break>${createPermissionOnRoleScript}<break><tab><tab><tab><tab>}`;

   return permissionsOnRolesLoopScript;
};

export const generatePreviousPagePermissionsScript = () => {
   let prevPagePermissionsLoopScript = ``;

   let deletePagePermissionScript = ``;
   deletePagePermissionScript += `<tab><tab><tab><tab><tab>await queryInterface.bulkDelete('permissions', { id: permission?.id });`;
   prevPagePermissionsLoopScript += `<tab><tab><tab><tab>// handle deleting a permission that was just created`;
   prevPagePermissionsLoopScript += `<break><tab><tab><tab><tab>if (permission.action === 'delete') {<break>${deletePagePermissionScript}<break><tab><tab><tab><tab>}`;

   let revertPagePermissionScript = ``;
   revertPagePermissionScript += `<tab><tab><tab><tab><tab>const permissionToAlterCopy = { ...JSON.parse(JSON.stringify(permission)) };`;
   revertPagePermissionScript += `<break><tab><tab><tab><tab><tab>// delete unneccesary keys`;
   revertPagePermissionScript += `<break><tab><tab><tab><tab><tab>delete permissionToAlterCopy['action']`;
   revertPagePermissionScript += `<break><tab><tab><tab><tab><tab>delete permissionToAlterCopy['id']`;
   revertPagePermissionScript += `<break><tab><tab><tab><tab><tab>delete permissionToAlterCopy['rowId']`;
   revertPagePermissionScript += `<break><tab><tab><tab><tab><tab>await queryInterface.bulkUpdate('permissions', permissionToAlterCopy, { id: permission.id })`;
   prevPagePermissionsLoopScript += `<break2><tab><tab><tab><tab>// handle reverting a permission that was just altered`;
   prevPagePermissionsLoopScript += `<break><tab><tab><tab><tab>else if (permission.action === 'revert') {<break>${revertPagePermissionScript}<break><tab><tab><tab><tab>}`;

   return prevPagePermissionsLoopScript;
};

export const generatePreviousTagsOnPermissionsScript = () => {
   let prevTagsOnPermissionsLoopScript = ``;

   let deleteTagOnPermissionScript = ``;
   deleteTagOnPermissionScript += `<tab><tab><tab><tab><tab>await queryInterface.bulkDelete('permissionTagsOnPermissions', { id: tagOnPermission?.id });`;
   // prevTagsOnPermissionsLoopScript += `<break2><tab><tab><tab><tab>// HANDLE TAG ON PERMISSION LOGIC`;
   prevTagsOnPermissionsLoopScript += `<break><tab><tab><tab><tab>// handle deleting a tag on permission that was just created`;
   prevTagsOnPermissionsLoopScript += `<break><tab><tab><tab><tab>if (tagOnPermission.action === 'delete') {<break>${deleteTagOnPermissionScript}<break><tab><tab><tab><tab>}`;

   let revertTagOnPermissionScript = ``;
   revertTagOnPermissionScript += `<tab><tab><tab><tab><tab>const tagToAlterCopy = { ...JSON.parse(JSON.stringify(tagOnPermission)) };`;
   revertTagOnPermissionScript += `<break><tab><tab><tab><tab><tab>// delete unneccesary keys`;
   revertTagOnPermissionScript += `<break><tab><tab><tab><tab><tab>delete tagToAlterCopy['action']`;
   revertTagOnPermissionScript += `<break><tab><tab><tab><tab><tab>delete tagToAlterCopy['id']`;
   revertTagOnPermissionScript += `<break><tab><tab><tab><tab><tab>delete tagToAlterCopy['rowId']`;
   revertTagOnPermissionScript += `<break><tab><tab><tab><tab><tab>delete tagToAlterCopy['permissionTag']`;
   revertTagOnPermissionScript += `<break><tab><tab><tab><tab><tab>await queryInterface.bulkUpdate('permissionTagsOnPermissions', tagToAlterCopy, { id: tagOnPermission?.id })`;
   prevTagsOnPermissionsLoopScript += `<break2><tab><tab><tab><tab>// handle reverting a permission that was just altered`;
   prevTagsOnPermissionsLoopScript += `<break><tab><tab><tab><tab>else if (tagOnPermission.action === 'revert') {<break>${revertTagOnPermissionScript}<break><tab><tab><tab><tab>}`;

   // let deletePermissionTagScript = ``;
   // deletePermissionTagScript += `<tab><tab><tab><tab><tab>await queryInterface.bulkDelete('permissionTagsLookup', { id: tagOnPermission?.permissionTag?.id });`;
   // prevTagsOnPermissionsLoopScript += `<break2><tab><tab><tab><tab>// handle deleting a tag that was just created`;
   // prevTagsOnPermissionsLoopScript += `<break><tab><tab><tab><tab>// we don't need to worry about reverting it... because you can't update a permissionTag as of now`;
   // prevTagsOnPermissionsLoopScript += `<break><tab><tab><tab><tab>if (tagOnPermission?.permissionTag?.action === 'delete') {<break>${deletePermissionTagScript}<break><tab><tab><tab><tab>}`;

   return prevTagsOnPermissionsLoopScript;
};

export const generatePreviousPermissionTagsScript = () => {
   let prevPermTagsLoopScript = ``;

   let deletePermissionTagScript = ``;
   deletePermissionTagScript += `<tab><tab><tab><tab><tab>await queryInterface.bulkDelete('permissionTagsLookup', { id: permissionTag?.id });`;
   prevPermTagsLoopScript += `<break2><tab><tab><tab><tab>// handle deleting a tag that was just created`;
   prevPermTagsLoopScript += `<break><tab><tab><tab><tab>// we don't need to worry about reverting it... because you can't update a permissionTag as of now`;
   prevPermTagsLoopScript += `<break><tab><tab><tab><tab>if (permissionTag?.action === 'delete') {<break>${deletePermissionTagScript}<break><tab><tab><tab><tab>}`;

   return prevPermTagsLoopScript;
};

export const generatePrevousPermissionsOnRolesScript = () => {
   let prevPermissionsOnRolesLoopScript = ``;

   let deletePermissionOnRoleScript = ``;
   deletePermissionOnRoleScript += `<tab><tab><tab><tab><tab>await queryInterface.bulkDelete('permissionsOnRoles', { permissionId: permissionOnRole?.permissionId, roleId: permissionOnRole?.roleId });`;
   prevPermissionsOnRolesLoopScript += `<tab><tab><tab><tab>// handle deleting a permission that was just created`;
   prevPermissionsOnRolesLoopScript += `<break><tab><tab><tab><tab>if (permissionOnRole.action === 'delete') {<break>${deletePermissionOnRoleScript}<break><tab><tab><tab><tab>}`;

   let revertPermissionOnRoleScript = ``;
   revertPermissionOnRoleScript += `<tab><tab><tab><tab><tab>const roleOnPermissionCopy = { ...JSON.parse(JSON.stringify(permissionOnRole)) };`;
   revertPermissionOnRoleScript += `<break><tab><tab><tab><tab><tab>// delete unneccesary keys`;
   revertPermissionOnRoleScript += `<break><tab><tab><tab><tab><tab>delete roleOnPermissionCopy['action']`;
   revertPermissionOnRoleScript += `<break><tab><tab><tab><tab><tab>await queryInterface.bulkUpdate('permissionsOnRoles', roleOnPermissionCopy, { id: permissionOnRole?.id })`;
   prevPermissionsOnRolesLoopScript += `<break2><tab><tab><tab><tab>// handle reverting a permission that was just altered`;
   prevPermissionsOnRolesLoopScript += `<break><tab><tab><tab><tab>else if (permissionOnRole.action === 'revert') {<break>${revertPermissionOnRoleScript}<break><tab><tab><tab><tab>}`;

   return prevPermissionsOnRolesLoopScript;
};
