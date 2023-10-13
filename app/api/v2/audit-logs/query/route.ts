import { NextRequest, NextResponse } from 'next/server';
import db from '@/sequelize/models';
import { queryObjFormatter } from '@/utilities/api/helpers';

export async function POST(request: NextRequest) {
   try {
      const reqBody = await request.json();
      let filterData: any = queryObjFormatter(reqBody, db);

      const auditLogsRes = await db.auditLogs.findAll({
         ...filterData,
         where: {
            ...filterData?.where,
         },
      });

      // Include row data of the updated record
      const auditLogs = await Promise.all(
         auditLogsRes.map(async (auditLog: any) => {
            const updatedRecord = await db[auditLog.table].findByPk(auditLog.rowId);
            return updatedRecord ? { ...auditLog.toJSON(), updatedRecord } : auditLog;
         })
      );

      return NextResponse.json(auditLogs, { status: 200 });
   } catch (err: any) {
      console.log('/api/v2/audit-logs/query -> POST -> Error:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}
