import ThemeToggle from '../../../common/components/theme-toggle/ThemeToggle';
import ProfileWidget from './ProfileWidget';
import StatsWidget from './StatsWidget';

const apps = [
   {
      name: 'Sales',
      iconName: 'Wallet',
      activeColor: 'fill-lum-green-500',
      'data-test': 'salesNavLink',
   },
   {
      name: 'Marketing',
      iconName: 'Sights',
      activeColor: 'fill-lum-pink-500',
      'data-test': 'marketingNavLink',
   },
   {
      name: 'Funnels',
      iconName: 'Funnel',
      activeColor: 'fill-lum-cyan-500',
      'data-test': 'funnelsNavLink',
   },
   {
      name: 'Installs',
      iconName: 'Tools',
      activeColor: 'fill-lum-orange-500',
      'data-test': 'installsNavLink',
   },
   {
      name: 'Analytics',
      iconName: 'PieGraph',
      activeColor: 'fill-lum-blue-500',
      'data-test': 'analyticsNavLink',
   },
   {
      name: 'Admin',
      iconName: 'Gear',
      activeColor: 'fill-lum-purple-500',
      'data-test': 'adminNavLink',
   },
];

const dashboardStats = [
   {
      value: 112,
      type: 'number',
      goal: 200,
      color: 'bg-lum-green-500',
      title: 'Dials',
   },
   {
      value: 4,
      type: 'number',
      goal: 5,
      color: 'bg-lum-blue-500',
      title: 'Appts Set',
   },
   {
      value: 169,
      type: 'time',
      goal: 300,
      color: 'bg-lum-green-500',
      title: 'Talk Time',
   },
   {
      value: 319542,
      type: 'number',
      goal: 350000,
      color: 'bg-lum-cyan-500',
      title: '6 Week Rev',
   },
];

const appPages = [
   {
      appName: 'Dashboard',
      widgets: (
         <>
            {/* <ProfileWidget name={'Rod Kimble'} phone={5558675309} /> */}
            <StatsWidget stats={dashboardStats} />
            <ThemeToggle />
         </>
      ),
      linkSections: [
         {
            links: [
               {
                  title: 'Dashboard',
                  destination: '/dashboard',
                  iconName: 'Dashboard',
               },
               {
                  title: 'My Pipe',
                  destination: '/dashboard',
                  iconName: 'Target',
               },
            ],
         },
         {
            links: [
               {
                  title: 'Tasks',
                  destination: '/dashboard',
                  iconName: 'Checklist',
                  badge: true,
               },
               {
                  title: 'Notifications',
                  destination: '/dashboard',
                  iconName: 'Bell',
                  badge: true,
               },
               {
                  title: 'Missed Calls',
                  destination: '/dashboard',
                  iconName: 'MissedCall',
               },
               {
                  title: 'Voicemail',
                  destination: '/dashboard',
                  iconName: 'Voicemail',
                  badge: true,
               },
            ],
         },
         {
            links: [
               {
                  title: 'My Calendar',
                  destination: '/dashboard',
                  iconName: 'Calendar',
               },
               {
                  title: 'My Activity',
                  destination: '/dashboard',
                  iconName: 'ContactBook',
               },
               {
                  title: 'Manual Dial',
                  destination: '/manual-dial',
                  iconName: 'DialPad',
               },
            ],
         },
         {
            links: [
               {
                  title: 'User Settings',
                  destination: '/dashboard',
                  iconName: 'Gear',
               },
               {
                  title: 'Log Out',
                  destination: '/dashboard',
                  iconName: 'BackArrow',
               },
            ],
         },
      ],
   },
   {
      appName: 'Sales',
      linkSections: [
         {
            links: [
               {
                  title: 'My Pipe',
                  destination: '/sales/my-pipe',
                  iconName: 'Target',
               },
               {
                  title: 'My Customers',
                  destination: '/sales/my-customers',
                  iconName: 'Users',
               },
               {
                  title: 'Reheats',
                  destination: '/sales/reheats',
                  iconName: 'Reheat',
               },
               {
                  title: 'Solar Design',
                  destination: '/sales/solar-design',
                  iconName: 'SolarPanel',
               },
               {
                  title: 'Engineering',
                  destination: '/sales/engineering',
                  iconName: 'Tools',
               },
               {
                  title: 'All Reps',
                  destination: '/sales/all-reps',
                  iconName: 'HeadphoneRep',
               },
               {
                  title: 'All Leads',
                  destination: '/sales/leads',
                  iconName: 'UserSearch',
               },
               {
                  title: 'Monitoring',
                  destination: '/sales/monitoring',
                  iconName: 'MagnifyTrends',
               },
               {
                  title: 'Pitch Calendar',
                  destination: '/sales/pitch-calendar',
                  iconName: 'StarCalendar',
               },
            ],
         },
      ],
   },
   {
      appName: 'Marketing',
      linkSections: [
         {
            links: [
               {
                  title: 'Automation',
                  destination: '/marketing/automation',
                  iconName: 'Robot',
               },
               {
                  title: 'Messages',
                  destination: '/marketing/messages',
                  iconName: 'Messages',
               },
               {
                  title: 'Canned Emails',
                  destination: '/marketing/canned-emails',
                  iconName: 'Mail',
               },
               {
                  title: 'Canned Messages',
                  destination: '/marketing/canned-messages',
                  iconName: 'PaperAirplane',
               },
               {
                  title: 'Marketing Blasts',
                  destination: '/marketing/marketing-blasts',
                  iconName: 'Megaphone',
               },
               {
                  title: 'Lead Sources',
                  destination: '/marketing/lead-sources',
                  iconName: 'LeadSources',
               },
               {
                  title: 'Self Scheduler',
                  destination: '/marketing/self-scheduler',
                  iconName: 'PlusCalendar',
               },
               {
                  title: 'Lead Transfers',
                  destination: '/marketing/lead-transfers',
                  iconName: 'Checklist',
               },
               {
                  title: 'All Leads',
                  destination: '/marketing/leads',
                  iconName: 'UserSearch',
               },
            ],
         },
      ],
   },
   {
      appName: 'Funnels',
      linkSections: [
         {
            links: [
               {
                  title: 'Dashboard',
                  destination: '/funnels/dashboard',
                  iconName: 'Dashboard',
               },
               {
                  title: 'Notifications',
                  destination: '/funnels/notifications',
                  iconName: 'Bell',
               },
               {
                  title: 'Funnels',
                  destination: '/funnels/funnels',
                  iconName: 'Funnel',
               },
               {
                  title: 'Users',
                  destination: '/funnels/users',
                  iconName: 'Users',
               },
               {
                  title: 'Analytics',
                  destination: '/funnels/analytics',
                  iconName: 'PieGraph',
               },
            ],
         },
      ],
   },
   {
      appName: 'Installs',
      linkSections: [
         {
            links: [
               {
                  title: 'Work Orders',
                  destination: '/installs/work-orders',
                  iconName: 'Tools',
               },
               {
                  title: 'Install Calendar',
                  destination: '/installs/install-calendar',
                  iconName: 'CheckCalendar',
               },
               {
                  title: 'My Proposals',
                  destination: '/installs/my-proposals',
                  iconName: 'Proposal',
               },
               {
                  title: 'All Proposals',
                  destination: '/installs/proposals',
                  iconName: 'MagnifyPaper',
               },
               {
                  title: 'HVAC Calendar',
                  destination: '/installs/hvac-calendar',
                  iconName: 'CheckCalendar',
               },
               {
                  title: 'Custom Lists',
                  destination: '/installs/custom-lists',
                  iconName: 'PaperChecklist',
               },
            ],
         },
      ],
   },
   {
      appName: 'Analytics',
      linkSections: [
         {
            title: 'Sales Reports',
            links: [
               {
                  title: 'The Essentials',
                  destination: '/analytics/the-essentials',
               },
               {
                  title: 'Acquisition Report',
                  destination: '/analytics/acquisition-report',
               },
               {
                  title: 'Leads In Pipe',
                  destination: '/analytics/leads-in-pipe',
               },
               {
                  title: 'Dollar Per Lead',
                  destination: '/analytics/dollar-per-lead',
               },
               {
                  title: 'DPL Over Time',
                  destination: '/analytics/dpl-over-time',
               },
               {
                  title: 'Rep Dial Report',
                  destination: '/analytics/rep-dial-report',
               },
               {
                  title: 'Rep Sales Report',
                  destination: '/analytics/rep-sales-report',
               },
               {
                  title: 'Team Sales Report',
                  destination: '/analytics/team-sales-report',
               },
               {
                  title: 'Setters Report',
                  destination: '/analytics/setters-report',
               },
               {
                  title: 'Product Sales Report',
                  destination: '/analytics/product-sales-report',
               },
               {
                  title: 'Get Next Lead',
                  destination: '/analytics/get-next-lead',
               },
            ],
         },
         {
            title: 'Calling Reports',
            links: [
               {
                  title: 'Contact Rate',
                  destination: '/analytics/contact-rate',
               },
               {
                  title: 'Inbound Call Report',
                  destination: '/analytics/inbound-call-report',
               },
               {
                  title: 'Missed Call Report',
                  destination: '/analytics/missed-call-report',
               },
               {
                  title: 'Late Call Report',
                  destination: '/analytics/late-call-report',
               },
               {
                  title: 'Concierge Report',
                  destination: '/analytics/concierge-report',
               },
            ],
         },
         {
            title: 'Marketing Reports',
            links: [
               {
                  title: 'Lead Source Report',
                  destination: '/analytics/lead-source-report',
               },
               {
                  title: 'Lead Source Analytics',
                  destination: '/analytics/lead-source-analytics',
               },
               {
                  title: 'Lead Source Calendar',
                  destination: '/analytics/lead-source-calendar',
               },
               {
                  title: 'Lead Token Report',
                  destination: '/analytics/lead-token-report',
               },
               {
                  title: 'Status Report',
                  destination: '/analytics/status-report',
               },
            ],
         },
         {
            title: 'Operations Reports',
            links: [
               {
                  title: 'Previous Day Stage',
                  destination: '/analytics/previous-day-stage',
               },
               {
                  title: 'Task Filter Report',
                  destination: '/analytics/task-filter-report',
               },
            ],
         },
      ],
   },
   {
      appName: 'Admin',
      linkSections: [
         {
            title: 'Organization',
            links: [
               {
                  title: 'Users',
                  destination: '/admin/users',
               },
               {
                  title: 'Roles',
                  destination: '/admin/roles',
               },
               {
                  title: 'Permissions',
                  destination: '/admin/permissions',
               },
               {
                  title: 'Buckets',
                  destination: '/admin/buckets',
               },
               // {
               //    title: 'Lead Statuses',
               //    destination: '/admin/lead-statuses',
               // },
               // {
               //    title: 'Lead Sources',
               //    destination: '/admin/lead-sources',
               // },
               {
                  title: 'Tagging',
                  destination: '/admin/tagging',
               },
            ],
         },
         {
            title: 'Marketing',
            links: [
               {
                  title: 'Lead Record Fields',
                  destination: '/admin/lead-record-fields',
               },
               {
                  title: 'Lead Record Sections',
                  destination: '/admin/lead-record-sections',
               },
               {
                  title: 'Lead Sources',
                  destination: '/admin/lead-sources',
               },
               {
                  title: 'Lead Statuses',
                  destination: '/admin/lead-statuses',
               },
            ],
         },
         {
            title: 'Operations',
            links: [
               {
                  title: 'Ops Work Flows',
                  destination: '/admin/ops-work-flows',
               },
               {
                  title: 'Teams',
                  destination: '/admin/teams',
               },
               {
                  title: 'Fields',
                  destination: '/admin/fields',
               },
               {
                  title: 'Coordinators',
                  destination: '/admin/coordinators',
               },
               {
                  title: 'Stages',
                  destination: '/admin/stages',
               },
               {
                  title: 'Tasks',
                  destination: '/admin/tasks',
               },
               {
                  title: 'Task Filter List',
                  destination: '/admin/task-filter-list',
               },
               {
                  title: 'Utility Companies',
                  destination: '/admin/utility-companies',
               },
               {
                  title: 'Products',
                  destination: '/admin/products',
               },
               {
                  title: 'Product Pricing',
                  destination: '/admin/product-pricing',
               },
               {
                  title: 'Proposal Settings',
                  destination: '/admin/proposal-settings',
               },
               {
                  title: 'Stage Configuration',
                  destination: '/admin/stage-configuration',
               },
               {
                  title: 'Authority Jurisdictions',
                  destination: '/admin/authority-jurisdiction',
               },
               // {
               //    title: 'Product Pricing',
               //    destination: '/admin/product-pricing',
               // },
               {
                  title: 'Financiers',
                  destination: '/admin/financiers',
               },
            ],
         },
         {
            title: 'Sales',
            links: [
               {
                  title: 'Office Revenue',
                  destination: '/admin/office-revenue',
               },
               {
                  title: 'Leaderboard Config',
                  destination: '/admin/leaderboard-config',
               },
            ],
         },
         {
            title: 'Phone Numbers',
            links: [
               {
                  title: 'All Numbers',
                  destination: '/admin/all-numbers',
               },
               {
                  title: 'Voicemail Config',
                  destination: '/admin/voicemail-config',
               },
               {
                  title: 'Call Routes',
                  destination: '/admin/call-routes',
               },
               {
                  title: 'Voicemail Greetings',
                  destination: '/admin/voicemail-greetings',
               },
            ],
         },
      ],
   },
];

export { apps, appPages };
