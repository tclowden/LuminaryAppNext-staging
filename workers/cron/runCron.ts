import 'dotenv/config';
import { resetIsAvailableInQueue } from './resetIsAvailableInQueue';
if (process.argv.includes('--name')) {
   const flagIndex = process.argv.findIndex((arg: string) => arg === '--name');
   const name = process.argv[flagIndex + 1];

   console.log('name: ', name);

   switch (name) {
      case 'resetIsAvailableInQueue':
         resetIsAvailableInQueue();
         break;
      default:
         console.log(`No Cron Found with name ${name}`);
   }
}
