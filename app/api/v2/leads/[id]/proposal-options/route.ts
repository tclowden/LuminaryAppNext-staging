import { LumError } from '@/utilities/models/LumError';
import { NextRequest, NextResponse } from 'next/server';

async function getLeadProposalOptions(request: NextRequest, options: any) {
   try {
      if (!options?.params?.id) throw new LumError(400, `Invalid id in params`);
      const { id: leadId } = options?.params;

      return NextResponse.json('response here', { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { getLeadProposalOptions as GET };
