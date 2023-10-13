import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { queryObjFormatter } from '@/utilities/api/helpers';

export async function POST(request: NextRequest) {
   try {
      const reqBody = await request.json();
      let filterData: any = queryObjFormatter(reqBody, db);
      const pagesRes = await db.pagesLookup.findAll({
         ...filterData,
         where: {
            ...filterData?.where,
            // default search to archive of false
            // ...(typeof filterData?.where?.archived === 'undefined' && { archived: false }),
         },
         // paranoid: false
      });

      const formattedPages = pagesToClientFormatter(JSON.parse(JSON.stringify(pagesRes)));
      return NextResponse.json({ pages: formattedPages, raw: pagesRes }, { status: 200 });
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
