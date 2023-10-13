import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';

export async function GET(request: NextRequest, params: { params: { id: string } }) {
   try {
      if (!params?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id } = params?.params;

      const notes = await db.notes
         .findAll({
            include: [
               { model: db.users, as: 'createdBy', required: false },
               { model: db.notifications, as: 'notifications', required: false },
            ],
            where: { leadId: id },
            order: [['createdAt', 'ASC']],
         })
         .catch((err: any) => {
            console.log('ERR: ', err);
         });

      return NextResponse.json(notes, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export async function PUT(request: NextRequest) {
   try {
      const body = await request.json();
      const createdNote = await db.notes.create({ ...body }).catch((err: any) => {
         throw new LumError(400, err);
      });

      const newNoteWithAssociations = await db.notes
         .findByPk(createdNote.id, {
            include: [{ model: db.users, as: 'createdBy', attributes: { exclude: ['passwordHash'] } }],
         })
         .catch((err: any) => {
            throw new LumError(400, err);
         });

      return NextResponse.json(newNoteWithAssociations, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
