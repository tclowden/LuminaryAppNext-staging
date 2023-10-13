import db from '@/sequelize/models';
import { deepCopy } from '@/utilities/helpers';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

async function getFieldsOnOrderByOrderId(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const fieldsOnOrder = await db.fieldsOnOrders
         .findAll({
            where: { orderId: id },
            attributes: {
               exclude: ['productFieldId'],
            },
            include: [
               // {
               //    model: db.productFields,
               //    required: false,
               //    as: 'productField',
               //    include: [
               //       { model: db.fieldTypesLookup, as: 'fieldType', required: false },
               //       { model: db.productFieldOptions, required: false },
               //       { model: db.configuredListsLookup, required: false, as: 'configuredList' },
               //    ],
               // },
               { model: db.fieldsOnProducts, required: false, as: 'fieldOnProduct' },
            ],
         })
         .then(deepCopy);

      return NextResponse.json(fieldsOnOrder, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getFieldsOnOrderByOrderId as GET };

// const reformatProductData = async (fieldsOnOrder: Array<any>) => {
//    let tempFieldsOnOrder = [...fieldsOnOrder];

//    // see if there is a configuredList to populate
//    for (const product of fieldsOnOrder) {
//       let newFieldsOnProd = [];
//       for (const fieldOnProd of product.fieldsOnProduct) {
//          let tempFieldOnProd = { ...fieldOnProd };
//          if (tempFieldOnProd?.productField?.configuredList) {
//             const modelName = tempFieldOnProd.productField.configuredList?.tableName;
//             if (!modelName) return tempFieldOnProd;
//             // if we have a configured listId, then grab the rows from the configure list 'tableName;
//             // for proposals... we will need the options for the leadId, not all the options
//             // create another controller to get all the products while also accepting a leadId in the request to query the proposals from
//             // or could just filter them out on the client side... (LET'S DO THIS FOR NOW)
//             tempFieldOnProd['productField']['productFieldConfigurableListOptions'] = await db[modelName].findAll({});
//          }
//          newFieldsOnProd.push(tempFieldOnProd);
//       }
//       product['fieldsOnProduct'] = newFieldsOnProd;
//    }

//    return tempFieldsOnOrder;
// };
