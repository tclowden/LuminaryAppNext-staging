import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';

export async function GET(request: NextRequest, params: { params: { id: string } }) {
   try {
      const singleStatus = await db.statuses.findByPk(params.params.id, {
         attributes: [[db.Sequelize.fn('COUNT', db.Sequelize.col('leads.id')), 'leadCount'], 'id', 'name', 'typeId'],
         include: [
            {
               model: db.statusTypes,
               as: 'statusType',
               attributes: ['id', 'name'],
            },
            {
               model: db.leads,
               as: 'leads',
               required: false,
               attributes: [],
            },
            {
               model: db.rulesOnStatuses,
               required: false,
               attributes: ['id', 'statusId', 'statusRulesTypesId'],
               include: [
                  {
                     model: db.statusRulesTypes,
                     attributes: ['id', 'name', 'description'],
                  },
               ],
            },
            {
               model: db.statusMetaData,
               attributes: ['id', 'webhookUrl', 'requiredNumberOfCalls'],
               required: false,
            },
         ],
         group: [
            'statuses.id',
            'statusType.id',
            'rulesOnStatuses.id',
            'rulesOnStatuses->statusRulesType.id',
            'statusMetaData.id',
         ],
      });

      return NextResponse.json(singleStatus, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

type RulesOnStatusInsert = {
   statusId: string;
   statusTypeId: string;
   requiredNumberOfCalls: number;
};

export async function PUT(request: NextRequest, params: { params: { id: string } }) {
   try {
      const body = await request.json();
      // Update status info
      await db.statuses.update(
         { name: body.statusName },
         {
            where: {
               id: params.params.id,
            },
         }
      );

      // Deleting all rules on status for a clean rewrite
      await db.rulesOnStatuses.destroy({
         where: {
            statusId: params.params.id,
         },
      });

      // update rules on statuses
      const rulesOnStatusPayload = body.rulesOnStatus.map((rule: any) => {
         return {
            statusId: params.params.id,
            statusRulesTypesId: rule.id,
         };
      });

      // bulk update rules on status
      await db.rulesOnStatuses.bulkCreate(rulesOnStatusPayload);

      // update statusMetaData
      await db.statusMetaData.destroy({
         where: {
            statusId: params.params.id,
         },
      });

      // Create status rule
      await db.statusMetaData.create({
         statusId: params.params.id,
         requiredNumberOfCalls: body.requiredNumberOfCalls,
         webhookUrl: body.webhookUrl,
      });

      return NextResponse.json({ status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

// BODYYYYYYY:  {
//    userId: 'db130ac7-ee2e-49a7-843a-b3f2cda04bed',
//    numCalls: 0,
//    statusName: 'Reload',
//    rulesOnStatus: [
//      {
//        id: 'c2333bbc-7c0a-42d8-9d25-2cad5c96130f',
//        name: 'Ask Appointment Outcome',
//        description: 'Prompts the user if the most recent appointment was kept.',
//        createdAt: '2023-08-15T18:36:09.086Z',
//        updatedAt: '2023-08-15T18:36:09.086Z',
//        deletedAt: null
//      },
//      {
//        id: 'd728d74e-b925-4467-9d8c-7761abe592eb',
//        name: 'Bucket Status',
//        description: 'Leads will be placed in a Get Next Lead Bucket.',
//        createdAt: '2023-08-15T18:36:09.086Z',
//        updatedAt: '2023-08-15T18:36:09.086Z',
//        deletedAt: null
//      }
//    ]
//  }
