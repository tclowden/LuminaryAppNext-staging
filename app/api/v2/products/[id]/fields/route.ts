import db from '@/sequelize/models';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

async function getFieldsOnProductByProductId(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);

      const searchParams = new URLSearchParams(request.nextUrl.searchParams);
      const { id } = options?.params;
      const hidden = searchParams.get('hidden');
      const hideOnCreate = searchParams.get('hideOnCreate');

      //! problem is if we do this below, it will return all the rows where hidden is false or hideOnCreate is false by default
      //! if the hidden serach param is undefined, we want to return all the rows where hidden is true & hidden is false... same with hideOnCreate
      // if (typeof hidden === 'undefined') hidden = false;
      // if (typeof hideOnCreate === 'undefined') hideOnCreate = false;
      let fieldsOnProduct = await db.fieldsOnProducts
         .findAll({
            // where: { productId: id, hidden: hidden, hideOnCreate: hideOnCreate },
            where: {
               productId: id,
               ...(hidden && { hidden: hidden }),
               ...(hideOnCreate && { hideOnCreate: hideOnCreate }),
            },
            include: [
               {
                  model: db.productFields,
                  required: false,
                  as: 'productField',
                  include: [
                     { model: db.fieldTypesLookup, as: 'fieldType', required: false },
                     { model: db.productFieldOptions, required: false },
                     { model: db.configuredListsLookup, required: false, as: 'configuredList' },
                  ],
               },
            ],
         })
         .then(deepCopy);

      // fieldsOnProduct = await getConfiguredListData(fieldsOnProduct);
      return NextResponse.json(fieldsOnProduct, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getFieldsOnProductByProductId as GET };

// const getConfiguredListData = async (fieldsOnProduct: Array<any>) => {
//    let tempFieldsOnProduct = [...fieldsOnProduct];

//    // see if there is a configuredList to populate
//    for (const fieldOnProd of tempFieldsOnProduct) {
//       let tempFieldOnProd = { ...fieldOnProd };

//       if (tempFieldOnProd?.productField?.configuredList) {
//          const modelName = tempFieldOnProd.productField.configuredList?.tableName;
//          if (!modelName) continue;

//          if (fieldOnProd.productField?.whereCondition) {
//             const temp = JSON.parse(fieldOnProd.productField.whereCondition);
//             if (fieldOnProd?.configuredList?.tableName === 'proposalOptions') {
//                // replace the '%' out of the leadId
//             }
//          }
//          // if we have a configured listId, then grab the rows from the configure list 'tableName;
//          // for proposals... we will need the options for the leadId, not all the options
//          // create another controller to get all the products while also accepting a leadId in the request to query the proposals from
//          // or could just filter them out on the client side... (LET'S DO THIS FOR NOW)
//          tempFieldOnProd['productField']['productFieldConfigurableListOptions'] = await db[modelName].findAll({
//             // until we can figure out how to query configured lists more dynamically...
//             // EX) proposal options... don't wanna grab all of them, just ones related to the lead
//             // where: tempFieldOnProd.productField.configuredList?.whereColumn,
//             // where: {
//             //    roleId: `46324832freadfh3`
//             // },
//             limit: 500,
//          });
//       }
//    }

//    return tempFieldsOnProduct;
// };
