// import { NextRequest, NextResponse } from 'next/server';
// import db from '@/sequelize/models';

import { NextRequest, NextResponse } from 'next/server';
import { validateParams } from '../utilities';
import db from '@/sequelize/models';
import { LumError } from '@/utilities/models/LumError';

// get page data by id
export async function GET(request: NextRequest, options: any) {
   try {
      const { id } = validateParams(options.params);
      const app = await db.pagesLookup.findByPk(id, {}).catch((err: any) => {
         throw new LumError(400, err);
      });
      return NextResponse.json(app, { status: 200 });
   } catch (err: any) {
      console.log('err', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

// // update page by id
// export async function PUT() {}

// // archive
// export async function DELETE(request: NextRequest, options: any) {
//    try {
//       const { id } = options.params;
//       // await db.pagesLookup.restore({ where: { id: id } });
//       await db.pagesLookup.destroy({ where: { id: id } });
//       const page = await db.pagesLookup.findByPk(id, { paranoid: false });
//       await db.auditLogs.create({
//          table: 'pagesLookup',
//          rowId: id,
//          originalValue: JSON.stringify({ deletedAt: null }),
//          newValue: JSON.stringify({ deleteAt: page?.deletedAt }),
//          modifiedById: '794dfc4b-9686-4357-a59e-1ebef1abf652',
//          modifiedAt: new Date(),
//       });
//       return NextResponse.json({ success: true }, { status: 200 });
//    } catch (err: any) {
//       console.log('err:', err);
//       return NextResponse.json({ success: false, error: err }, { status: 500 });
//    }
// }
