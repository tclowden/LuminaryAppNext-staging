import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, options: any) {
   const reqBody = await request.json();
   console.log('we here!!!! nice webhook bro');
   console.log('reqBody:', reqBody);
   return NextResponse.json({ message: 'hello' }, { status: 200 });
}
