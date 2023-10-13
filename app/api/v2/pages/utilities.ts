import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import * as Yup from 'yup';

export const pageExistsCheck = async (id: string) => {
   const exists = await db.pagesLookup.findByPk(id).catch((err: any) => {
      throw new LumError(400, err);
   });
   if (!exists) throw new LumError(400, `Page with id: ${id} doesn't exist.`);
};

export const validateParams = (params: any) => {
   if (!params?.id) throw new LumError(400, `Invalid id in params`);
   const { id } = params;
   return { id };
};

export const validateChildrenPages = async (childrenPages: Array<any>) => {
   for (const page of childrenPages) {
      const schema: any = Yup.object({
         id: Yup.string().required(`Id for each children page is required.`),
         displayOrder: Yup.number().required(`Display order for each children page is required.`),
      });
      await schema.validate(page);
      // see if page exists
      await pageExistsCheck(page?.id);
   }

   // validate the displayOrder is unique...
   const allPagesDisplayOrderCopy = new Set(childrenPages.map((p: any) => p.displayOrder));
   if (allPagesDisplayOrderCopy.size < childrenPages.length)
      throw new LumError(400, `There is a duplicate display order value within the children pages array.`);
};

export const validatePagePermissions = async (pagePermissions: Array<any>, id: string | null = null) => {
   for (const permission of pagePermissions) {
      const schema: any = Yup.object({
         id: Yup.string().required().nullable(),
         name: Yup.string().required(),
         description: Yup.string().required(),
         addPermissionToSuperAdmin: Yup.boolean(),
         isDefaultPermission: Yup.boolean().required(),
         permissionTagsOnPermission: Yup.array().required(),
      });
      await schema.validate(permission);

      // this if/else should only happen when updating
      // HINT: the 'req.params.id'
      if (permission?.id && id) {
         // validation the permission exists
         const permissionIdExists = await db.permissions
            .unscoped()
            .findByPk(permission.id)
            .catch((err: any) => {
               throw new LumError(400, err);
            });
         if (!permissionIdExists) throw new LumError(400, `Permission with id: ${permission.id} doesn't exist.`);
      } else if (!permission?.id && id) {
         // validate the name isn't duplicated by pageId & by name
         // see if name already exists... must be unique to the parentId
         const permissionExists = await db.permissions
            .unscoped()
            .findOne({ where: { name: permission.name, pageId: id } })
            .catch((err: any) => {
               throw new LumError(400, err);
            });
         // append id to obj if exists
         if (permissionExists) {
            permission['id'] = permissionExists.id;
            permission['archived'] = false;
         }
      }

      if (!!permission.permissionTagsOnPermission?.length) {
         const permissionTagsOnPermission = permission.permissionTagsOnPermission;
         for (const tagOnPermission of permissionTagsOnPermission) {
            const schema: any = Yup.object({
               permissionTagId: Yup.string().nullable().required(),
               permissionTag: Yup.object().when('permissionTagId', {
                  is: null,
                  then: () =>
                     Yup.object().required(
                        `When permission tag id is null, must pass in a permission tag object to save.`
                     ),
                  otherwise: () => Yup.object().notRequired(),
               }),
            });
            await schema.validate(tagOnPermission);

            // if no permissionTagId... make sure there is a permissionTag name exists
            if (!tagOnPermission.permissionTagId) {
               const schema = Yup.object({
                  name: Yup.string().required(`Name within the tagOnPermission.permissionTag object is required`),
               });
               await schema.validate(tagOnPermission.permissionTag);

               // if there isn't a permissionTagId... but there is an id inside the permissionTag object... attach the id to the top level object
               if (tagOnPermission.permissionTag?.id)
                  tagOnPermission['permissionTagId'] = tagOnPermission.permissionTag.id;
            }

            // if there is a permissionTagId... validate it
            if (tagOnPermission.permissionTagId) {
               const permissionTagIdExists = await db.permissionTagsLookup
                  .findByPk(tagOnPermission.permissionTagId)
                  .catch((err: any) => {
                     throw new LumError(400, err);
                  });
               if (!permissionTagIdExists)
                  throw new LumError(
                     400,
                     `Permission tag with id: '${tagOnPermission.permissionTagId}' doens't exist.`
                  );
            } else {
               // see if one already exists by name... if so, just use that row & update it
               const permissionTagExistsByName = await db.permissionTagsLookup.findOne({
                  where: { name: tagOnPermission.permissionTag.name },
               });
               if (permissionTagExistsByName) tagOnPermission['permissionTagId'] = permissionTagExistsByName.id;
            }
         }
      }
   }

   // make sure there isn't more than one default permission
   let pagePermsDefaultBools: Array<any> = [];
   pagePermissions?.forEach((permission: any) => {
      if (permission.isDefaultPermission && !pagePermsDefaultBools.includes('true')) pagePermsDefaultBools.push('true');
      else pagePermsDefaultBools.push('false');
   });
   if (pagePermsDefaultBools.length < pagePermissions?.length)
      throw new LumError(400, `There is more than one default permission.`);
};
