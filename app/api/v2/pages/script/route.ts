import { NextRequest, NextResponse } from 'next/server';
import * as Yup from 'yup';
import { pageExistsCheck, validatePagePermissions } from '../utilities';
import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
const Sequelize = require('sequelize');
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
} from '../formatters';
import { deepCopy } from '@/utilities/helpers';
import {
   generatePagePermissionsScript,
   generatePermissionTagsScript,
   generatePermissionsOnRolesScript,
   generateTagsOnPermissionsScript,
} from '../sharedScripts';

async function createPageScript(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      const schema = Yup.object({
         name: Yup.string().required().nullable(),
         iconName: Yup.string().required().nullable(),
         iconColor: Yup.string().required().nullable(),
         route: Yup.string().required().nullable(),
         displayOrder: Yup.string().required(),
         parentPageId: Yup.string().required().nullable(),
         showOnSidebar: Yup.boolean().required(),
         childrenPages: Yup.array().required(),
         pagePermissions: Yup.array().required(),
      });
      await schema.validate(reqBody);

      // check to see if there is a page/app that already exists by name
      const pageAlreadyExists = await db.pagesLookup
         .findOne({ where: { name: reqBody.name, parentPageId: reqBody.parentPageId, route: reqBody.route } })
         .catch((err: any) => {
            throw new LumError(400, err);
         });
      if (pageAlreadyExists) throw new LumError(400, `Page, '${reqBody.name}' already exists`);

      if (reqBody.pagePermissions?.length) await validatePagePermissions(reqBody.pagePermissions);

      // this means that it's either a section or a page... not an app
      if (reqBody.parentPageId) await pageExistsCheck(reqBody.parentPageId);

      // validate that the displayOrder is unique to the parentPageId...
      const displayOrderDuplicate = await db.pagesLookup.findOne({
         where: { displayOrder: reqBody.displayOrder, parentPageId: reqBody.parentPageId },
      });
      if (displayOrderDuplicate) throw new LumError(400, `There is a duplicate display order value.`);

      // DONE VALIDATING

      // initiate logic scripts
      let upLogicScript = ``;
      let downLogicScript = ``;

      const newPageId = crypto.randomUUID();
      // initiate an object to configure the page
      let pageData: any = formatPageData(reqBody, newPageId);
      pageData = objectToString(pageData);

      // create the page
      upLogicScript += `<break2><tab><tab>// create page in db`;
      upLogicScript += `<break><tab><tab>await queryInterface.bulkInsert('pagesLookup', [${pageData}]);`;

      // if page permissions are needing to be created
      if (!!reqBody.pagePermissions?.length) {
         const pagePermissions = formatPagePermissionsArr([...deepCopy(reqBody.pagePermissions)], newPageId);
         const [permissionTags, tagsOnPermissions] = formatTagsOnPermissionsArr([...deepCopy(pagePermissions)]);
         const permissionsOnRoles = await formatPermissionsOnRoles([...deepCopy(pagePermissions)]);

         // UP LOGIC
         const pagePermissionsUp = formatPagePermissionsUp([...deepCopy(pagePermissions)]);
         const pagePermissionsStr = arrayToString(pagePermissionsUp);
         upLogicScript += `<break2><tab><tab><tab>// since page permissions has length...`;
         upLogicScript += `<break><tab><tab><tab>const pagePermissions = [${pagePermissionsStr}]<break2>`;
         let pagePermissionsLoopScript = generatePagePermissionsScript();
         upLogicScript += `<break2><tab><tab><tab>// loop through each permission & update the permission`;
         upLogicScript += `<break><tab><tab><tab>for (const permission of pagePermissions) {<break>${pagePermissionsLoopScript}<break><tab><tab><tab>}`;

         if (!!tagsOnPermissions.length) {
            // handle the permissionTags logic here
            const tagsUp = formatTagsUp([...deepCopy(permissionTags)]);
            const tagsUpStr = arrayToString(tagsUp);
            upLogicScript += `<break2><tab><tab><tab>// since tags on permissions has length... loop through each tag & and see if the tag needs to be created or not`;
            upLogicScript += `<break><tab><tab><tab>const permissionTags = [${tagsUpStr}]<break2>`;

            const tagsOnPermissionsUp = formatTagsOnPermissionsUp([...deepCopy(tagsOnPermissions)]);
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

         // NOTE FOR SELF (MATT RAPP)
         // MIGHT NEED TO RECONFIGURE PERMISSIONS ON ROLES
         // need to generate the script to loop through each permission on role & pretty much do what i'm doing in the formatPermissionsOnRoles() function
         // reason is, need to query the roles by the name, and get the id from it.

         const permissionsOnRolesStr = arrayToString(permissionsOnRoles);
         upLogicScript += `<break2><tab><tab><tab>// now attach permissions to the neccessary roles...`;
         upLogicScript += `<break><tab><tab><tab>const permissionsOnRoles = [${permissionsOnRolesStr}]`;
         let permissionsOnRolesLoopScript = generatePermissionsOnRolesScript();
         upLogicScript += `<break2><tab><tab><tab>// loop through each permission on role & add to db...`;
         upLogicScript += `<break><tab><tab><tab>for (const permissionOnRole of permissionsOnRoles) {<break>${permissionsOnRolesLoopScript}<break>}`;

         // DOWN LOGIC
         // just delete any rows that were created...
         // the creating a page script will only create rows for permissions, permissionsOnRoles, and permissionsTagsOnPermissions
         let downLogicNestedForLoopScript = ``;

         downLogicNestedForLoopScript += `<tab><tab><tab>// delete the permissions on role by permissionId`;
         downLogicNestedForLoopScript += `<break><tab><tab><tab>await queryInterface.bulkDelete('permissionsOnRoles', [{ permissionId: permissionId}]);`;

         downLogicNestedForLoopScript += `<break><tab><tab><tab>// delete the permissionsTags on permissions by permissionId`;
         downLogicNestedForLoopScript += `<break><tab><tab><tab>await queryInterface.bulkDelete('permissionTagsOnPermissions', [{ permissionId: permissionId }]);`;

         downLogicNestedForLoopScript += `<break><tab><tab><tab>// delete the page permissions by id`;
         downLogicNestedForLoopScript += `<break><tab><tab><tab>await queryInterface.bulkDelete('permissions', { id: permissionId });`;

         const pagePermissionsDown = [...deepCopy(pagePermissions)]
            .map((permission) => `"${permission.id}"`)
            .join(', ');
         downLogicScript += `<break2><tab><tab>// permissionIds that need to be deleted from the db`;
         downLogicScript += `<break><tab><tab>const pagePermissionsToRevert = [${pagePermissionsDown}]`;
         downLogicScript += `<break><tab><tab>for (const permissionId of pagePermissionsToRevert) {<break>${downLogicNestedForLoopScript}<break><tab><tab>}`;

         // find all the permission tags to delete by query all the permission tags and see which ones return null
         let permissionTagIdsToDelete: Array<any> = [];
         for (const permissionTag of permissionTags) {
            const permissionTagFound = await db.permissionTagsLookup.findByPk(permissionTag.id);
            if (!permissionTagFound) permissionTagIdsToDelete = [...permissionTagIdsToDelete, `"${permissionTag.id}"`];
         }
         const permissionTagIdsToDeleteStr = permissionTagIdsToDelete.join(', ');
         let deletePermissionTagsLoopScript = ``;
         deletePermissionTagsLoopScript += `<tab><tab><tab><tab>`;
         deletePermissionTagsLoopScript += `<break><tab><tab><tab><tab>await queryInterface.bulkDelete('permissionTagsLookup', { id: permissionTagId });`;
         downLogicScript += `<break><tab><tab>// delete the created permissionTags by id`;
         downLogicScript += `<break><tab><tab>const permissionTagIdsToDelete = [${permissionTagIdsToDeleteStr}]`;
         downLogicScript += `<break><tab><tab>for (const permissionTagId of permissionTagIdsToDelete) {<break>${deletePermissionTagsLoopScript}<break><tab><tab>}`;
      }

      // DOWN LOGIC script to delete the pagesLookup row
      downLogicScript += `<break2><tab><tab>// delete the page created by id`;
      downLogicScript += `<break><tab><tab>await queryInterface.bulkDelete('pagesLookup', { id: '${newPageId}' });`;

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
export { createPageScript as POST };

async function bulkUpdatePageScript(request: NextRequest, options: any) {
   try {
      const reqBody = await request.json();
      if (!reqBody?.length) throw new LumError(400, `Body of the request must be an array with length...`);
      for (const page of reqBody) {
         const schema: any = Yup.object({
            id: Yup.string().required(`Page id is required.`),
            displayOrder: Yup.number().required(`Display order is required.`),
         });
         await schema.validate(page);

         // validate the id... see if page exits
         await pageExistsCheck(page.id);
      }
      // validate the displayOrder is unique...
      const pageDisplayOrderCopy = new Set(reqBody.map((page: any) => page.displayOrder));
      if (pageDisplayOrderCopy.size < reqBody.length)
         throw new LumError(400, `There is a duplicate display order value.`);

      // DONE VALIDATING

      // get previous data based on the pagesID
      const pageIds = [...deepCopy(reqBody)].map((page) => page.id);
      const previousPagesData = await db.pagesLookup
         .findAll({ where: { id: { [Sequelize.Op.in]: pageIds } } })
         .then(deepCopy);

      // initiate logic scripts
      let upLogicScript = ``;
      let downLogicScript = ``;

      // get page data and store in variable
      upLogicScript += `<tab><tab>// page data to update`;
      upLogicScript += `<break><tab><tab>const pageData = [${arrayToString(reqBody)}]`;
      downLogicScript += `<tab><tab>// page data to revert back to`;
      downLogicScript += `<break><tab><tab>const prevPageData = [${arrayToString(previousPagesData)}]`;

      // update the page data
      let updatePageDataLoopScript = ``;
      updatePageDataLoopScript += `<tab><tab><tab>// make a page copy`;
      updatePageDataLoopScript += `<break><tab><tab><tab>const pageCopy = { ...page }`;
      updatePageDataLoopScript += `<break><tab><tab><tab>// delete unneccessary key/values`;
      updatePageDataLoopScript += `<break><tab><tab><tab>delete pageCopy['id'];`;
      updatePageDataLoopScript += `<break><tab><tab><tab>delete pageCopy['rowId'];`;
      updatePageDataLoopScript += `<break><tab><tab><tab>await queryInterface.bulkUpdate('pagesLookup', pageCopy, { id: page.id });`;
      upLogicScript += `<break2><tab><tab>// update the pageDAta`;
      upLogicScript += `<break><tab><tab>for (const page of pageData) {<break>${updatePageDataLoopScript}<break><tab><tab>}`;

      // revert the page data
      let revertPageDataLoopScript = ``;
      revertPageDataLoopScript += `<tab><tab><tab>// make a page copy`;
      revertPageDataLoopScript += `<break><tab><tab><tab>const pageCopy = { ...page }`;
      revertPageDataLoopScript += `<break><tab><tab><tab>// delete unneccessary key/values`;
      revertPageDataLoopScript += `<break><tab><tab><tab>delete pageCopy['id'];`;
      revertPageDataLoopScript += `<break><tab><tab><tab>delete pageCopy['rowId'];`;
      revertPageDataLoopScript += `<break><tab><tab><tab>await queryInterface.bulkUpdate('pagesLookup', pageCopy, { id: page.id });`;
      downLogicScript += `<break2><tab><tab>// revert the pageDAta`;
      downLogicScript += `<break><tab><tab>for (const page of prevPageData) {<break>${revertPageDataLoopScript}<break><tab><tab>}`;

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
export { bulkUpdatePageScript as PUT };
