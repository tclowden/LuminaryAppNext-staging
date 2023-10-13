import { NextRequest, NextResponse } from 'next/server';
import { getAuthedUrl } from '@/utilities/api/cloudStorage';
export const dynamic = 'force-dynamic';

async function getUrlFromAttachmentsFilePath(request: NextRequest) {
   try {
      const body = await request.json();
      const { filePath } = body;
      if (!filePath) {
         return NextResponse.json(null, { status: 400, statusText: 'Invalid filePath' });
      }
      const authedUrl = await getAuthedUrl(filePath);

      return NextResponse.json({ url: authedUrl }, { status: 200 });
   } catch (err: any) {
      console.log('err: ', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getUrlFromAttachmentsFilePath as POST };
