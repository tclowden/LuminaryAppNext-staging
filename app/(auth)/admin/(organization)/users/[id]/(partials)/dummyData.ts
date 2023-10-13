export const defaultCustomPermissions = [
   { name: 'Access To Manual Dialing', description: 'Restrict access to the manual dial feature.' },
   {
      name: 'Limit Rep to Retired Leads',
      description: 'The Get Next Lead button will only return retired leads for this rep.',
   },
   {
      name: 'Access To Bucket Leads',
      description:
         'Restrict access to the dial leads in the bucket. By default, anyone who can dial has access to bucket leads.',
   },
   {
      name: 'Access To Reheats',
      description: 'Allow access to reheats leads (leads that are post-failed to convince).',
   },
   {
      name: 'Access To Bound Lead Source Calls',
      description:
         'Incoming calls directly to their number will still work. This is only pertaining to in bound calls from a lead source.',
   },
];

export const defaultPagePermissions = [
   { name: 'Home' },
   {
      name: 'Sales',
      description: 'Allow user to access the Sales Division of the application.',
      expandableData: [
         { name: 'My Pipe', description: 'Allow user to access the "My Pipe" page of the Sales application.' },
         {
            name: 'My Customers',
            description: 'Allow user to access the "My Customers" page of the Sales application.',
         },
         { name: 'All Leads', description: 'Allow user to access the "Leads" page of the Sales application.' },
         { name: 'All Reps', description: 'Allow user to access the "Reps" page of the Sales application.' },
         {
            name: 'Agent Monitoring',
            description: 'Allow user to access the "Agent Monitoring" page of the Sales application.',
         },
      ],
   },
   {
      name: 'Marketing',
      description: 'Allow user to access the Marketing Division of the application.',
      expandableData: [
         { name: 'Automation', description: 'Allow user to access the "Automation" page of the Sales application.' },
         {
            name: 'Messages',
            description: 'Allow user to access the "Messages" page of the Sales application.',
            expandableData: [
               {
                  name: 'KS',
                  description: 'Kansas',
                  expandableData: [
                     {
                        name: 'HELLOOOO',
                        description: 'NOTHING',
                     },
                  ],
               },
               { name: 'TX', description: 'Texas' },
            ],
         },
      ],
   },
];

export const defaultLeadsInPipe = [
   {
      leadName: 'Birdie Phelps',
      phoneNumber: '(123) 456-7891',
      status: { name: 'Appointment Scheduled' },
      leadSource: { name: 'Facebook' },
      callCount: 4,
      lastCall: '1d 5h ago',
      nextAppt: '12/22/22 - 7:30pm',
      address: '1234 W 9876 S Rogers AR Bentiville',
      actionsConfig: { call: true, message: true },
   },
   {
      leadName: 'Birdie Phelps',
      phoneNumber: '(123) 456-7891',
      status: { name: 'Appointment Scheduled' },
      leadSource: { name: 'Facebook' },
      callCount: 4,
      lastCall: '1d 5h ago',
      nextAppt: '12/22/22 - 7:30pm',
      address: '1234 W 9876 S Rogers AR Bentiville',
      actionsConfig: { call: true, message: true },
   },
   {
      leadName: 'Birdie Phelps',
      phoneNumber: '(123) 456-7891',
      status: { name: 'Appointment Scheduled' },
      leadSource: { name: 'Facebook' },
      callCount: 4,
      lastCall: '1d 5h ago',
      nextAppt: '12/22/22 - 7:30pm',
      address: '1234 W 9876 S Rogers AR Bentiville',
      actionsConfig: { call: true, message: true },
   },
   {
      leadName: 'Birdie Phelps',
      phoneNumber: '(123) 456-7891',
      status: { name: 'Appointment Scheduled' },
      leadSource: { name: 'Facebook' },
      callCount: 4,
      lastCall: '1d 5h ago',
      nextAppt: '12/22/22 - 7:30pm',
      address: '1234 W 9876 S Rogers AR Bentiville',
      actionsConfig: { call: true, message: true },
   },
   {
      leadName: 'Birdie Phelps',
      phoneNumber: '(123) 456-7891',
      status: { name: 'Appointment Scheduled' },
      leadSource: { name: 'Facebook' },
      callCount: 4,
      lastCall: '1d 5h ago',
      nextAppt: '12/22/22 - 7:30pm',
      address: '1234 W 9876 S Rogers AR Bentiville',
      actionsConfig: { call: true, message: true },
   },
];

export const defaultCustomers = [
   {
      customerName: 'Birdie Phelps',
      phoneNumber: '(123) 456-7891',
      status: { name: 'Customer' },
      leadSource: { name: 'Youtube' },
      callCount: 7,
      lastCall: '1d 5h ago',
      purchaseDate: '12/22/22 - 7:30pm',
      address: '1234 W 9876 S Rogers AR Bentiville',
      actionsConfig: { call: true, message: true },
   },
   {
      customerName: 'Birdie Phelps',
      phoneNumber: '(123) 456-7891',
      status: { name: 'Customer' },
      leadSource: { name: 'Youtube' },
      callCount: 7,
      lastCall: '1d 5h ago',
      purchaseDate: '12/22/22 - 7:30pm',
      address: '1234 W 9876 S Rogers AR Bentiville',
      actionsConfig: { call: true, message: true },
   },
   {
      customerName: 'Birdie Phelps',
      phoneNumber: '(123) 456-7891',
      status: { name: 'Customer' },
      leadSource: { name: 'Youtube' },
      callCount: 7,
      lastCall: '1d 5h ago',
      purchaseDate: '12/22/22 - 7:30pm',
      address: '1234 W 9876 S Rogers AR Bentiville',
      actionsConfig: { call: true, message: true },
   },
   {
      customerName: 'Birdie Phelps',
      phoneNumber: '(123) 456-7891',
      status: { name: 'Customer' },
      leadSource: { name: 'Youtube' },
      callCount: 7,
      lastCall: '1d 5h ago',
      purchaseDate: '12/22/22 - 7:30pm',
      address: '1234 W 9876 S Rogers AR Bentiville',
      actionsConfig: { call: true, message: true },
   },
   {
      customerName: 'Birdie Phelps',
      phoneNumber: '(123) 456-7891',
      status: { name: 'Customer' },
      leadSource: { name: 'Youtube' },
      callCount: 7,
      lastCall: '1d 5h ago',
      purchaseDate: '12/22/22 - 7:30pm',
      address: '1234 W 9876 S Rogers AR Bentiville',
      actionsConfig: { call: true, message: true },
   },
];

export const defaultPitchReport = [
   {
      customerName: 'Birdie Phelps',
      status: { name: 'Customer' },
      apptKept: 'Yes',
      lastAppt: '12/22/22 - 7:30pm',
      nextAppt: '12/31/22 - 4:15pm',
      actionsConfig: { call: true, message: true },
   },
   {
      customerName: 'Birdie Phelps',
      status: { name: 'Appointment Scheduled' },
      apptKept: 'Yes',
      lastAppt: '',
      nextAppt: '12/30/22 - 1:45pm',
      actionsConfig: { call: true, message: true },
   },
   {
      customerName: 'Birdie Phelps',
      status: { name: 'Appointment Scheduled' },
      apptKept: 'No',
      lastAppt: '12/22/22 - 7:30pm',
      nextAppt: '12/31/22 - 4:15pm',
      actionsConfig: { call: true, message: true },
   },
   {
      customerName: 'Birdie Phelps',
      status: { name: 'Post - Failed to Convince' },
      apptKept: 'Yes',
      lastAppt: '12/22/22 - 7:30pm',
      nextAppt: '',
      actionsConfig: { call: true, message: true },
   },
   {
      customerName: 'Birdie Phelps',
      status: { name: 'Customer' },
      apptKept: 'Yes',
      lastAppt: '12/22/22 - 7:30pm',
      nextAppt: '12/31/22 - 4:15pm',
      actionsConfig: { call: true, message: true },
   },
   {
      customerName: 'Birdie Phelps',
      status: { name: 'Appointment Scheduled' },
      apptKept: 'Yes',
      lastAppt: '',
      nextAppt: '12/30/22 - 1:45pm',
      actionsConfig: { call: true, message: true },
   },
   {
      customerName: 'Birdie Phelps',
      status: { name: 'Appointment Scheduled' },
      apptKept: 'No',
      lastAppt: '12/22/22 - 7:30pm',
      nextAppt: '12/31/22 - 4:15pm',
      actionsConfig: { call: true, message: true },
   },
   {
      customerName: 'Birdie Phelps',
      status: { name: 'Post - Failed to Convince' },
      apptKept: 'Yes',
      lastAppt: '12/22/22 - 7:30pm',
      nextAppt: '',
      actionsConfig: { call: true, message: true },
   },
];
