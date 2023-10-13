'use server';
import fs from 'fs';
import path from 'path';

type DataType = 'client' | 'server';

const dirPath = './features/components/automations/v2/actions';

export const getAutomationActions = async (dataType: DataType) => {
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
               if (fs.statSync(filePath).isFile() && file.startsWith('actionData')) {
                  const [moduleName] = file.split('.');
                  // console.log('filePath:', filePath, moduleName);
                  // Get the action data
                  const actionData = await import(
                     `@/features/components/automations/v2/actions/${folder}/actionData`
                  ).then((module) => module);

                  // console.log('actionData:', actionData);

                  // Get the additional action data based on the enviroment (client or server)
                  switch (dataType) {
                     case 'server':
                        //  Get the action execution
                        const actionExecute = await import(
                           `@/features/components/automations/v2/actions/${folder}/actionExecute`
                        ).then((module) => module);
                        // Merge the data with the dbname as the key
                        data[actionData.default.name] = { ...actionData, ...actionExecute };

                        break;
                     case 'client':
                        // //  Get the action modal
                        // const actionModal = await import(
                        //    `@/features/components/automations/v2/actions/${folder}/actionModal`
                        // ).then((module) => module);
                        // //  Get the action tile
                        // const actionTile = await import(
                        //    `@/features/components/automations/v2/actions/${folder}/actionTile`
                        // ).then((module) => module);

                        data.imports = data.imports || [];
                        data.imports.push(folder);
                        // actionData.default?.types?.forEach((type: string) => {
                        //    console.log('type:', type);
                        //    data[type] = data[type] || [];
                        //    data[type].push({
                        //       ...actionData.default,
                        //       ...actionModal.default,
                        //       ...actionTile,
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
