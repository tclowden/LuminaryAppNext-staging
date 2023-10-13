import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { getUserDataFromHeaders } from '@/utilities/api/helpers';

async function addProposalOptionToQueue(request: NextRequest) {
   const userObj = await getUserDataFromHeaders(request.headers);
   console.log('requested by is in here?', userObj?.id);

   const reqBody = await request.json();
   const newStage = reqBody.newStage;
   const proposalQueueId = reqBody.proposalQueueId;

   const proposalStatusTypesLoopup = await db.proposalStatusTypesLookup.findAll();
   const newStatusRecord = proposalStatusTypesLoopup.find((e: any) => e.name == newStage);

   const updatedPQ = await db.proposalQueue.update(
      {
         proposalStatusId: newStatusRecord.id,

         assignedById: userObj.id,
      },
      {
         where: {
            id: proposalQueueId,
         },
      }
   );

   console.log('updated', updatedPQ);

   if (newStage == 'Missing Info') {
      const addRevisionsRequested = await db.revisionsRequested.create({
         ...reqBody,
         // energyUsage: false,
         // sqFtRoof: false,
         // electricCompany: false,
         // other: false,
         proposalQueueId: proposalQueueId,
      });
   }

   if (newStage == 'In Progress') {
      // reqBody.userId;

      const updatedPQ = await db.proposalQueue.update(
         {
            proposalStatusId: newStatusRecord.id,

            assignedById: userObj.id,
            assignedToId: reqBody.userId,
         },
         {
            where: {
               id: proposalQueueId,
            },
         }
      );
   }

   return NextResponse.json({ success: true, id: proposalQueueId }, { status: 200 });
}
export { addProposalOptionToQueue as POST };
