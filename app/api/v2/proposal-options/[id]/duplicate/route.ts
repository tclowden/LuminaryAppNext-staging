import { NextRequest, NextResponse } from 'next/server';

async function duplicateProposalOptionById(request: NextRequest, options: any) {
   try {
      const proposalOptionId = options.params?.id;
      console.log('proposalOptionId:', proposalOptionId);
      return NextResponse.json('response here', { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(err, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

export { duplicateProposalOptionById as GET };
