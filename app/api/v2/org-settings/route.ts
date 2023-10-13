import db from '@/sequelize/models';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
   try {
      const orgSettings = await db.orgSettings.findOne({ order: [['createdAt', 'ASC']] });
      return NextResponse.json(orgSettings, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      //   check if values exist in db, if they exist, update, if not, create
      const orgSetting = await db.orgSettings.findOne();
      if (orgSetting) {
         await orgSetting.update(body);
      } else {
         await db.orgSettings.create(body);
      }
      return NextResponse.json({ status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
