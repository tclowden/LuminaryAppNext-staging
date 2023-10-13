import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import * as Yup from 'yup';
import { Op, Sequelize } from 'sequelize';

async function getProposalQueueInfo(request: NextRequest) {
   try {
      const proposalQueue = await db.proposalQueue.findAll({
         include: [
            { model: db.proposalStatusTypesLookup, as: 'proposalStatus', required: false },
            { model: db.users, as: 'owner', required: false },
            { model: db.users, as: 'completedBy', required: false },
            { model: db.users, as: 'assignedTo', required: false },
            { model: db.users, as: 'assignedBy', required: false },
            { model: db.users, as: 'revisionRequestedBy', required: false },
         ],
         order: [['createdAt', 'DESC']],
         limit: 200,
         where: {
            proposalStatusId: {
               [Op.not]: null,
            },
         },
      });

      const proposalStatusTypesLookup = await db.proposalStatusTypesLookup.findAll();
      const formattedProposalQueue = proposalQueue.map((e: any) => {
         function dateDifferenceInWords(date1: any, date2: any) {
            // If negative say so in the output
            const past = date1 > date2 ? '- ' : '';

            // Ensure date1 is the earlier date
            if (date1 > date2) {
               [date1, date2] = [date2, date1];
            }

            // Calculate delta in days
            const millisecondsPerDay = 24 * 60 * 60 * 1000;
            const days = Math.round((date2 - date1) / millisecondsPerDay);

            // If days are less than 7, just return days
            if (days < 7) {
               return days === 1 ? `${past} 1 day` : `${past} ${days} days`;
            }

            // Weeks difference
            const weeks = Math.floor(days / 7);
            if (weeks === 1) {
               return `${past} 1 week`;
            }

            // If weeks are less than 4, just return weeks
            if (weeks < 4) {
               return `${past} ${weeks} weeks`;
            }

            // Months difference (rough approximation)
            const months = Math.floor(days / 30);
            if (months === 1) {
               return `{past} 1 month`;
            } else {
               return `${past} ${months} months`;
            }
         }

         const date = new Date(e?.dueAt);
         const formatter = new Intl.DateTimeFormat('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: 'numeric',
            hour12: true,
         });
         const humanReadableDate = formatter.format(date);

         let values = e.dataValues;
         values['proposalType'] = 'new';

         values['name'] = e?.assignedTo?.fullName;
         values['consultant'] = e?.owner?.fullName;
         values['dateDue'] = humanReadableDate;
         values['dueIn'] = dateDifferenceInWords(new Date(), e?.dueAt);

         return values;
      });

      const availableProposalTechs = await db.rolesOnUsers.findAll({
         include: { model: db.users, as: 'user', required: true },
         where: { roleId: '315974c1-47b8-4901-9a10-d731d9276346' }, // Proposal techs role
      });

      return NextResponse.json(
         {
            success: true,
            proposalQueue: formattedProposalQueue,
            proposalStatusTypesLookup: proposalStatusTypesLookup,
            availableProposalTechs: availableProposalTechs,
         },
         { status: 200 }
      );
   } catch (error) {
      console.log(error);
   }

   return NextResponse.json({ success: false }, { status: 500 });
}

export { getProposalQueueInfo as GET };
