import db from '@/sequelize/models';
import { deepCopy } from '@/utilities/helpers';

export const formatPermissionsOnRoles = async (permissionsArr: Array<any>) => {
   const superSecretDevRole = await db.roles.findByPk('b1421034-7ad9-40fc-bc3b-dc4f00c7e285').then(deepCopy);
   const superAdminRole = await db.roles.findByPk('dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6').then(deepCopy);
   let permissionsOnRoles: Array<any> = [];
   if (!superSecretDevRole || !superAdminRole) return permissionsOnRoles;
   for (const permission of permissionsArr) {
      // see if permission already exists on role.. if not, add to permissionsOnRoles array
      const secretDevPermissionExists = await db.permissionsOnRoles
         .findOne({
            where: { permissionId: permission.id, roleId: superSecretDevRole.id },
         })
         .then(deepCopy);
      if (!secretDevPermissionExists && !permission.archived) {
         // need to create an id
         const newId = crypto.randomUUID();
         permissionsOnRoles = [
            ...permissionsOnRoles,
            { id: newId, permissionId: permission.id, roleId: superSecretDevRole.id, action: 'create' },
         ];
      } else if (secretDevPermissionExists && !permission.archived)
         permissionsOnRoles = [
            ...permissionsOnRoles,
            {
               id: secretDevPermissionExists.id,
               permissionId: permission.id,
               roleId: superSecretDevRole.id,
               action: 'update',
            },
         ];
      else if (secretDevPermissionExists && permission.archived)
         permissionsOnRoles = [
            ...permissionsOnRoles,
            {
               id: secretDevPermissionExists.id,
               permissionId: permission.id,
               roleId: superSecretDevRole.id,
               action: 'archive',
            },
         ];

      if (permission.addPermissionToSuperAdmin) {
         const superAdminPermissionExists = await db.permissionsOnRoles.findOne({
            where: { permissionId: permission.id, roleId: superAdminRole.id },
         });
         if (!superAdminPermissionExists && !permission.archived) {
            const newId = crypto.randomUUID();
            permissionsOnRoles = [
               ...permissionsOnRoles,
               { id: newId, permissionId: permission.id, roleId: superAdminRole.id, action: 'create' },
            ];
         } else if (superAdminPermissionExists && !permission.archived)
            permissionsOnRoles = [
               ...permissionsOnRoles,
               {
                  id: superAdminPermissionExists.id,
                  permissionId: permission.id,
                  roleId: superAdminRole.id,
                  action: 'update',
               },
            ];
         else if (superAdminPermissionExists && permission.archived)
            permissionsOnRoles = [
               ...permissionsOnRoles,
               {
                  id: superAdminPermissionExists.id,
                  permissionId: permission.id,
                  roleId: superAdminRole.id,
                  action: 'archive',
               },
            ];
      }
   }
   return permissionsOnRoles;
};
export const formatPagePermissionsArr = (pagePermissionsArr: Array<any>, pageId: string) => {
   return pagePermissionsArr.map((permission) => {
      permission['archived'] = permission?.archived || false;
      permission['pageId'] = `${pageId}`;
      permission['action'] =
         permission?.id && permission?.archived
            ? 'archive'
            : !permission?.id && permission?.archived
            ? 'nothing'
            : permission?.id && !permission?.archived
            ? 'update'
            : 'create';
      const permissionUuid = crypto.randomUUID();
      permission['id'] = permission?.id ?? `${permissionUuid}`;
      return { ...permission };
   });
};
export const formatPagePermissionsUp = (pagePermissions: Array<any>) => {
   return pagePermissions.map((permission) => {
      delete permission['rowId'];
      delete permission['createdAt'];
      delete permission['updatedAt'];
      delete permission['permissionTagsOnPermission'];
      return { ...permission };
   });
};

export const formatTagsOnPermissionsArr = (pagePermissionsArr: Array<any>) => {
   // get all the permissionTagsOnPermissions
   let permissionTagsOnPermissions = pagePermissionsArr
      .map((permission: any) => {
         return [...permission.permissionTagsOnPermission].map((tagOnPermission) => {
            tagOnPermission['permissionId'] = permission.id;
            // don't need an update action...
            tagOnPermission['action'] =
               tagOnPermission?.id && tagOnPermission?.archived
                  ? 'archive'
                  : !tagOnPermission?.id && tagOnPermission?.archived
                  ? 'nothing'
                  : tagOnPermission?.id && !tagOnPermission?.archived
                  ? 'update'
                  : 'create';
            const tagOnPermissionUuid = crypto.randomUUID();
            tagOnPermission['id'] = tagOnPermission?.id ?? `${tagOnPermissionUuid}`;
            return { ...tagOnPermission };
         });
      })
      .flat();

   // get all the unique permissionTags
   let permissionTags = [...JSON.parse(JSON.stringify(permissionTagsOnPermissions))].map((tOP) => tOP.permissionTag);
   permissionTags = Object.values(
      [...permissionTags].reduce((acc, currTag) => {
         const name = currTag?.name;
         if (!acc[name]) acc[name] = { ...currTag };
         return acc;
      }, {})
   ).map((tag: any) => {
      tag['action'] =
         tag?.id && tag?.archived
            ? 'archived'
            : !tag?.id && tag?.archived
            ? 'nothing'
            : tag?.id && !tag?.archived
            ? 'update'
            : 'create';
      const permissionTagUuid = crypto.randomUUID();
      tag['id'] = tag?.id ?? `${permissionTagUuid}`;
      return tag;
   });

   // add the permissionTag ids to the permissionTagsOnPermissions arr
   permissionTagsOnPermissions = permissionTagsOnPermissions.map((tagOnPerm) => {
      const tagToAdd = permissionTags.find((tag) => tag.name === tagOnPerm.permissionTag.name);
      tagOnPerm['permissionTagId'] = tagToAdd.id;
      delete tagOnPerm['permissionTag'];
      return tagOnPerm;
   });

   return [permissionTags, permissionTagsOnPermissions];
};
export const formatTagsOnPermissionsUp = (tagsOnPermissions: Array<any>) => {
   return tagsOnPermissions.map((tagOnPermission: any) => {
      delete tagOnPermission['createdAt'];
      delete tagOnPermission['updatedAt'];
      return { ...tagOnPermission };
   });
};
export const formatTagsUp = (permissionTags: Array<any>) => {
   return permissionTags.map((permissionTag: any) => {
      delete permissionTag['rowId'];
      delete permissionTag['createdAt'];
      delete permissionTag['updatedAt'];
      return { ...permissionTag };
   });
};
export const formatPageData = (pageData: any, pageId: string | null = null) => {
   return {
      ...(pageId && { id: pageId }),
      name: pageData?.name,
      iconName: pageData?.iconName ?? null,
      iconColor: pageData?.iconColor ?? null,
      route: pageData?.route ?? null,
      // archived: false,
      parentPageId: pageData?.parentPageId ?? null,
      displayOrder: typeof pageData?.displayOrder === 'number' ? pageData?.displayOrder : null,
      showOnSidebar: pageData?.showOnSidebar ?? null,
   };
};
export const arrayToString = (arr: Array<any>) => {
   return arr
      .map((obj: any) => {
         return `{${Object.entries(obj)
            .map(([key, val]) => generateAttributeScript(key, val))
            .join(',')}}`;
      })
      .join(',');
};
export const objectToString = (obj: any) => {
   return `{${Object.entries(obj)
      .map(([key, val]) => generateAttributeScript(key, val))
      .join(',')}}`;
};

const generateAttributeScript = (objKey: string, objVal: any) => {
   const isArrayType = Array.isArray(objVal);
   const isObjectType = typeof objVal === 'object' && objVal !== null;

   if (!isArrayType && !isObjectType) {
      if (typeof objVal === 'string') return `${objKey}: "${objVal.trim()}"`;
      else return `${objKey}: ${objVal}`;
   }

   if (isArrayType) {
      return `${objKey}: [${objVal?.map((obj) => {
         const props: any = Object.entries(obj).map(([key, value]) => {
            return `${generateAttributeScript(key, value)}`;
         });
         return `{${props}}`;
      })}]`;
   }

   if (isObjectType) {
      const properties: string = Object.entries(objVal)
         .map(([key, value]) => generateAttributeScript(key, value))
         .join(',');
      return `${objKey}: {${properties}}`;
   }
};
