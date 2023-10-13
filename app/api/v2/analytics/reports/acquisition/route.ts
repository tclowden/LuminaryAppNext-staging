import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';
import { NextResponse, NextRequest } from 'next/server';
import { Op, fn, col } from 'sequelize';

export async function GET(request: NextRequest) {
   try {
      const leadSources = await db.leadSources
         .findAll({
            include: {
               model: db.leadSourceTypes,
               required: false,
            },
            order: [['id', 'ASC']],
         })
         .catch((err: any) => {
            console.log(err);
            throw new LumError(400, err);
         });

      const leadSourcesOnLeads = await db.leads.findAndCountAll({
         attributes: [[db.Sequelize.fn('COUNT', db.Sequelize.col('leads.id')), 'totalLeads']],
         include: [
            {
               model: db.leadSources,
               attributes: ['id', 'name'], // Assuming 'id' and 'name' are columns in leadSources
            },
         ],
         group: ['leadSource.id'], // Group by leadSourceId
         limit: 20,
      });

      const combinedData = [].map((leadSource: any) => {
         return {
            leadSource: '',
            leads: '',
            contactRate: '',
            lastName: '',
            apptsSet: '',
            leadToAppt: '',
            apptsKept: '',
            keptRatio: '',
            sales: '',
            closeRatio: '',
            leadToSale: '',
            totalRevenue: '',
            cancels: '',
         };
      });

      return NextResponse.json(leadSourcesOnLeads);
   } catch (err) {
      console.log(err);
      return NextResponse.json({ error: 'An error occurred while fetching data.' });
   }
}
