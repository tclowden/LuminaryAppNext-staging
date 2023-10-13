import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from './utilities/api/helpers';

const unauthedPathnameIncludes = ['login', 'ably', 'twilio', '/users/init', '/users/keys'];
const matcherRoutes = ['/api/v2/:path*'];

export const config = { matcher: matcherRoutes };

export async function middleware(request: NextRequest) {
   // const isApiReq = request.nextUrl.pathname.startsWith('/api');
   // const isUnauthedPath = unauthedPathnameIncludes.some((name: string) => request.nextUrl.pathname.includes(name));
   // if (isApiReq && !isUnauthedPath) {
   //    let token = request.headers.get('authorization')?.split(`Bearer `)[1] || '';
   //    const result = await verifyToken(token);
   //    if (!result) {
   //       request.cookies.delete('LUM_AUTH');
   //       return NextResponse.redirect(`${process.env.CLIENT_SITE}/login`);
   //    }
   // }

   NextResponse.next();
}
