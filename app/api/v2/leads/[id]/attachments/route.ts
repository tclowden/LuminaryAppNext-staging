import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';

export async function GET(request: NextRequest, options: { params: { id: string } }) {
   try {
      const leadId = options.params.id;
      if (!leadId) throw new LumError(400, 'Must provide lead id');

      const lead = await db.leads.findByPk(leadId).catch((err: any) => {
         throw new LumError(400, err);
      });
      if (!lead) throw new LumError(400, `Lead with id: ${leadId}, does not exist.`);

      const attachments = await db.attachments
         .findAll({
            where: { leadId: leadId },
            include: [{ model: db.users, as: 'createdBy', attributes: { exclude: ['passwordHash'] } }],
            order: [['createdAt', 'DESC']],
         })
         .catch((err: any) => {
            console.log(err);
            throw new LumError(500, err.message);
         });

      return NextResponse.json(attachments, { status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
