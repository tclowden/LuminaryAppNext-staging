import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import { kv } from '@vercel/kv';

export async function GET(request: NextRequest) {
   try {
      return NextResponse.json({ status: 200 });
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

// Body holds the key to set
export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const keyValue = await kv.get(body.key);

      if (keyValue) {
         console.log('up top');
         return NextResponse.json(keyValue, { status: 200 });
      } else {
         console.log('down low');
         const data = await db.users.findOne({
            where: {
               lastName: 'Pickett',
            },
            attributes: ['id', 'name'],
         });

         await kv.set(body.key, data);
         const data1 = await kv.get(body.key);

         return NextResponse.json(data1, { status: 200 });
      }
   } catch (err: any) {
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

// import { kv } from "@vercel/kv";
// await kv.set("user_1_session", "session_token_value");
// const session = await kv.get("user_1_session");
