import {
   createFieldTypes,
   createBucketTypes,
   createLeadSourcesTypes,
   createStatusTypes,
   createStageTypes,
   createNetMeteringTypes,
   createTaskDueDateTypes,
} from './types';
import { createStatuses } from './statuses';
import { createLeadSources } from './leadSources';
import { createLeads } from './leads';

async function main() {
   try {
      const typePromises: Array<Promise<any>> = [
         createFieldTypes(),
         createBucketTypes(),
         createLeadSourcesTypes(),
         createStatusTypes(),
         createStageTypes(),
         createNetMeteringTypes(),
         createTaskDueDateTypes(),
      ];
      await Promise.all(typePromises);
      console.log('Completed types data');

      await createStatuses();
      console.log('statuses created');

      await createLeadSources();
      console.log('leadSources created');

      await createLeads();
      console.log('SUCCESS! you should now have dummy lead data with varying sources and statuses');

      process.exit();
   } catch (err) {
      console.log(err);
      process.exit(1);
   }
}

main();
