'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      // get roles
      const superSecretDevRoleId = 'b1421034-7ad9-40fc-bc3b-dc4f00c7e285';
      const superAdminRoleId = 'dfbc51af-eb1f-42ac-a49d-6ba3cffe94f6';

      // seperate the apps from the page pemrissions... make sure to add the pageId to each page permission
      const appPagePermissions = [...JSON.parse(JSON.stringify(defaultAppsConfig))]
         .map((app) => {
            return app.pagePermissions.map((permission) => ({
               ...permission,
               pageId: app.id,
            }));
         })
         .flat();

      const defaultSections = defaultSectionsConfig
         .map((sectionArr) => {
            return sectionArr.map((section, i) => ({
               ...section,
               displayOrder: i + 1,
            }));
         })
         .flat();

      const defaultPages = defaultPagesConfig
         .map((pageArr) => {
            return pageArr.map((page, i) => ({
               ...page,
               displayOrder: i + 1,
            }));
         })
         .flat();

      // seperate the sections from the page permissions... make sure to add the pageId to each page permission
      const sectionPagePermissions = [...JSON.parse(JSON.stringify(defaultSections))]
         .map((section) => {
            return section.pagePermissions.map((permission) => ({
               ...permission,
               pageId: section.id,
            }));
         })
         .flat();

      // seperate the sections from the page permissions... make sure to add the pageId to each page permission
      const pagePagePermissions = [...JSON.parse(JSON.stringify(defaultPages))]
         .map((page) => {
            return page.pagePermissions.map((permission) => ({
               ...permission,
               pageId: page.id,
            }));
         })
         .flat();

      // create the apps
      const apps = [...JSON.parse(JSON.stringify(defaultAppsConfig))].map((app) => {
         delete app['pagePermissions'];
         delete app['childrenPages'];
         return { ...app };
      });
      await queryInterface.bulkInsert('pagesLookup', apps);

      // create the sections
      const sections = [...JSON.parse(JSON.stringify(defaultSections))].map((section) => {
         delete section['pagePermissions'];
         delete section['childrenPages'];
         section['parentPageId'] = section?.parentPage?.id;
         delete section['parentPage'];
         return { ...section };
      });
      await queryInterface.bulkInsert('pagesLookup', sections);

      // create the pages
      const pages = [...JSON.parse(JSON.stringify(defaultPages))].map((page) => {
         delete page['pagePermissions'];
         delete page['childrenPages'];
         page['parentPageId'] = page?.parentPage?.id;
         delete page['parentPage'];
         return { ...page };
      });
      await queryInterface.bulkInsert('pagesLookup', pages);

      // combined all the permissions that will soon be writing
      let allPermissionsToWrite = [...appPagePermissions, ...sectionPagePermissions, ...pagePagePermissions];

      // before creating permissions... create the array to create the rows for permissionsOnRoles
      let permissionsOnRolesToWrite = [];
      allPermissionsToWrite = allPermissionsToWrite.map((permission, i) => {
         permissionsOnRolesToWrite.push({
            permissionId: permission?.id,
            roleId: superSecretDevRoleId,
         });
         if (permission?.addPermissionToSuperAdmin) {
            permissionsOnRolesToWrite.push({
               permissionId: permission?.id,
               roleId: superAdminRoleId,
            });
         }

         // alter the object
         delete permission['permissionTagsOnPermission'];
         delete permission['addPermissionToSuperAdmin'];
         return { ...permission };
      });

      // loop through all the permissionsOnRolesToWrite and add an id to it
      permissionsOnRolesToWrite.forEach((permOnRole, i) => {
         permOnRole['id'] = uuidsForPermissionsOnRoles[i];
      });

      // create the permissions
      await queryInterface.bulkInsert('permissions', allPermissionsToWrite);

      // create the permissions on roles
      await queryInterface.bulkInsert('permissionsOnRoles', permissionsOnRolesToWrite);
   },

   async down(queryInterface, Sequelize) {
      // delete all the permissions on roles
      await queryInterface.bulkDelete('permissionsOnRoles', null, {});

      // delete all the permissions
      await queryInterface.bulkDelete('permissions', null, {});

      // delete all from the pagesLookup table
      await queryInterface.bulkDelete('pagesLookup', null, {});
   },
};

const defaultAppsConfig = [
   {
      name: 'My Luminary',
      id: 'f9b2c575-df0d-4cee-9946-16bbf0007bb7',
      parentPageId: null,
      iconName: 'User',
      iconColor: 'yellow',
      childrenPages: [],
      displayOrder: 1,
      route: null,
      showOnSidebar: true,
      pagePermissions: [
         // default VIEW permission for the super admin
         {
            addPermissionToSuperAdmin: true,
            id: '2b62eac1-9224-4db3-8ee0-f7a7acc7806d',
            name: 'View My Luminary App',
            description: "Allow user to access the 'My Luminary' (profile) application.",
            isDefaultPermission: true,
            permissionTagsOnPermission: [],
         },
      ],
   },
   {
      name: 'Sales',
      id: 'a116d6dc-b5d4-43c2-99d5-56cf53da88d4',
      parentPageId: null,
      iconName: 'Wallet',
      iconColor: 'green',
      childrenPages: [],
      displayOrder: 2,
      route: null,
      showOnSidebar: true,
      pagePermissions: [
         // default VIEW permission for the super admin
         {
            addPermissionToSuperAdmin: true,
            id: '4fd79d51-1006-4c89-8823-ee5c03cbace7',
            name: 'View Sales App',
            description: "Allow user to access the 'Sales' application.",
            isDefaultPermission: true,
            permissionTagsOnPermission: [],
         },
      ],
   },
   {
      name: 'Marketing',
      id: '2b52758c-b72f-4dca-b9b3-c176c10b5064',
      parentPageId: null,
      iconName: 'Sights',
      iconColor: 'pink',
      childrenPages: [],
      displayOrder: 3,
      route: null,
      showOnSidebar: true,
      pagePermissions: [
         // default VIEW permission for the super admin
         {
            addPermissionToSuperAdmin: true,

            id: '68852fcf-166e-432c-adf8-5296d307c46d',
            name: 'View Marketing App',
            description: "Allow user to access the 'Marketing' application.",
            isDefaultPermission: true,
            permissionTagsOnPermission: [],
         },
      ],
   },
   {
      name: 'Funnels',
      id: '7c613726-421e-4589-90ca-fc11272f1611',
      parentPageId: null,
      iconName: 'Funnel',
      iconColor: 'cyan',
      childrenPages: [],
      displayOrder: 4,
      route: null,
      showOnSidebar: true,
      pagePermissions: [
         // default VIEW permission for the super admin
         {
            addPermissionToSuperAdmin: true,
            id: '3a416df0-1eb9-414e-84bb-5fde2ff22007',
            name: 'View Funnels App',
            description: "Allow user to access the 'Funnel' application.",
            isDefaultPermission: true,
            permissionTagsOnPermission: [],
         },
      ],
   },
   {
      name: 'Installs',
      id: '5a758c4c-1361-41f2-a993-30333a029f7b',
      parentPageId: null,
      iconName: 'Tools',
      iconColor: 'orange',
      childrenPages: [],
      displayOrder: 5,
      route: null,
      showOnSidebar: true,
      pagePermissions: [
         // default VIEW permission for the super admin
         {
            addPermissionToSuperAdmin: true,
            id: '8dc71916-7d5d-47ad-ab61-0ca4543330ab',
            name: 'View Installs App',
            description: "Allow user to access the 'Installs' application.",
            isDefaultPermission: true,
            permissionTagsOnPermission: [],
         },
      ],
   },
   {
      name: 'Analytics',
      id: '8032f035-a6e6-40f0-bacf-ef629ad646d8',
      parentPageId: null,
      iconName: 'PieGraph',
      iconColor: 'blue',
      childrenPages: [],
      displayOrder: 6,
      route: null,
      showOnSidebar: true,
      pagePermissions: [
         // default VIEW permission for the super admin
         {
            addPermissionToSuperAdmin: true,
            id: '7294f1fa-4bbf-4704-a407-2ef6b51abc2a',
            name: 'View Analytics App',
            description: "Allow user to access the 'Analytics' application.",
            isDefaultPermission: true,
            permissionTagsOnPermission: [],
         },
      ],
   },
   {
      name: 'Admin',
      id: '86964522-f161-4891-9744-f31647f1ebe2',
      parentPageId: null,
      iconName: 'Gear',
      iconColor: 'purple',
      childrenPages: [],
      displayOrder: 7,
      route: null,
      showOnSidebar: true,
      pagePermissions: [
         // default VIEW permission for the super admin
         {
            addPermissionToSuperAdmin: true,
            id: '8bffe109-ee1d-4a5d-b897-6f4c10837aa9',
            name: 'View Admin App',
            description: "Allow user to access the 'Admin' application.",
            isDefaultPermission: true,
            permissionTagsOnPermission: [],
         },
      ],
   },
   {
      name: 'Dev',
      id: '7b31fb52-496d-4178-840f-97112c08e7ba',
      parentPageId: null,
      iconName: 'Robot',
      iconColor: 'red',
      childrenPages: [],
      displayOrder: 8,
      route: null,
      showOnSidebar: true,
      pagePermissions: [
         // default VIEW permission for the super admin, set to false... only super secret dev role will see if
         {
            addPermissionToSuperAdmin: false,
            id: '41f56502-bd05-4c49-963b-9cb7dea4ecef',
            name: 'View Dev App',
            description:
               "Allow user to access the 'Developer' application. This should be super secret, so should only be assigned manually via a script.",
            permissionTagsOnPermission: [],
            isDefaultPermission: true,
         },
      ],
   },
];

const defaultSectionsConfig = [
   // ANALYTICS SECTIONS
   [
      {
         name: 'Sales Reports',
         id: '767a5807-fc12-4b78-9a19-c71ac4b9137c',
         parentPage: { name: 'Analytics', id: '8032f035-a6e6-40f0-bacf-ef629ad646d8' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'FolderClosed',
         iconColor: null,
         childrenPages: [],
         displayOrder: 1, // relative to the parent
         route: null,
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '76cdf244-a322-4ad7-ba66-12cee5065e6b',
               name: 'View Sales Reports Section',
               description: "Allow user to access the 'Sales Reports' section within the 'Analytics' app.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Calling Reports',
         id: 'eb083a0b-a8c7-4283-91a7-78cec329cdf4',
         parentPage: { name: 'Analytics', id: '8032f035-a6e6-40f0-bacf-ef629ad646d8' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'FolderClosed',
         iconColor: null,
         childrenPages: [],
         displayOrder: 2, // relative to the parent
         route: null,
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,

               id: 'e0e6b711-3188-47bc-9238-0fc4f6e90dc0',
               name: 'View Calling Reports Section',
               description: "Allow user to access the 'Calling Reports' section within the 'Analytics' app.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Marketing Reports',
         id: '3a68575e-2a08-4733-a1a3-e653eda57df3',
         parentPage: { name: 'Analytics', id: '8032f035-a6e6-40f0-bacf-ef629ad646d8' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'FolderClosed',
         iconColor: null,
         childrenPages: [],
         displayOrder: 3, // relative to the parent
         route: null,
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '72042f07-9be0-4ede-a96d-33f73ad67426',
               name: 'View Marketing Reports Section',
               description: "Allow user to access the 'Marketing Reports' section within the 'Analytics' app.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Operations Reports',
         id: '590f089c-04b2-4a92-9e3c-415874835cbf',
         parentPage: { name: 'Analytics', id: '8032f035-a6e6-40f0-bacf-ef629ad646d8' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'FolderClosed',
         iconColor: null,
         childrenPages: [],
         displayOrder: 4, // relative to the parent
         route: null,
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'e53249c6-1859-4419-b59e-cef347943b78',
               name: 'View Operations Reports Section',
               description: "Allow user to access the 'Operations Reports' section within the 'Analytics' app.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
   ],
   // END ANALYTICS SECTIONS
   // ADMIN SECTIONS
   [
      {
         name: 'Organization',
         id: '747d14c6-81f0-4163-8217-600c24df295b',
         parentPage: { name: 'Admin', id: '86964522-f161-4891-9744-f31647f1ebe2' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'FolderClosed',
         iconColor: null,
         childrenPages: [],
         displayOrder: 1, // relative to the parent
         route: null,
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'fa16a531-b9bb-4a1b-a6a9-b6f223eb23aa',
               name: 'View Organization Section',
               description: "Allow user to access the 'Organization' section within the 'Admin' app.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Marketing',
         id: '16e7565b-c647-4a8f-bca7-2a014b23c97f',
         parentPage: { name: 'Admin', id: '86964522-f161-4891-9744-f31647f1ebe2' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'FolderClosed',
         iconColor: null,
         childrenPages: [],
         displayOrder: 2, // relative to the parent
         route: null,
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'bdea1a43-a9eb-48af-bdbf-d31e8f9c0273',
               name: 'View Marketing Section',
               description: "Allow user to access the 'Marketing' section within the 'Admin' app.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Operations',
         id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910',
         parentPage: { name: 'Admin', id: '86964522-f161-4891-9744-f31647f1ebe2' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'FolderClosed',
         iconColor: null,
         childrenPages: [],
         displayOrder: 3, // relative to the parent
         route: null,
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'cfdbdcef-93ca-4ffa-953c-c31ae375b352',
               name: 'View Operations Section',
               description: "Allow user to access the 'Operations' section within the 'Admin' app.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Sales',
         id: 'd61d90d2-4278-4867-9cc2-2a3637d7520a',
         parentPage: { name: 'Admin', id: '86964522-f161-4891-9744-f31647f1ebe2' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'FolderClosed',
         iconColor: null,
         childrenPages: [],
         displayOrder: 4, // relative to the parent
         route: null,
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'c78cbc48-5e77-402a-b35c-2e101211756d',
               name: 'View Sales Section',
               description: "Allow user to access the 'Sales' section within the 'Admin' app.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Phone Numbers',
         id: '6d0df293-410d-4079-904d-36c3fb786291',
         parentPage: { name: 'Admin', id: '86964522-f161-4891-9744-f31647f1ebe2' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'FolderClosed',
         iconColor: null,
         childrenPages: [],
         displayOrder: 5, // relative to the parent
         route: null,
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'f213d138-3e34-4fba-a3dc-ad36c51e735c',
               name: 'View Phone Numbers Section',
               description: "Allow user to access the 'Phone Numbers' section within the 'Admin' app.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
   ],
   // ADMIN SECTIONS
];

const defaultPagesConfig = [
   // Pages in Admin - Organization
   [
      {
         name: 'Users',
         id: 'd52fac4c-072b-4a12-b948-0827252602a7',
         parentPage: { name: 'Organization', pageType: 'Section', id: '747d14c6-81f0-4163-8217-600c24df295b' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 1, // relative to the parent
         route: 'admin/users',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'bad5c54a-1a2e-40a7-86b2-681cfea34f21',
               name: 'View Users Page',
               description: "Allow user to access the 'Users' page",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
            {
               addPermissionToSuperAdmin: true,
               id: 'd81bedf8-5bc0-4182-9598-ba94bd37fea2',
               name: 'Create A New User',
               description: 'Allow user to create a new user',
               isDefaultPermission: false,
               permissionTagsOnPermission: [],
            },
            {
               addPermissionToSuperAdmin: true,
               id: '0f52b67a-e684-41d0-8abe-d620a8eefd8b',
               name: 'Archive a User',
               description: 'Allow user to archive an existing user',
               isDefaultPermission: false,
               permissionTagsOnPermission: [],
            },
            {
               addPermissionToSuperAdmin: true,
               id: '1c6bfe82-0d2a-4287-8507-457fd8892de9',
               name: 'Share A User',
               description: 'Allow user to share an existing user',
               isDefaultPermission: false,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'User',
         id: '98fa896d-574c-4935-a6b1-db5b7c106b6b',
         parentPage: { name: 'Organization', pageType: 'Section', id: '747d14c6-81f0-4163-8217-600c24df295b' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 2, // relative to the parent
         route: 'admin/users/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'b6d3c04d-0c5b-4815-aa02-755cfd300506',
               name: 'View User Page',
               description: "Allow user to access an individual 'User' page within the 'Organization' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Roles',
         id: '3fe7b159-2188-4638-ae7e-3bae45c4e430',
         parentPage: { name: 'Organization', pageType: 'Section', id: '747d14c6-81f0-4163-8217-600c24df295b' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 3, // relative to the parent
         route: 'admin/roles',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'c82fcf42-d7c5-4468-bd53-870b8c2931ff',
               name: 'View Roles Page',
               description: "Allow user to access the 'Roles' page within the 'Organization' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Role',
         id: '8cdbc863-0074-49a1-b190-6988a8480bd1',
         parentPage: { name: 'Organization', pageType: 'Section', id: '747d14c6-81f0-4163-8217-600c24df295b' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 4, // relative to the parent
         route: 'admin/roles/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '17963e60-5eae-4fb7-92dd-faab2591e97f',
               name: 'View Role Page',
               description: "Allow user to access an individual 'Role' page within the 'Organization' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Buckets',
         id: 'e8fb9651-9b6d-4dec-8cdf-1469a6ce2d15',
         parentPage: { name: 'Organization', pageType: 'Section', id: '747d14c6-81f0-4163-8217-600c24df295b' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 5, // relative to the parent
         route: 'admin/buckets',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'd141e6ea-ab15-4890-9672-33a8391c2b4c',
               name: 'View Buckets Page',
               description: "Allow user to access the 'Buckets' page within the 'Organization' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Bucket',
         id: 'efdb1ede-afd4-4c04-a26a-e89d99d8853b',
         parentPage: { name: 'Organization', pageType: 'Section', id: '747d14c6-81f0-4163-8217-600c24df295b' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 6, // relative to the parent
         route: 'admin/buckets/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'ff1ce69a-886d-47dc-b1c1-4eb71b29e83b',
               name: 'View Bucket Page',
               description: "Allow user to access an individual 'Bucket' page within the 'Organization' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
   ],

   // Pages in Admin - Marketing
   [
      {
         name: 'Lead Record Fields',
         id: '4ee155b7-e840-4137-bf5f-fd9cc40f504e',
         parentPage: { name: 'Marketing', pageType: 'Section', id: '16e7565b-c647-4a8f-bca7-2a014b23c97f' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 1, // relative to the parent
         route: 'admin/lead-fields',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '1bdfd145-7b17-45b3-84de-87cf99cdba7e',
               name: 'View Lead Record Fields Page',
               description: "Allow user to access the 'Lead Record Fields' page within the 'Marketing' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Lead Record Field',
         id: 'f117e0cc-a62c-42b5-bfbe-574b10cf2a5f',
         parentPage: { name: 'Marketing', pageType: 'Section', id: '16e7565b-c647-4a8f-bca7-2a014b23c97f' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 2, // relative to the parent
         route: 'admin/lead-fields/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,

               id: '932fbcfb-54a8-4aa5-8dcd-206fe33ef5ef',
               name: 'View Lead Record Field Page',
               description:
                  "Allow user to access an individual 'Lead Record Field' page within the 'Marketing' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Lead Record Sections',
         id: '0febb7de-0464-412c-8f79-1efdb242d010',
         parentPage: { name: 'Marketing', pageType: 'Section', id: '16e7565b-c647-4a8f-bca7-2a014b23c97f' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 3, // relative to the parent
         route: 'admin/lead-sections',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '89495163-889d-40c0-88b1-939d025d718f',
               name: 'View Lead Record Sections Page',
               description: "Allow user to access the 'Lead Record Sections' page within the 'Marketing' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Lead Record Section',
         id: '0583d027-613d-41c3-9b8d-a38603915142',
         parentPage: { name: 'Marketing', pageType: 'Section', id: '16e7565b-c647-4a8f-bca7-2a014b23c97f' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 4, // relative to the parent
         route: 'admin/lead-sections/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '75074527-297a-4879-8e92-a9d0a045ca76',
               name: 'View Lead Record Section Page',
               description:
                  "Allow user to access an individual 'Lead Record Section' page within the 'Marketing' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Lead Sources',
         id: 'b778f087-c67e-4a9d-8283-6c8cfc42855b',
         parentPage: { name: 'Marketing', pageType: 'Section', id: '16e7565b-c647-4a8f-bca7-2a014b23c97f' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 5, // relative to the parent
         route: 'admin/lead-sources',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'e5e206f1-505a-415b-bb2c-e4e17c075d88',
               name: 'View Lead Sources Page',
               description: "Allow user to access the 'Lead Sources' page within the 'Marketing' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Lead Source',
         id: '75602f49-7b9a-4c03-89f8-58f100704646',
         parentPage: { name: 'Marketing', pageType: 'Section', id: '16e7565b-c647-4a8f-bca7-2a014b23c97f' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 6, // relative to the parent
         route: 'admin/lead-sources/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '4d304a1b-b3b8-48f7-9709-6dbc17c73e2a',
               name: 'View Lead Source Page',
               description: "Allow user to access an individual 'Lead Source' page within the 'Marketing' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Lead Statuses',
         id: 'a9f73e14-06a9-449c-8bc1-7614b93470ee',
         parentPage: { name: 'Marketing', pageType: 'Section', id: '16e7565b-c647-4a8f-bca7-2a014b23c97f' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 7, // relative to the parent
         route: 'admin/lead-statuses',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '56c5ecd4-2eaa-483e-80bc-ccdfffcfd94b',
               name: 'View Lead Statuses Page',
               description: "Allow user to access the 'Lead Statuses' page within the 'Marketing' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Lead Status',
         id: '1e415d00-acd7-4ce7-b97a-a605aa4b9681',
         parentPage: { name: 'Marketing', pageType: 'Section', id: '16e7565b-c647-4a8f-bca7-2a014b23c97f' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 8, // relative to the parent
         route: 'admin/lead-statuses/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'a9f1b8d0-1a95-4b32-bfd2-fa4632e7c30b',
               name: 'View Lead Status Page',
               description: "Allow user to access an individual 'Lead Status' page within the 'Marketing' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
   ],

   // Admin - Operation Pages
   [
      {
         name: 'Teams',
         id: '932f6708-4308-4af2-9e94-d61b69c0b80c',
         parentPage: { name: 'Operations', pageType: 'Section', id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 1, // relative to the parent
         route: 'admin/teams',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '24c8a672-e1d2-46bb-b0d0-bea9ae83af61',
               name: 'View Teams Page',
               description: "Allow user to access the 'Teams' page within the 'Operations' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Team',
         id: '919a1fcd-b4c2-4a06-84de-1f6ae6b28da5',
         parentPage: { name: 'Operations', pageType: 'Section', id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 2, // relative to the parent
         route: 'admin/teams/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '09a7aea3-e802-4a39-8793-b448de8aff2f',
               name: 'View Team Page',
               description: "Allow user to access an individual 'Team' page within the 'Operations' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Utility Companies',
         id: '0379474d-8a6a-48f9-8b98-36d0f3f405fc',
         parentPage: { name: 'Operations', pageType: 'Section', id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 3, // relative to the parent
         route: 'admin/utility-companies',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,

               id: '7d346715-ff9b-44ff-8dfc-118f17480a0c',
               name: 'View Utilties Companies Page',
               description: "Allow user to access the 'Utilty Companies' page within the 'Operations' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Utility Company',
         id: '0fa072c8-87e5-4150-999d-d10c14004d93',
         parentPage: { name: 'Operations', pageType: 'Section', id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 4, // relative to the parent
         route: 'admin/energy-companies/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'f0303833-5bb7-4950-997d-4d47f28bc593',
               name: 'View Utility Company Page',
               description:
                  "Allow user to access an individual 'Utility Company' page within the 'Operations' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Product Fields',
         id: '950ff278-03ea-4baa-85eb-6a3d527a4bf6',
         parentPage: { name: 'Operations', pageType: 'Section', id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 5, // relative to the parent
         route: 'admin/product-fields',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'fd2af4d4-8c39-4dac-987f-1c69cb2b1c58',
               name: 'View Product Fields Page',
               description: "Allow user to access the Product Fields' page within the 'Operations' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Product Field',
         id: 'f33fdf3b-ade4-4ab6-b91a-1ceb566cff2b',
         parentPage: { name: 'Operations', pageType: 'Section', id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 6, // relative to the parent
         route: 'admin/product-fields/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '8307672f-51bc-444d-b12d-2a1b9d39ec0d',
               name: 'View Product Field Page',
               description: "Allow user to access an individual 'Product Field' page within the 'Operations' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Coordinators',
         id: '7fb82496-4c51-4190-86a2-a2a8e9329847',
         parentPage: { name: 'Operations', pageType: 'Section', id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 7, // relative to the parent
         route: 'admin/coordinators',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '8be12a62-132f-437b-8f8f-0dc92ad03454',
               name: 'View Coordinators Page',
               description: "Allow user to access the 'Coordinators' page within the 'Operations' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Coordinator',
         id: '3c140a9c-3b9a-4f78-acf9-d8879f049750',
         parentPage: { name: 'Operations', pageType: 'Section', id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 8, // relative to the parent
         route: 'admin/coordinators/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '2b8200fd-df72-40ff-94d6-76119eac0e4a',
               name: 'View Coordinator Page',
               description: "Allow user to access an individual 'Coordinator' page within the 'Operations' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Stages',
         id: '0a601c36-c034-4257-8498-dda845b26e05',
         parentPage: { name: 'Operations', pageType: 'Section', id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 9, // relative to the parent
         route: 'admin/stages',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '86dd7336-ceb4-45c2-a7c6-85b82228fcde',
               name: 'View Stages Page',
               description: "Allow user to access the 'Stages' page within the 'Operations' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Stage',
         id: '3f4c034d-347f-402f-8b27-b69c9190340b',
         parentPage: { name: 'Operations', pageType: 'Section', id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 10, // relative to the parent
         route: 'admin/stages/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '27ffa07b-a19f-4788-96cc-fd2aa9397436',
               name: 'View Stage Page',
               description: "Allow user to access an individual 'Stage' page within the 'Operations' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Products',
         id: '8b3f89a6-b472-48a0-baab-b33afcd0a6ad',
         parentPage: { name: 'Operations', pageType: 'Section', id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 11, // relative to the parent
         route: 'admin/products',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '0645c08a-5e8a-48e4-aecc-cfc9d1989840',
               name: 'View Products Page',
               description: "Allow user to access the 'Products' page within the 'Operations' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Product',
         id: 'f0a8e640-5a93-49df-acb3-4dfd9f39351d',
         parentPage: { name: 'Operations', pageType: 'Section', id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 11, // relative to the parent
         route: 'admin/products/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '6cafcd2a-a1de-4b95-ba80-bd05076b221f',
               name: 'View Product Page',
               description: "Allow user to access an individual 'Product' page within the 'Operations' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Proposal Settings',
         id: 'd0599083-a6d1-4030-8c16-aa39633d3e7d',
         parentPage: { name: 'Operations', pageType: 'Section', id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 12, // relative to the parent
         route: 'admin/proposal-settings',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '1cd5acd2-3b84-45fe-a677-f1806ba45675',
               name: 'View Proposal Settings Page',
               description: "Allow user to access the 'Proposal Settings' page within the 'Operations' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Proposal Setting',
         id: '3995d137-4578-4382-a241-1ab9f1f3620f',
         parentPage: { name: 'Operations', pageType: 'Section', id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 13, // relative to the parent
         route: 'admin/proposal-settings/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'd7b76818-3a8f-4e1a-b3cc-1248a59649b2',
               name: 'View Proposal Setting Page',
               description:
                  "Allow user to access an individual 'Proposal Setting' page within the 'Operations' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Financiers',
         id: 'ffac6083-46fd-422f-96da-22c6e14c0454',
         parentPage: { name: 'Operations', pageType: 'Section', id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 14, // relative to the parent
         route: 'admin/financiers',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'b3574eb1-bd77-4c9b-9d9c-1360d37809e1',
               name: 'View Financiers Page',
               description: "Allow user to access the 'Financiers' page within the 'Operations' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Financier',
         id: 'fc293cda-0c7f-44c8-b398-ee04ac455ffb',
         parentPage: { name: 'Operations', pageType: 'Section', id: '29d1b96f-4516-44e1-bf56-8fc2f2dec910' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 15, // relative to the parent
         route: 'admin/financiers/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '5e045433-b1d4-43b5-8a25-5b3f526c1352',
               name: 'View Financier Page',
               description: "Allow user to access an individual 'Financier' page within the 'Operations' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
   ],

   // Installs pages
   [
      {
         name: 'Work Orders',
         id: 'fe4013f0-a140-497c-ae18-42e2d3704d43',
         parentPage: { name: 'Installs', pageType: 'App', id: '5a758c4c-1361-41f2-a993-30333a029f7b' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'Tools',
         iconColor: null,
         childrenPages: [],
         displayOrder: 1, // relative to the parent
         route: 'installs/work-orders',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '39b747b0-cb3c-441a-be5a-5472d90681b9',
               name: 'View Work Orders Page',
               description: "Allow user to access the 'Work Orders' page within the 'Installs' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Work Order',
         id: '385ec521-a0c1-417b-9609-dba9b57cb1ea',
         parentPage: { name: 'Installs', pageType: 'App', id: '5a758c4c-1361-41f2-a993-30333a029f7b' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'Tools',
         iconColor: null,
         childrenPages: [],
         displayOrder: 2, // relative to the parent
         route: 'installs/work-orders/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '59a7c80b-1c65-4750-bfba-4d058fa5e50b',
               name: 'View Work Order Page',
               description: "Allow user to access an individual 'Work Order' page within the 'Installs' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'My Proposals',
         id: '884b889c-96f5-4f22-9ec0-9e4662a21fd1',
         parentPage: { name: 'Installs', pageType: 'App', id: '5a758c4c-1361-41f2-a993-30333a029f7b' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'MagnifyPaper',
         iconColor: null,
         childrenPages: [],
         displayOrder: 3, // relative to the parent
         route: 'installs/my-proposals',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '979e677d-d13d-42e3-9f2c-51003489dc20',
               name: 'View My Proposals Page',
               description: "Allow user to access the 'My Proposals' page within the 'Installs' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'All Proposals',
         id: 'a757683a-65a4-4503-897a-fc4bdb6ae956',
         parentPage: { name: 'Installs', pageType: 'App', id: '5a758c4c-1361-41f2-a993-30333a029f7b' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'MagnifyPaper',
         iconColor: null,
         childrenPages: [],
         displayOrder: 4, // relative to the parent
         route: 'installs/proposals',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '56bf57c7-455d-4ef8-81bf-a09e55d2f4e8',
               name: 'View Proposals Page',
               description: "Allow user to access the 'All Proposals' page within the 'Installs' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
   ],
   // This one pertains to My Proposals && All Proposals --> proposal/*
   // For now, at least
   [
      {
         name: 'Proposal',
         id: '742aee79-cf6f-47e6-ad4a-4c4da5f43209',
         parentPage: { name: 'Installs', pageType: 'App', id: '5a758c4c-1361-41f2-a993-30333a029f7b' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'MagnifyPaper',
         iconColor: null,
         childrenPages: [],
         displayOrder: 5, // relative to the parent
         route: 'installs/proposals/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'f61ea75a-3313-4d96-b73b-98f2013a319f',
               name: 'View Proposal Page',
               description: "Allow user to access an individual 'Proposal' page within the 'Installs' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
   ],

   // Marketing pages
   [
      {
         name: 'Leads',
         id: '85158df4-15e4-4647-a2dc-fe86a0544234',
         parentPage: { name: 'Marketing', pageType: 'App', id: '2b52758c-b72f-4dca-b9b3-c176c10b5064' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'UserSearch',
         iconColor: null,
         childrenPages: [],
         displayOrder: 1, // relative to the parent
         route: 'marketing/leads',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: '23a7c45f-b50e-4341-99a4-4edd55628b1f',
               name: 'View Leads Page',
               description: "Allow user to access the 'Leads' page within the 'Marketing' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Lead',
         id: '3030af39-d841-416c-a015-7e3296780fab',
         parentPage: { name: 'Marketing', pageType: 'App', id: '2b52758c-b72f-4dca-b9b3-c176c10b5064' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'UserSearch',
         iconColor: null,
         childrenPages: [],
         displayOrder: 2, // relative to the parent
         route: 'marketing/leads/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'c28249f8-4f4f-4a93-baea-b511e2afa39d',
               name: 'View Lead Page',
               description: "Allow user to access an individual 'Lead' page within the 'Marketing' section.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
   ],

   // My Luminary pages
   [
      {
         name: 'Dashboard',
         id: '49a14b2d-afa0-4093-bc12-0715255abe7b',
         parentPage: { name: 'My Luminary', pageType: 'App', id: 'f9b2c575-df0d-4cee-9946-16bbf0007bb7' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'Dashboard',
         iconColor: null,
         childrenPages: [],
         displayOrder: 1, // relative to the parent
         route: 'dashboard',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: true,
               id: 'bf84e430-536c-403b-98ed-b89850b346c0',
               name: 'View Dashboard Page',
               description: "Allow user to access the 'Dashboard' page within the 'My Luminary' app.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
   ],

   // DEV pages
   [
      {
         name: 'Pages',
         id: '58e1944e-6ae0-433d-ab4d-52dc728c7248',
         parentPage: { name: 'Dev', pageType: 'App', id: '7b31fb52-496d-4178-840f-97112c08e7ba' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 1, // relative to the parent
         route: 'dev/pages',
         showOnSidebar: true,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: false,
               id: 'a9c69bee-e6b8-4ac0-90bd-5b30ea06dc5a',
               name: 'View Pages Page',
               description: "Allow user to access the 'Pages' page within the 'Dev' app.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
      {
         name: 'Page',
         id: 'bf98929e-2c86-4929-8eed-aa836769f8cd',
         parentPage: { name: 'Dev', pageType: 'App', id: '7b31fb52-496d-4178-840f-97112c08e7ba' },
         // parentPageId will be populated when looping through the apps...
         // it will match the parentPage.name
         parentPageId: null,
         iconName: 'PageBrowser',
         iconColor: null,
         childrenPages: [],
         displayOrder: 2, // relative to the parent
         route: 'dev/pages/*',
         showOnSidebar: false,
         pagePermissions: [
            // default VIEW permission for the super admin
            {
               addPermissionToSuperAdmin: false,
               id: 'b5af01e1-3522-4947-87fe-ea4146de1c22',
               name: 'View Page Page',
               description: "Allow user to access an individual 'Page' page within the 'Dev' app.",
               isDefaultPermission: true,
               permissionTagsOnPermission: [],
            },
         ],
      },
   ],
];

const uuidsForPermissionsOnRoles = [
   '14cbe976-4809-4d55-8c8d-a62fa505212c',
   '658f6122-7f49-4adb-b0f5-25c99057990a',
   '99f86e0d-5428-41e8-985d-0c8cbe87e286',
   'd3bfff02-0539-46c1-abff-5649176fb566',
   'e52493b9-9a9b-478d-aad9-8e705650d316',
   'aca96036-d21e-4417-8ff1-1d54cf650319',
   '7df52b26-93f7-475a-8576-4fed7647b95e',
   'b66c5ffb-fecd-44e1-b28c-911f8f40f05c',
   'f2a8d014-d399-4d83-aad2-c80b0b848d23',
   '27623b09-25df-47cf-aec6-1861e02e1ff9',
   '5be7c6ec-6592-47d2-a8c2-71aad5c3bc14',
   'ea07ddd4-6834-41d8-a6d6-0cde55eb477d',
   'd8842d1f-c8e8-484c-9fc0-c03ea1805fd0',
   'f026d1dc-58df-4815-8965-258112e8810b',
   '2e78722e-15d0-499f-b3b7-0899add0ed7b',
   '1494e428-d32c-4f52-aba7-e7bb5220ff96',
   'de1603a8-a444-4f77-ab94-0555cadfd0d8',
   '1ec3e80d-7483-4a37-ba68-8c2d6b6b30e6',
   '34fbc5dc-60d9-490e-a949-ccbb92f03746',
   '6581dfa1-9952-4aef-9bad-b6edf9be102c',
   '00cddded-b6af-4f85-8ca5-9f21058b04ae',
   '5b604e53-34f0-482b-b60a-11cedd89ad79',
   '78a7b715-ebf9-4979-ac29-e7bde73e85aa',
   '18295222-f92f-40ed-979f-3153fb824f29',
   '88166559-ba23-4067-9353-c7f954e45bef',
   '13b07d45-e61e-4ded-901a-c57a9bb51a7b',
   '975892df-4fb3-480f-ae13-523529e314f5',
   '420778aa-6c9b-4da9-9c49-b592a6dfd188',
   '93f95c9f-dcb2-47d2-b9a9-c5e28da41274',
   'fb76a132-1fb1-41da-843c-19df4f09f791',
   '31425183-ec3f-41df-8993-958ac5da8a81',
   '4d8ed416-4ce3-4f6d-aaef-d00287ac77f9',
   '130c4ead-0a00-4ce0-b23a-186792e23862',
   '9943c5ec-39c7-4311-b760-030de059e627',
   'd5d565d2-9f92-4cd9-a13d-863b4fb35b70',
   '76b26baf-2ab1-4ff9-b235-06c27e75c249',
   '572986de-c13a-4a16-b727-53d24fcae78b',
   '7942d23f-b0c0-4e94-89e1-5ca604a9c8b8',
   '2c3b8504-208a-4f63-ac05-f0e3dd32f6d8',
   'ce7d435d-01b2-4a51-baac-7c18817fd376',
   '0ac60750-7a87-4eda-87c4-42d745a6db77',
   '20038a75-a828-4e01-bfca-822ea742f114',
   '3248714e-d1c4-4df4-9503-b3c871521b0a',
   '546ae167-44df-4a57-bc57-4e7346e4b2a3',
   '3e44b757-9fd3-4304-b0cf-74627cae1c3c',
   'fab112e1-1dbe-4a9a-866f-07cd7c19e5f3',
   'c9994da3-e7c9-4b75-8db7-4c8c968ea400',
   '027f7687-e5a5-4a90-8c5b-782da4d2b144',
   '729572df-5683-4264-abe3-5171adcac123',
   'ced0c0e4-8c7f-42bd-b0b8-3b576e61c9af',
   'b00fb01f-0191-490d-903f-393d81b83040',
   'c591d115-b276-47d6-9aae-4b319e780fc3',
   'c227071b-f0d9-4f12-a911-e2d05135ca2b',
   'f0e2eee7-7db5-4d3c-a2da-037011b36e58',
   'eef8ddb0-bb19-430f-9edc-b9ee180e8a43',
   'cf0cdd84-1317-4319-944a-5da862519319',
   '6586d9f7-3064-4d9d-869e-85982511a2e5',
   '1c86a3f8-5cf7-4b2f-b27c-f7044272bd3f',
   '19f9b6fc-38f6-4630-bcb1-9d9506f040be',
   '151c5ce5-62f8-4a01-8968-de96d9279a3e',
   '2180213a-522c-4dbf-a530-ef3b5672dde3',
   '5c68e6f9-6d42-4299-84c7-f4517c0b84ac',
   'f1485a0e-3e50-4a86-9e38-68fba87b7d91',
   '332c3d6c-0a96-4894-9ff7-e7abfc19c5e5',
   '82687075-4651-4093-b59b-a308b054fb75',
   '6e0e16e3-5d31-4719-b925-08d040227df2',
   '27d923d0-2bb4-4328-8cbb-4ee5acda6e37',
   '1ee8fcfb-48b5-41de-bebb-30b0b0740798',
   'f97fb26d-1888-4ce9-8c59-429082c2b7b3',
   '6eb05260-e119-4821-91a0-55438b652f4a',
   '90f24575-b378-4ab6-b376-a24732058881',
   '3bae46ad-9da3-44e1-a075-14b2c42a6d8f',
   '077c621e-8630-4497-9f59-3512b521c50f',
   '93f7033e-aa90-4f58-b821-923dd95d3e89',
   '23a40f4e-023d-457b-afdb-4961e58f2308',
   'd6834b52-d771-4e35-9f7a-a8e781c028b2',
   'cbce575e-9c94-45bf-9dac-746d41d15e0b',
   '87840cf2-57a3-4a66-8f60-cc69d3d853bd',
   'b4dedf9b-3d9d-4871-b538-69976706ddaa',
   '81369ce7-4816-4c51-9f02-8ec5b1695d15',
   'fd3b63e5-2558-4423-8956-23a26a2b504e',
   '19859ed6-1055-488b-a81f-99a7f8885f1a',
   '68041b22-37c9-4752-ad75-963d9cdbe832',
   'ada20c63-102a-4d7c-b4bf-e2016d3d6a5f',
   '726da5f0-e7db-495c-9ad8-6c05eddf768e',
   '9c28966c-1463-4bf2-976e-d154ea6fd49a',
   '6bdcbe90-259a-4966-ac51-cf68e0170325',
   '0146dc6d-7ff2-4e39-92ac-fa8a0bf54eed',
   'a9c17a30-2438-4683-b5a4-2c4d692357da',
   'b65cc83e-bfed-46d7-893d-d02a14da7411',
   '1e9f3085-c7a6-4e1a-9465-1cd8b9ca69c6',
   'a04d0e5e-bd78-4a9f-a97f-cecd6de0229f',
   'b5a0e144-4cc1-43e0-a554-6021f2b6d2ff',
   '68d0a52c-a133-439d-8993-16a94bee692b',
   '5f68ddb9-c447-4d36-981b-15003800d801',
   'c49bd589-456d-4908-8fa3-dbeb51166e91',
   'ea09d3b6-91d1-4acb-a977-502b2fdb2ab0',
   '31eeeb47-cda5-4d38-b1f1-e7d94b93f05d',
   '18234cb4-2919-4857-8a05-0ea18745192a',
   '3aa3a509-557a-45bf-b284-89d6bf053964',
   'a8046318-86f6-417d-9c4e-848dc88b9509',
   'd3abe504-752f-41de-9539-34ae43ae691e',
   '8b6169bb-d029-4f9d-95d2-c2794e7200a4',
   '0c550bad-b2ca-4407-88ce-4ad3ce76e157',
   '4940fa17-96d8-4587-afec-5ae0c4bdf0e2',
   '9549cb65-7678-4852-b112-6b52751ccde4',
   'ff5a5c0e-74a7-457b-8d9c-e86abe024552',
   'eba8cef4-aa32-4694-9924-02cf4ecb7619',
   'd90d3abc-721c-4966-85f1-c6cdbed96422',
   '08d087a7-ac08-4592-a1ca-a615aca4c992',
   'a5c06a84-6b58-4748-a4d5-d939e9f34b61',
   'be60bf5a-7908-4463-b61b-4b68c3788f20',
   '512a49b6-4497-4b6b-930e-d47148c4fdc4',
   '5e588d44-ff91-480a-ac62-86e8fa922510',
   'b7a94cf4-1799-49ae-a021-492fb8676bdd',
   'c28f8d49-e8fb-4bec-ac43-5918a777240f',
   'fac8f1c1-86cb-46e0-81a3-61047cb6a4e6',
];
