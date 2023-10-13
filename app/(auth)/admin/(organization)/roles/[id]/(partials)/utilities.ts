export const recurseTableData = (arr: Array<any>, role: any): Array<any> => {
   return arr.map((item: any) => {
      // if item has a pemrissions array, it's a page
      // else, it's a permission
      let arrayToExpand: Array<any> = [];

      // add icon configuration for pages
      if (item?.pages && item?.pages?.length) {
         arrayToExpand = [
            ...arrayToExpand,
            ...item?.pages.map((page: any) => {
               const pageDefaultPermission = page?.permissions?.find(
                  (permission: any) => permission.isDefaultPermission
               );

               // need to figure out why new permission descriptions aren't showing up

               return {
                  ...page,
                  pageType: 'page',
                  iconConfig: { name: 'PageBrowser', color: 'gray:300' },
                  // tempDisplayName: `'${page?.name}' Page`,
                  description: pageDefaultPermission?.description || page?.description || '',
               };
            }),
         ];
      }

      // add icon configuration for sections
      if (item?.sections && item?.sections?.length) {
         arrayToExpand = [
            ...arrayToExpand,
            ...item?.sections.map((section: any) => {
               // sections should always only have 1 permission
               // so use the first item in the permissions array
               const sectionPermission = section?.permissions[0];
               return {
                  ...section,
                  pageType: 'section',
                  iconConfig: { name: 'FolderClosed', color: 'gray:300' },
                  description: sectionPermission?.description,
               };
            }),
         ];
      }

      // add icon configuration for permissions
      if (item?.permissions && item?.permissions?.length) {
         // const isPage = item?.route && item?.parentPageId;
         // if (isPage || item?.permissions?.length > 1) {
         if (item?.permissions?.length > 1) {
            arrayToExpand = [
               ...arrayToExpand,
               ...item?.permissions
                  .filter((permission: any) => !permission.isDefaultPermission)
                  .map((permission: any) => {
                     // const defaultPermission = [...item?.permissions].find((perm: any) => perm.isDefaultPermission);
                     return {
                        ...permission,
                        pageType: 'permission',
                        iconConfig: { name: 'ToolsWrench', color: 'gray:300' },
                        // defaultPermission: defaultPermission,
                     };
                  }),
            ];
         }
      }

      // add icon configuration for app
      // should always only have 1 permission...
      // so use the first item in the permissions array
      if (!item['iconConfig']) {
         const appPermission = item?.permissions[0];
         item['pageType'] = 'app';
         item['iconConfig'] = {
            name: item?.iconName === 'User' ? 'Users' : item?.iconName || 'Folder',
            color: item?.iconColor || 'cyan',
         };
         item['description'] = appPermission?.description;
      }

      const tableData = recurseTableData(arrayToExpand, role);
      return {
         ...item,
         displayName: {
            // permissions have pretty names that can change... the name of the permission will always be stuck once created
            value: item?.tempDisplayName || item?.prettyName || item?.name,
            iconConfig: item?.iconConfig,
         },
         expandableData: tableData,
      };
   });
};
