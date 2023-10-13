import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { getUserDataFromHeaders } from '@/utilities/api/helpers';
import { cookies } from 'next/headers';
// import { AuthRoute } from '@/utilities/api/helpers';

// const handler = async (request: NextRequest, options: any, user: any) => {
//    try {
//       cookies();
//       const userObj = await getUserDataFromHeaders(request.headers);
//       console.log('userObj:', userObj);
//       // console.log('user:', user);
//       const pages = await db.pagesLookup.findAll({ order: [['createdAt', 'ASC']] });
//       const formattedPages = pagesToClientFormatter(JSON.parse(JSON.stringify(pages)));
//       return NextResponse.json({ pages: formattedPages, raw: pages }, { status: 200 });
//    } catch (err: any) {
//       console.log('err:', err);
//       return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
//    }
// };

// export const AuthRoute = async (cb: any) => {
//    return async (request: NextRequest, options: any) => {
//       // const token = request.headers.get('authorization')?.split('Bearer ')[1] || '';
//       // // if (token) throw new LumError(401, 'User token not valid...');
//       // // NextResponse.json({ success: false, result: `User token not valid...`, route: `/login` }, { status: 401 });
//       // const currUser = await verifyToken(token);
//       return cb(request, options, 'currUser?.payload');
//    };
// };

// export const GET = AuthRoute(handler);

export async function GET(request: NextRequest) {
   try {
      cookies();
      // const userObj = await getUserDataFromHeaders(request.headers);
      const pages = await db.pagesLookup.findAll({ order: [['createdAt', 'ASC']] });
      const formattedPages = pagesToClientFormatter(JSON.parse(JSON.stringify(pages)));
      return NextResponse.json({ pages: formattedPages, raw: pages }, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

const pagesToClientFormatter = (pages: Array<any>, parentPageId = null) => {
   const result = [];
   for (const page of pages) {
      if (page.parentPageId === parentPageId) {
         pagesToClientFormatter(pages, page.id);
         const children = pagesToClientFormatter(pages, page.id);
         const hasChildren = !!children?.length;

         const tempSections: Array<any> = [];
         const tempPages: Array<any> = [];
         // eventually will need
         // if they don't have a route, but do have a parentPageId && their parentPageId has a route ... then it's a field
         // const tempFields = [];
         if (hasChildren) {
            children.forEach((child) => {
               if (child?.parentPageId && !child?.route) {
                  // section
                  tempSections.push(child);
               } else if (child?.parentPageId && child?.route) {
                  // page
                  tempPages.push(child);
               }
            });
         }

         result.push({ ...page, sections: tempSections, pages: tempPages });
      }
   }
   return result;
};

const pagesToDbFormatter = (pages: Array<any>, parentPageId = null) => {
   const result: Array<any> = [];
   for (const page of pages) {
      page.parentPageId = parentPageId;
      result.push(page);
      if (!!page?.pages?.length) result.push(...pagesToDbFormatter(page.pages, page.id));
      if (!!page?.sections?.length) result.push(...pagesToDbFormatter(page.sections, page.id));

      // delete unneccesary keys
      delete page['pages'];
      delete page['sections'];
   }
   return result;
};
