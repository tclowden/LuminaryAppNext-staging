import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';

async function getLeadOrders(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = options?.params;

      const ordersByLeadId = await db.orders.findAll({
         where: { leadId: id },
         include: [
            { model: db.users, as: 'owner', required: false },
            { model: db.users, as: 'createdBy', required: false },
            {
               model: db.productsLookup,
               as: 'product',
               required: false,
               include: [
                  {
                     model: db.fieldsOnProducts,
                     as: 'fieldsOnProduct',
                     required: false,
                     include: [
                        {
                           model: db.productFields,
                           include: [{ model: db.fieldTypesLookup, as: 'fieldType', required: false }],
                           required: false,
                        },
                     ],
                  },
               ],
            },
            { model: db.productStages, as: 'productStage', required: false },
            // {
            //    model: db.fieldsOnOrders,
            //    as: 'fieldsOnOrder',
            //    include: [
            //       {
            //          model: db.productFields,
            //          include: [{ model: db.fieldTypesLookup, as: 'fieldType', required: false }],
            //          required: false,
            //          as: 'productField',
            //       },
            //    ],
            //    required: false,
            //    order: [['createdAt', 'ASC']],
            //    // include: [
            //    //    {
            //    //       model: db.fieldsOnProducts,
            //    //       as: 'fieldOnProduct',
            //    //       include: [
            //    //          {
            //    //             model: db.productFields,
            //    //             include: [{ model: db.fieldTypesLookup, as: 'fieldType', required: false }],
            //    //             required: false,
            //    //          },
            //    //       ],
            //    //       required: false,
            //    //    },
            //    // ],
            // },
         ],
         order: [['createdAt', 'ASC']],
      });

      return NextResponse.json(ordersByLeadId, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getLeadOrders as GET };
