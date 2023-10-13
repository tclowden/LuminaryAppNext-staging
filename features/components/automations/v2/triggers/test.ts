'use server';
import fs from 'fs';
import path from 'path';

type DataType = 'client' | 'server';

const dirPath = './features/components/automations/v2/triggers';

export const getAutomationTriggers = async (dataType: DataType) => {
   const data: any = {};
   try {
      const folders = fs.readdirSync(dirPath);
      for (const folder of folders) {
         const folderPath = path.join(dirPath, folder);
         if (fs.statSync(folderPath).isDirectory()) {
            const files = fs.readdirSync(folderPath);
            for (const file of files) {
               const filePath = path.join(dirPath, folder, file);
               // console.log('test:', file, dataType);
               if (fs.statSync(filePath).isFile() && file.startsWith('triggerData')) {
                  const [moduleName] = file.split('.');
                  // console.log('filePath:', filePath, moduleName);
                  // Get the trigger data
                  const triggerData = await import(
                     `@/features/components/automations/v2/triggers/${folder}/triggerData`
                  ).then((module) => module);

                  // console.log('triggerData:', triggerData);

                  // Get the additional trigger data based on the enviroment (client or server)
                  switch (dataType) {
                     case 'server':
                        //  Get the trigger execution
                        const triggerExecute = await import(
                           `@/features/components/automations/v2/triggers/${folder}/triggerExecute`
                        ).then((module) => module);
                        // Merge the data with the dbname as the key
                        data[triggerData.default.name] = { ...triggerData.default, ...triggerExecute };

                        break;
                     case 'client':
                        // //  Get the trigger modal
                        // const triggerModal = await import(
                        //    `@/features/components/automations/v2/triggers/${folder}/triggerModal`
                        // ).then((module) => module);
                        // //  Get the trigger tile
                        // const triggerTile = await import(
                        //    `@/features/components/automations/v2/triggers/${folder}/triggerTile`
                        // ).then((module) => module);

                        data.imports = data.imports || [];
                        data.imports.push(folder);
                        // triggerData.default?.types?.forEach((type: string) => {
                        //    console.log('type:', type);
                        //    data[type] = data[type] || [];
                        //    data[type].push({
                        //       ...triggerData.default,
                        //       ...triggerModal.default,
                        //       ...triggerTile,
                        //    });
                        // });

                        break;
                     default:
                        console.log('default');
                        break;
                  }

                  // data[module.default.name] = module;
               }
            }
         }
      }
   } catch (error) {
      console.error('Error:', error);
   }

   return data;
};
