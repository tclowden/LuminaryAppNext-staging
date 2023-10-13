import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import * as Yup from 'yup';

export async function validateProductFieldOptions(reqBody: any) {
   for (const prodFieldOption of reqBody?.productFieldOptions) {
      const schema = Yup.object({
         id: Yup.string().nullable(),
         value: Yup.string().required(),
         displayOrder: Yup.number().required(),
      });
      await schema.validate(prodFieldOption);

      if (prodFieldOption?.id) {
         const productFieldOptionIdExists = await db.productFieldOptions.findByPk(prodFieldOption.id);
         if (!productFieldOptionIdExists)
            throw new LumError(400, `Product field option with id: '${prodFieldOption.id}' doesn't exist.`);
      }
   }

   // validate the displayOrder value isn't a duplicate of another one...
   const productFieldOptionsCopy = new Set(reqBody.productFieldOptions.map((option: any) => option.displayOrder));
   if (productFieldOptionsCopy.size < reqBody.productFieldOptions.length)
      throw new LumError(400, `There is a duplicate display order value.`);

   return true;
}
