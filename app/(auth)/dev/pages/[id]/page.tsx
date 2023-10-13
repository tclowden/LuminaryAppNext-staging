import { cookies } from 'next/headers';
import PageProvider from '../../../../../providers/PageProvider';
import PageClient from './PageClient';
import fs from 'fs';
import { camelCaseToTitleCase } from '../../../../../utilities/helpers';

type Props = {
   params: { id: string };
};

const Page = async ({ params }: Props) => {
   // const isDevelopmentEnv = process?.env?.NODE_ENV === 'development';
   // if (!isDevelopmentEnv) {
   //    return (
   //       <PageProvider>
   //          <div>This page doesn't exist in production.</div>
   //       </PageProvider>
   //    );
   // }

   const nextCookies = cookies();
   const authToken = nextCookies.get('LUM_AUTH')?.value;
   // const pageId = !isNaN(+params.id) ? +params.id : null;
   const pageId = params?.id === 'new' ? null : params.id;

   const iconsData: Array<any> = fetchIcons();

   const colorsData = [
      { displayName: 'Blue', iconConfig: { name: 'Rectangle', color: 'blue' } },
      { displayName: 'Cyan', iconConfig: { name: 'Rectangle', color: 'cyan' } },
      { displayName: 'Green', iconConfig: { name: 'Rectangle', color: 'green' } },
      { displayName: 'Yellow', iconConfig: { name: 'Rectangle', color: 'yellow' } },
      { displayName: 'Orange', iconConfig: { name: 'Rectangle', color: 'orange' } },
      { displayName: 'Red', iconConfig: { name: 'Rectangle', color: 'red' } },
      { displayName: 'Pink', iconConfig: { name: 'Rectangle', color: 'pink' } },
      { displayName: 'Purple', iconConfig: { name: 'Rectangle', color: 'purple' } },
      { displayName: 'Gray', iconConfig: { name: 'Rectangle', color: 'gray' } },
   ];

   let allPagesRes: any = fetchPages(authToken);
   let allPermissionTagsRes: any = fetchPermissionTags(authToken);
   // let page: any = {};

   let pageRes: any = null;
   let permissionsRes: any = null;
   if (pageId) {
      pageRes = fetchPage(authToken, pageId);
      permissionsRes = fetchPagePermissions(authToken, pageId);
   } else {
      pageRes = { showOnSidebar: false, parentPageId: null, iconName: null, iconColor: null, route: null };
      const defaultPagePermission = {
         id: null,
         archived: false,
         description: 'Default permission description...',
         isDefaultPermission: true,
         name: 'VIEW (Default Permission)',
         addPermissionToSuperAdmin: true,
         permissionTagsOnPermission: [],
      };
      permissionsRes = [defaultPagePermission];
   }

   const [allPages, page, pagePermissions, permissionTags] = await Promise.allSettled([
      allPagesRes,
      pageRes,
      permissionsRes,
      allPermissionTagsRes,
   ])
      .then(handleResults)
      .catch((err) => {
         console.log('err:', err);
      });

   return (
      <PageProvider>
         <PageClient
            allPages={allPages.raw}
            allPagesPretty={allPages.pages}
            page={page}
            colors={colorsData}
            icons={iconsData}
            pagePermissions={pagePermissions}
            permissionTags={permissionTags}
         />
      </PageProvider>
   );
};

const fetchIcons = () => {
   // get icons from the component/icons directory
   return fs
      .readdirSync('./common/components/icons')
      .map((fileName) => {
         if (fileName !== 'index.ts' && fileName !== 'README.md' && !fileName.includes('Luminary')) {
            const tempFileName = fileName.split('.tsx')[0];
            const titleCaseFileName = camelCaseToTitleCase(tempFileName);
            return {
               iconName: tempFileName.trim(),
               displayName: titleCaseFileName.trim(),
               iconConfig: {
                  name: tempFileName.trim(),
                  color: 'gray:400',
               },
            };
         }
      })
      .filter((iconObj: any) => iconObj);
};

const fetchPage = (authToken: string | undefined, pageId: string) => {
   return fetch(`${process.env.CLIENT_SITE}/api/v2/pages/${pageId}`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${authToken}` },
   })
      .then((res) => {
         if (res.ok) return res.json();
         else console.log('res not okay...', res);
      })
      .catch((err) => console.error('err', err));
};

const fetchPages = (authToken: string | undefined) => {
   return fetch(`${process.env.CLIENT_SITE}/api/v2/pages`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${authToken}` },
   })
      .then((res) => {
         if (res.ok) return res.json();
         else console.log('res not okay...', res);
      })
      .catch((err) => console.log('err:', err));
};

const fetchPagePermissions = (authToken: string | undefined, pageId: string) => {
   return fetch(`${process.env.CLIENT_SITE}/api/v2/permissions/query`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
         where: { pageId: pageId },
         // include: [{ model: 'permissionTagsLookup', required: false }],
         include: [
            {
               model: 'permissionTagsOnPermissions',
               required: false,
               as: 'permissionTagsOnPermission',
               include: [{ model: 'permissionTagsLookup', as: 'permissionTag', required: false }],
            },
         ],
      }),
   })
      .then((res) => {
         if (res.ok) return res.json();
         else console.log('res not okay...', res);
      })
      .catch((err) => console.log('err:', err));
};
// const fetchPagePermissions = (authToken: string | undefined) => {
//    return fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/permissions`, {
//       method: 'GET',
//       headers: { 'Content-type': 'application/json', Authorization: `Bearer ${authToken}` },
//    })
//       .then((res) => {
//          if (res.ok) return res.json();
//          else console.log('res not okay...', res);
//       })
//       .catch((err) => console.log('err:', err));
// };

const fetchPermissionTags = (authToken: string | undefined) => {
   // return fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/permission-tags`, {
   return fetch(`${process.env.CLIENT_SITE}/api/v2/permissions/tags`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json', Authorization: `Bearer ${authToken}` },
   })
      .then((res) => {
         if (res.ok) return res.json();
         else console.log('res not okay...', res);
      })
      .catch((err) => console.log('err:', err));
};

const handleResults = (results: any) => {
   return results.map((result: any) => {
      if (result.status === 'fulfilled') return result.value;
   });
};

export default Page;
