import db from '@/sequelize/models';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
   try {
      const leadSourcesOnLeads = await db.leads.findAll({
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

      const names = leadSourcesOnLeads.map((source: any) => source.leadSource.name);
      const count = leadSourcesOnLeads.map((source: any) => source.totalLeads);
      // const formattedData = {
      //    names,
      //    count,
      // };
      const formattedData = leadSourcesOnLeads.map((source: Record<string, any>) => ({
         id: source.leadSource.id,
         name: source.leadSource.name,
         // totalLeads: parseInt(source.dataValues.totalLeads),
         totalLeads: +source.dataValues.totalLeads,
      }));

      // console.log('Results: ', leadSourcesOnLeads);
      // return NextResponse.json(leadSourcesOnLeads);
      return NextResponse.json(formattedData, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: 500 });
   }
}
