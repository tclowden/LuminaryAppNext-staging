import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { deepCopy } from '@/utilities/helpers';
import {
   arrayToString,
   formatPageData,
   formatPagePermissionsArr,
   formatPagePermissionsUp,
   formatPermissionsOnRoles,
   formatTagsOnPermissionsArr,
   formatTagsOnPermissionsUp,
   formatTagsUp,
   objectToString,
} from '../../formatters';
const Sequelize = require('sequelize');
import * as Yup from 'yup';
import {
   generatePagePermissionsScript,
   generatePermissionTagsScript,
   generatePermissionsOnRolesScript,
   generatePreviousPagePermissionsScript,
   generatePreviousPermissionTagsScript,
   generatePreviousTagsOnPermissionsScript,
   generatePrevousPermissionsOnRolesScript,
   generateTagsOnPermissionsScript,
} from '../../sharedScripts';
import { pageExistsCheck, validateChildrenPages, validatePagePermissions, validateParams } from '../../utilities';

// archive a page to migration
async function deletePageScript(request: NextRequest, options: any) {
   try {
      const { id } = validateParams(options.params);

      // see if page exists
      await pageExistsCheck(id);

      // initiate logic scripts
      let upLogicScript = ``;
      let downLogicScript = ``;

      upLogicScript += `<tab><tab>// archive everything associated to the page in db`;
      upLogicScript += `<break2><tab><tab>// store the page id in variable`;
      upLogicScript += `<break><tab><tab>const pageId = '${id}'`;
      downLogicScript += `<tab><tab>// unarchive everything associated to the page in db`;
      downLogicScript += `<break2><tab><tab>// store the page id in variable`;
      downLogicScript += `<break><tab><tab>const pageId = '${id}'`;
      const prevPageData = await db.pagesLookup.findByPk(id).then(deepCopy);
      downLogicScript += `<break><tab><tab>const archivedPrevData = ${objectToString(prevPageData)}`;

      // get all the pages that may be nested inside that page...
      // for ex) archive an app? gotta archvie the sections and pages tied to that app
      const nestedPagesRes = await getNestedPageIds(id);
      const nestedPages = [...nestedPagesRes].map((page) => ({ id: page?.id, updatedAt: page?.updatedAt }));
      const nestedPageIdsStr = [...nestedPagesRes].map((page) => `'${page.id}'`);
      upLogicScript += `<break2><tab><tab>// store the nested page ids in variable`;
      upLogicScript += `<break><tab><tab>const nestedPageIds = [${nestedPageIdsStr}]`;
      downLogicScript += `<break2><tab><tab>// store the nested page ids in variable`;
      downLogicScript += `<break><tab><tab>const nestedPages = [${arrayToString(nestedPages)}]`;

      const allPageIds = [id, ...nestedPages.map((page) => page.id)];

      // get all the permissions by the pageId that aren't already soft deleted
      const permissionsToArchived = await db.permissions
         .findAll({
            where: { pageId: { [Sequelize.Op.in]: allPageIds } },
         })
         .then(deepCopy);
      let permissionsToUnarchive = permissionsToArchived.map((perm: any) => ({
         id: perm?.id,
         updatedAt: perm.updatedAt,
      }));
      const permissionIdsToArchived = permissionsToArchived.map((permission: any) => `'${permission.id}'`);
      upLogicScript += `<break2>// the permission ids to archive`;
      upLogicScript += `<break><tab><tab>const permissionIdsToArchive = [${permissionIdsToArchived}]`;
      downLogicScript += `<break2>// the permissions to unarchive (revert)`;
      downLogicScript += `<break><tab><tab>const permissionToUnArchive = [${arrayToString(permissionsToUnarchive)}]`;

      // get all the permissionsOnRoles by each permissionId... which makes them associated to the page
      let permissionsOnRolesToArchive: Array<any> = [];
      for (const permission of permissionsToArchived) {
         const rolesAttachedToPermission = await db.permissionsOnRoles
            .findAll({ where: { permissionId: permission.id } })
            .then(deepCopy);
         permissionsOnRolesToArchive = [...permissionsOnRolesToArchive, rolesAttachedToPermission];
      }
      permissionsOnRolesToArchive = [...permissionsOnRolesToArchive].flat();
      let permissionsOnRolesToUnarchive = permissionsOnRolesToArchive.map((tagOnPerm) => ({
         id: tagOnPerm?.id,
         updatedAt: tagOnPerm.updatedAt,
      }));
      let permissionsOnRoleIdsToArchive = permissionsOnRolesToArchive.map((permOnRole) => `'${permOnRole.id}'`);
      upLogicScript += `<break2>// the permission on roles to archive`;
      upLogicScript += `<break><tab><tab>const permissionOnRolesToArchive = [${permissionsOnRoleIdsToArchive}]`;
      downLogicScript += `<break2>// the permission on roles to unarchive (revert)`;
      downLogicScript += `<break><tab><tab>const permissionOnRolesToUnArchive = [${arrayToString(
         permissionsOnRolesToUnarchive
      )}]`;

      // get all the permissionTagsOnPermission by the permissionId
      let permissionTagsOnPermissionsToArchive: Array<any> = [];
      for (const permission of permissionsToArchived) {
         const tagsOnPermission = await db.permissionTagsOnPermissions
            .findAll({ where: { permissionId: permission.id } })
            .then(deepCopy);
         permissionTagsOnPermissionsToArchive = [...permissionTagsOnPermissionsToArchive, tagsOnPermission];
      }
      permissionTagsOnPermissionsToArchive = [...permissionTagsOnPermissionsToArchive].flat();
      let permissionTagsOnPermissionsToUnarchive = permissionTagsOnPermissionsToArchive.map((tagOnPerm) => ({
         id: tagOnPerm?.id,
         updatedAt: tagOnPerm.updatedAt,
      }));
      let permissionTagsOnPermissionIdsToArchive = permissionTagsOnPermissionsToArchive.map(
         (tagOnPerm) => `'${tagOnPerm.id}'`
      );
      upLogicScript += `<break2>// the permission tags on permissions to archive`;
      upLogicScript += `<break><tab><tab>const permissionTagsOnPermissionsToArchive = [${permissionTagsOnPermissionIdsToArchive}]`;
      downLogicScript += `<break2>// the permission tags on permissions to unarchive (revert)`;
      downLogicScript += `<break><tab><tab>const permissionTagsOnPermissionsToUnArchive = [${arrayToString(
         permissionTagsOnPermissionsToUnarchive
      )}]`;

      // HANDLE permissionTagsOnPermissions logic
      upLogicScript += `<break2>// loop through all the permissionTagsOnPermissions & archive them`;
      upLogicScript += `<break><tab><tab>await queryInterface.bulkUpdate('permissionTagsOnPermissions', { deletedAt: new Date() }, { id: { [Sequelize.Op.in]: permissionTagsOnPermissionsToArchive } })`;
      let unarchivePermTagsOnPermsLoopScript = ``;
      unarchivePermTagsOnPermsLoopScript += `<tab><tab><tab>await queryInterface.bulkUpdate('permissionTagsOnPermissions', { deletedAt: null, updatedAt: tagOnPermission.updatedAt }, { id: tagOnPermission.id });`;
      downLogicScript += `<break2>// loop through all the permissionTagsOnPermissions & unarchive (revert)`;
      downLogicScript += `<break><tab><tab>for (const tagOnPermission of permissionTagsOnPermissionsToUnArchive) {<break>${unarchivePermTagsOnPermsLoopScript}<break><tab><tab>}`;

      // HANDLE permissionOnRoles logic
      upLogicScript += `<break2>// loop through all the permissions on roles & archive them`;
      upLogicScript += `<break><tab><tab>await queryInterface.bulkUpdate('permissionsOnRoles', { deletedAt: new Date() }, { id: { [Sequelize.Op.in]: permissionOnRolesToArchive } })`;
      let unarchivePermsOnRolesLoopScript = ``;
      unarchivePermsOnRolesLoopScript += `<tab><tab><tab>await queryInterface.bulkUpdate('permissionsOnRoles', { deletedAt: null, updatedAt: permissionOnRole.updatedAt }, { id: permissionOnRole.id });`;
      downLogicScript += `<break2>// loop through all the permissions on roles & unarchive (revert)`;
      downLogicScript += `<break><tab><tab>for (const permissionOnRole of permissionOnRolesToUnArchive) {<break>${unarchivePermsOnRolesLoopScript}<break><tab><tab>}`;

      // HANDLE permissions logic
      upLogicScript += `<break2>// loop through all the permissions & archive them`;
      upLogicScript += `<break><tab><tab>await queryInterface.bulkUpdate('permissions', { deletedAt: new Date() }, { id: { [Sequelize.Op.in]: permissionIdsToArchive } })`;
      let unarchivePermissionsLoopScript = ``;
      unarchivePermissionsLoopScript += `<tab><tab><tab>await queryInterface.bulkUpdate('permissions', { deletedAt: null, updatedAt: permission.updatedAt }, { id: permission.id });`;
      downLogicScript += `<break2>// loop through all the permissions & unarchive (revert)`;
      downLogicScript += `<break><tab><tab>for (const permission of permissionToUnArchive) {<break>${unarchivePermissionsLoopScript}<break><tab><tab>}`;

      // HANDLE nested pages logic
      upLogicScript += `<break2>// loop through all the nested (children) pages & archive them`;
      upLogicScript += `<break><tab><tab>await queryInterface.bulkUpdate('pagesLookup', { deletedAt: new Date() }, { id: { [Sequelize.Op.in]: nestedPageIds } })`;
      let unarchiveNestedPagesLoopScript = ``;
      unarchiveNestedPagesLoopScript += `<tab><tab><tab>await queryInterface.bulkUpdate('pagesLookup', { deletedAt: null, updatedAt: page.updatedAt }, { id: page.id });`;
      downLogicScript += `<break2>// loop through all the nested (children) pages & unarchive (revert)`;
      downLogicScript += `<break><tab><tab>for (const page of nestedPages) {<break>${unarchiveNestedPagesLoopScript}<break><tab><tab>}`;

      // archive page
      upLogicScript += `<break2><tab><tab> // archive the page`;
      upLogicScript += `<break><tab><tab>await queryInterface.bulkUpdate('pagesLookup', { deletedAt: new Date() }, { id: pageId });`;
      // unarchive page
      downLogicScript += `<break2><tab><tab>// unarchive the page`;
      downLogicScript += `<break><tab><tab>await queryInterface.bulkUpdate('pagesLookup', { deletedAt: null, updatedAt: archivedPrevData.updatedAt }, { id: pageId });`;

      // initate the script string to return
      let scriptToReturn = ``;
      let upScript = `<tab>async up (queryInterface, Sequelize) {<break><tab><tab>/** Add altering commands here. */<break>${upLogicScript}<break><tab>}`;
      let downScript = `<tab>async down (queryInterface, Sequelize) {<break><tab><tab>/** Add reverting commands here. */<break>${downLogicScript}<break><tab>}`;
      scriptToReturn = `'use strict';<break2>/** @type {import('sequelize-cli').Migration} */<break>module.exports = {<break>${upScript}, <break2>${downScript}<break>}`;

      return NextResponse.json(scriptToReturn, { status: 200 });
   } catch (err: any) {
      console.log('err', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
export { deletePageScript as DELETE };

// update a page to migration
async function updatePageScript(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema: any = Yup.object({
         name: Yup.string().required().nullable(),
         iconName: Yup.string().required().nullable(),
         iconColor: Yup.string().required().nullable(),
         route: Yup.string().required().nullable(),
         displayOrder: Yup.number().required(),
         parentPageId: Yup.string().required().nullable(),
         showOnSidebar: Yup.boolean().required(),
         childrenPages: Yup.array().required(),
         pagePermissions: Yup.array().required(),
      });
      await schema.validate(reqBody);

      const { id } = validateParams(options.params);

      // see if page exists
      await pageExistsCheck(id);

      if (!!reqBody.childrenPages.length) {
         await validateChildrenPages(reqBody.childrenPages);
         // for (const page of reqBody.childrenPages) {
         //    const schema: any = Yup.object({
         //       id: Yup.string().required(`Id for each children page is required.`),
         //       displayOrder: Yup.number().required(`Display order for each children page is required.`),
         //    });
         //    await schema.validate(page);
         //    // see if page exists
         //    await pageExistsCheck(page?.id);
         // }

         // // validate the displayOrder is unique...
         // const allPagesDisplayOrderCopy = new Set(reqBody.childrenPages.map((p: any) => p.displayOrder));
         // if (allPagesDisplayOrderCopy.size < reqBody.childrenPages.length)
         //    throw new LumError(400, `There is a duplicate display order value within the children pages array.`);
      }

      if (!!reqBody.pagePermissions.length) {
         await validatePagePermissions(reqBody.pagePermissions, id);
         // for (const permission of reqBody.pagePermissions) {
         //    const schema: any = Yup.object({
         //       id: Yup.string().nullable().required(),
         //       name: Yup.string().required(`Name within page permissions is required.`),
         //       description: Yup.string().required(`Description within page permissions is required.`),
         //       addPermissionToSuperAdmin: Yup.boolean(),
         //       isDefaultPermission: Yup.boolean().required(
         //          'Is default permission within page permissions is required.'
         //       ),
         //       permissionTagsOnPermission: Yup.array().required(
         //          `Permission tags on permission array within page permission is required, even if it's an emty array.`
         //       ),
         //    });
         //    await schema.validate(permission);

         //    // this if/else should only happen when updating
         //    // HINT: the 'req.params.id'
         //    if (permission?.id && id) {
         //       // validation the permission exists
         //       const permissionIdExists = await db.permissions
         //          .unscoped()
         //          .findByPk(permission.id)
         //          .catch((err: any) => {
         //             throw new LumError(400, err);
         //          });
         //       if (!permissionIdExists) throw new LumError(400, `Permission with id: ${permission.id} doesn't exist.`);
         //    } else if (!permission?.id && id) {
         //       // validate the name isn't duplicated by pageId & by name
         //       // see if name already exists... must be unique to the parentId
         //       const permissionExists = await db.permissions
         //          .unscoped()
         //          .findOne({ where: { name: permission.name, pageId: id } })
         //          .catch((err: any) => {
         //             throw new LumError(400, err);
         //          });
         //       // append id to obj if exists
         //       if (permissionExists) {
         //          permission['id'] = permissionExists.id;
         //          permission['archived'] = false;
         //       }
         //    }

         //    if (!!permission.permissionTagsOnPermission?.length) {
         //       const permissionTagsOnPermission = permission.permissionTagsOnPermission;
         //       for (const tagOnPermission of permissionTagsOnPermission) {
         //          const schema: any = Yup.object({
         //             permissionTagId: Yup.string().nullable().required(),
         //             permissionTag: Yup.object().when('permissionTagId', {
         //                is: null,
         //                then: () =>
         //                   Yup.object().required(
         //                      `When permission tag id is null, must pass in a permission tag object to save.`
         //                   ),
         //                otherwise: () => Yup.object().notRequired(),
         //             }),
         //          });
         //          await schema.validate(tagOnPermission);

         //          // if no permissionTagId... make sure there is a permissionTag name exists
         //          if (!tagOnPermission.permissionTagId) {
         //             const schema = Yup.object({
         //                name: Yup.string().required(`Name within the tagOnPermission.permissionTag object is required`),
         //             });
         //             await schema.validate(tagOnPermission.permissionTag);

         //             // if there isn't a permissionTagId... but there is an id inside the permissionTag object... attach the id to the top level object
         //             if (tagOnPermission.permissionTag?.id)
         //                tagOnPermission['permissionTagId'] = tagOnPermission.permissionTag.id;
         //          }

         //          // if there is a permissionTagId... validate it
         //          if (tagOnPermission.permissionTagId) {
         //             const permissionTagIdExists = await db.permissionTagsLookup
         //                .findByPk(tagOnPermission.permissionTagId)
         //                .catch((err: any) => {
         //                   throw new LumError(400, err);
         //                });
         //             if (!permissionTagIdExists)
         //                throw new LumError(
         //                   400,
         //                   `Permission tag with id: '${tagOnPermission.permissionTagId}' doens't exist.`
         //                );
         //          } else {
         //             // see if one already exists by name... if so, just use that row & update it
         //             const permissionTagExistsByName = await db.permissionTagsLookup.findOne({
         //                where: { name: tagOnPermission.permissionTag.name },
         //             });
         //             if (permissionTagExistsByName) tagOnPermission['permissionTagId'] = permissionTagExistsByName.id;
         //          }
         //       }
         //    }
         // }

         // // make sure there isn't more than one default permission
         // let pagePermsDefaultBools: Array<any> = [];
         // reqBody.pagePermissions?.forEach((permission: any) => {
         //    if (permission.isDefaultPermission && !pagePermsDefaultBools.includes('true'))
         //       pagePermsDefaultBools.push('true');
         //    else pagePermsDefaultBools.push('false');
         // });
         // if (pagePermsDefaultBools.length < reqBody.pagePermissions?.length)
         //    throw new LumError(400, `There is more than one default permission.`);
      }

      // this means that it's either a section or a page... not an app
      if (reqBody.parentPageId) await pageExistsCheck(reqBody.parentPageId);

      // validate the displayOrder is unique to the parentPageId...
      // need to see if it's the same row being updated... if so, just ignore
      const pageWithDisplayOrderDuplicate = await db.pagesLookup.findOne({
         where: { displayOrder: reqBody.displayOrder, parentPageId: reqBody.parentPageId },
      });
      if (pageWithDisplayOrderDuplicate && pageWithDisplayOrderDuplicate.id !== id)
         throw new LumError(400, `There is a duplicate display order value.`);

      // DONE VALIDATING

      // initiate logic scripts
      let upLogicScript = ``;
      let downLogicScript = ``;

      // initiate an object to configure the page
      // id: req.params.id, // don't update the ID....
      let pageData: any = formatPageData(reqBody);
      pageData = objectToString(pageData);

      // update the page
      upLogicScript += `<break2><tab><tab>// update page and save to variable`;
      upLogicScript += `<break><tab><tab>await queryInterface.bulkUpdate('pagesLookup', ${pageData}, { id: '${id}' });`;

      // if children pages exist... update their displayOrder
      if (!!reqBody.childrenPages?.length) {
         // UP LOGIC
         const childrenPages = reqBody.childrenPages.map((page: any) => {
            const formattedPage = formatChildPage(page);
            return objectToString(formattedPage);
         });
         upLogicScript += `<break2><tab><tab><tab>// since page children pages has length... loop through each pages & update the displayOrder`;
         upLogicScript += `<break><tab><tab><tab>const childrenPages = [${childrenPages}]<break2>`;
         let nestedForLoopScript = ``;
         nestedForLoopScript += `<tab><tab><tab><tab>await queryInterface.bulkUpdate('pagesLookup', { displayOrder: page?.displayOrder }, { id: page?.id })`;
         upLogicScript += `<tab><tab><tab>// loop through all the page permissions to create / update`;
         upLogicScript += `<break><tab><tab><tab>for (const page of childrenPages) {<break>${nestedForLoopScript}<break><tab><tab><tab>}`;

         // DOWN LOGIC
         const childrenPageIds = reqBody.childrenPages.map((page: any) => page.id);
         let prevChildrenPageData = await db.pagesLookup
            .findAll({
               attributes: ['id', 'name', 'displayOrder'],
               where: { id: { [Sequelize.Op.in]: childrenPageIds } },
            })
            .then(deepCopy);
         prevChildrenPageData = arrayToString(prevChildrenPageData);
         downLogicScript += `<break2><tab><tab><tab>// since page children pages has length... loop through each pages & update the revert back the displayOrder`;
         downLogicScript += `<break><tab><tab><tab>const childrenPagesPrevData = [${prevChildrenPageData}]<break2>`;

         let nestedForLoopDownScript = ``;
         nestedForLoopDownScript += `<tab><tab><tab><tab>await queryInterface.bulkUpdate('pagesLookup', { displayOrder: page?.displayOrder }, { id: page?.id })`;
         downLogicScript += `<tab><tab><tab>// loop through all the page permissions to create / update`;
         downLogicScript += `<break><tab><tab><tab>for (const page of childrenPagesPrevData) {<break>${nestedForLoopDownScript}<break><tab><tab><tab>}`;
      }

      // if page permissions has length ... update them
      if (!!reqBody.pagePermissions.length) {
         // Get structured data
         const pagePermissions = formatPagePermissionsArr([...JSON.parse(JSON.stringify(reqBody.pagePermissions))], id);
         const [permissionTags, tagsOnPermissions] = formatTagsOnPermissionsArr([
            ...JSON.parse(JSON.stringify(pagePermissions)),
         ]);
         const permissionsOnRoles = await formatPermissionsOnRoles([...JSON.parse(JSON.stringify(pagePermissions))]);

         // UP LOGIC
         const pagePermissionsUp = formatPagePermissionsUp([...JSON.parse(JSON.stringify(pagePermissions))]);
         const pagePermissionsStr = arrayToString(pagePermissionsUp);
         upLogicScript += `<break2><tab><tab><tab>// since page permissions has length...`;
         upLogicScript += `<break><tab><tab><tab>const pagePermissions = [${pagePermissionsStr}]<break2>`;
         let pagePermissionsLoopScript = generatePagePermissionsScript();
         upLogicScript += `<break2><tab><tab><tab>// loop through each permission & update the permission`;
         upLogicScript += `<break><tab><tab><tab>for (const permission of pagePermissions) {<break>${pagePermissionsLoopScript}<break><tab><tab><tab>}`;

         if (!!tagsOnPermissions.length) {
            // handle the permissionTags logic here
            const tagsUp = formatTagsUp([...JSON.parse(JSON.stringify(permissionTags))]);
            const tagsUpStr = arrayToString(tagsUp);
            upLogicScript += `<break2><tab><tab><tab>// since tags on permissions has length... loop through each tag & and see if the tag needs to be created or not`;
            upLogicScript += `<break><tab><tab><tab>const permissionTags = [${tagsUpStr}]<break2>`;

            const tagsOnPermissionsUp = formatTagsOnPermissionsUp([...JSON.parse(JSON.stringify(tagsOnPermissions))]);
            const tagsOnPermissionsStr = arrayToString(tagsOnPermissionsUp);
            upLogicScript += `<break2><tab><tab><tab>// since tags on permissions has length... loop through each tag for the permission & update the tagOnPermission row`;
            upLogicScript += `<break><tab><tab><tab>const tagsOnPermission = [${tagsOnPermissionsStr}]<break2>`;

            let permissionTagsLoopScript = generatePermissionTagsScript();
            upLogicScript += `<break2><tab><tab><tab>// `;
            upLogicScript += `<break><tab><tab><tab>for (const permissionTag of permissionTags) {<break>${permissionTagsLoopScript}<break><tab><tab><tab>}`;

            let tagsOnPermissionLoopScript = generateTagsOnPermissionsScript();
            upLogicScript += `<break2><tab><tab><tab>// loop through each tag on permission & update the tag on permission row`;
            upLogicScript += `<break><tab><tab><tab>for (const tagOnPermission of tagsOnPermission) {<break>${tagsOnPermissionLoopScript}<break><tab><tab><tab>}`;
         }

         const permissionsOnRolesStr = arrayToString(permissionsOnRoles);
         upLogicScript += `<break2><tab><tab><tab>// now attach permissions to the neccessary roles...`;
         upLogicScript += `<break><tab><tab><tab>const permissionsOnRoles = [${permissionsOnRolesStr}]`;
         let permissionsOnRolesLoopScript = generatePermissionsOnRolesScript();
         upLogicScript += `<break2><tab><tab><tab>// loop through each permission on role & add to db...`;
         upLogicScript += `<break><tab><tab><tab>for (const permissionOnRole of permissionsOnRoles) {<break>${permissionsOnRolesLoopScript}<break>}`;

         // DOWN LOGIC
         let prevPagePermissionData: any = await formatPrevPagePermissionData([
            ...JSON.parse(JSON.stringify(pagePermissions)),
         ]);
         prevPagePermissionData = arrayToString(prevPagePermissionData);
         downLogicScript += `<break2><tab><tab><tab>// since page permissions has length... loop through each permission & update the permission`;
         downLogicScript += `<break><tab><tab><tab>const pagePermissionsPrevData = [${prevPagePermissionData}]<break2>`;

         if (!!tagsOnPermissions.length) {
            let prevPermissionsTagsData: any = await formatPrevPermissionTags([
               ...JSON.parse(JSON.stringify(permissionTags)),
            ]);
            prevPermissionsTagsData = arrayToString(prevPermissionsTagsData);
            downLogicScript += `<break2><tab><tab><tab>// since tags on permissions has length... loop through each tag & revert the tag or delete the tag`;
            downLogicScript += `<break><tab><tab><tab>const permissionTagsPrevData = [${prevPermissionsTagsData}]<break2>`;

            let prevTagsOnPermissionData: any = await formatPrevTagsOnPermissionData([
               ...JSON.parse(JSON.stringify(tagsOnPermissions)),
            ]);
            prevTagsOnPermissionData = arrayToString(prevTagsOnPermissionData);
            downLogicScript += `<break2><tab><tab><tab>// since tags on permissions has length... loop through each tag & update the tagOnPermission row`;
            downLogicScript += `<break><tab><tab><tab>const tagsOnPermissionsPrevData = [${prevTagsOnPermissionData}]<break2>`;
         }

         let prevPermissionsOnRolesData: any = await formatPrevPermissionsOnRoles([
            ...JSON.parse(JSON.stringify(permissionsOnRoles)),
         ]);
         prevPermissionsOnRolesData = arrayToString(prevPermissionsOnRolesData);
         downLogicScript += `<break2><tab><tab><tab>// since tags on permissions has length... loop through each tag & update the tagOnPermission row`;
         downLogicScript += `<break><tab><tab><tab>const permissionsOnRolesPrevData = [${prevPermissionsOnRolesData}]<break2>`;

         if (!!tagsOnPermissions.length) {
            let prevTagsOnPermissionsLoopScript = generatePreviousTagsOnPermissionsScript();
            downLogicScript += `<break2><tab><tab><tab>// loop through each tag on permission & revert the previous db save`;
            downLogicScript += `<break><tab><tab><tab>for (const tagOnPermission of tagsOnPermissionsPrevData) {<break>${prevTagsOnPermissionsLoopScript}<break><tab><tab><tab>}`;

            let prevPermissionTagsLookScript = generatePreviousPermissionTagsScript();
            downLogicScript += `<break2><tab><tab><tab>// loop through each tag & revert or delete the previous db save`;
            downLogicScript += `<break><tab><tab><tab>for (const permissionTag of permissionTagsPrevData) {<break>${prevPermissionTagsLookScript}<break><tab><tab><tab>}`;
         }

         let prevPermissionsOnRolesLoopScript = generatePrevousPermissionsOnRolesScript();
         downLogicScript += `<break2><tab><tab><tab>// loop through each permission & revert the previous db save`;
         downLogicScript += `<break><tab><tab><tab>for (const permissionOnRole of permissionsOnRolesPrevData) {<break>${prevPermissionsOnRolesLoopScript}<break><tab><tab><tab>}`;

         let prevPagePermissionsLoopScript = generatePreviousPagePermissionsScript();
         downLogicScript += `<break2><tab><tab><tab>// loop through each permission & revert the previous db save`;
         downLogicScript += `<break><tab><tab><tab>for (const permission of pagePermissionsPrevData) {<break>${prevPagePermissionsLoopScript}<break><tab><tab><tab>}`;
      }

      // down logic script to revert the row... grab the data of the row
      const prevPageData = await db.pagesLookup.findByPk(id).then(deepCopy);
      // don't want to update the id... delete the id
      delete prevPageData['id'];
      const prevPageDataStr = objectToString(prevPageData);
      downLogicScript += `<break2><tab><tab><tab>// previous page data`;
      downLogicScript += `<break><tab><tab><tab>const prevPageData = ${prevPageDataStr}`;
      downLogicScript += `<break><tab><tab><tab>await queryInterface.bulkUpdate('pagesLookup', prevPageData, { id: '${id}' })`;

      // initate the script string to return
      let scriptToReturn = ``;
      let upScript = `<tab>async up (queryInterface, Sequelize) {<break><tab><tab>/** Add altering commands here. */<break>${upLogicScript}<break><tab>}`;
      let downScript = `<tab>async down (queryInterface, Sequelize) {<break><tab><tab>/** Add reverting commands here. */<break>${downLogicScript}<break><tab>}`;
      scriptToReturn = `'use strict';<break2>/** @type {import('sequelize-cli').Migration} */<break>module.exports = {<break>${upScript}, <break2>${downScript}<break>}`;

      return NextResponse.json(scriptToReturn, { status: 200 });
   } catch (err: any) {
      console.log('err', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
export { updatePageScript as PUT };

const getNestedPageIds = async (pageId: string, arr: Array<any> = []) => {
   let arrCopy: Array<any> = [...arr];
   const foundChildrenPages = await db.pagesLookup.findAll({ where: { parentPageId: pageId } }).then(deepCopy);
   if (!!foundChildrenPages.length) {
      for (const childPage of foundChildrenPages) {
         arrCopy = await getNestedPageIds(childPage?.id, arrCopy);
      }
   }
   return [...arrCopy, foundChildrenPages].flat();
};

const formatChildPage = (page: any) => {
   delete page['createdAt'];
   delete page['updatedAt'];
   delete page['actionsConfig'];
   delete page['rowId'];
   delete page['iconName'];
   delete page['iconColor'];
   delete page['route'];
   delete page['showOnSidebar'];
   delete page['archived'];
   delete page['parentPageId'];
   return page;
};

const formatPrevPagePermissionData: any = async (pagePermissionsArr: Array<any>) => {
   // archived maybe true at this point due to the client creating a permission, then deleting the permission before saving it
   let prevPagePermissionData: Array<any> = [];
   for (const permission of pagePermissionsArr) {
      // find the permission by the id, shape the object & then append to array
      let permissionFound = await db.permissions.findByPk(permission.id).then(deepCopy);
      // means this permission needs to be deleted
      if (!permissionFound) permissionFound = { id: permission.id, action: 'delete' };
      // means this permission was updated/archived
      else permissionFound = { ...permissionFound, action: 'revert' };
      prevPagePermissionData = [...prevPagePermissionData, permissionFound];
   }
   return prevPagePermissionData;
};

const formatPrevPermissionTags = async (permissionTagsArr: Array<any>) => {
   let prevPermissionTagsData: Array<any> = [];
   for (const permissionTag of permissionTagsArr) {
      // see if tag exists by id
      let tagFound = await db.permissionTagsLookup.findByPk(permissionTag.id).then(deepCopy);

      // if here, need to revert the tag
      if (tagFound) tagFound = { ...tagFound, action: 'revert' };
      // if here, need to delete the tag
      else tagFound = { ...permissionTag, action: 'delete' };

      prevPermissionTagsData = [...prevPermissionTagsData, tagFound];
   }
   return prevPermissionTagsData;
};

const formatPrevTagsOnPermissionData = async (tagsOnPermissionArr: Array<any>) => {
   let prevTagsOnPermissionData: Array<any> = [];
   for (const tagOnPermission of tagsOnPermissionArr) {
      // find the tag on permission by the id
      // find the permission by the id, shape the object & then append to array
      let tagOnPermFound = await db.permissionTagsOnPermissions.findByPk(tagOnPermission.id).then(deepCopy);

      // means this permission needs to be deleted
      if (!tagOnPermFound) {
         tagOnPermFound = {
            id: tagOnPermission?.id,
            permissionId: tagOnPermission.permissionId,
            action: 'delete',
         };
      }
      prevTagsOnPermissionData = [...prevTagsOnPermissionData, tagOnPermFound];
   }
   return prevTagsOnPermissionData;
};

const formatPrevPermissionsOnRoles = async (permissionsOnRolesArr: Array<any>) => {
   // if the permissionOnRole row doesn't exist by id... that means the down will have to delete that role
   // if found, just update back to the original data
   let prevPermissionsOnRolesData: Array<any> = [];
   for (const permOnRole of permissionsOnRolesArr) {
      // try to find the permission on role by the permissionId & the roleId
      let permOnRoleFound = await db.permissionsOnRoles
         .findOne({
            where: { permissionId: permOnRole.permissionId, roleId: permOnRole.roleId },
         })
         .then(deepCopy);
      if (!permOnRoleFound) permOnRoleFound = { ...permOnRole, action: 'delete' };
      else permOnRoleFound = { ...permOnRoleFound, action: 'revert' };
      prevPermissionsOnRolesData = [...prevPermissionsOnRolesData, permOnRoleFound];
   }
   return prevPermissionsOnRolesData;
};
