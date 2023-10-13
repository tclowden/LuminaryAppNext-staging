import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';

/*
 * For status Rule "Trigger Webhook" we send a post request to
 * the provided webhook in the statusMetaData table. provide the lead and status data
 */
export async function POST(request: NextRequest) {
   try {
      console.log(request.headers);
      const body = await request.json();
      console.log(':::::::api/v2/statuses/webhooks: ', body);
      const { leadId, statusId } = body;

      if (!leadId || !statusId) {
         return NextResponse.json({ status: 403 });
      }
      const lead = await db.leads.findByPk(leadId, {}).catch((err: any) => {
         console.log('ERR: ', err);
         throw new LumError(400, err);
      });

      const statusMetaData = await db.statusMetaData.findOne({
         where: {
            statusId: statusId,
         },
      });

      console.log('statusMetaData: ', statusMetaData);

      const req = await fetch(statusMetaData.webhookUrl, {
         method: 'POST',
         // headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${}`},
         body: JSON.stringify(lead),
      });

      const res = await req.json();

      return NextResponse.json({ status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
