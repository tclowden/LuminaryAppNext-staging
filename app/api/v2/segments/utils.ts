import db from '@/sequelize/models';
import { Op } from 'sequelize';
import { ColumnValue, ComparisonOperator, FilterPayloadType } from './types';

export async function buildWhereCondition(filters: FilterPayloadType[]): Promise<any> {
   let whereCondition: any = { [Op.or]: [] };

   for (const filter of filters) {
      const { columnDisplayName, columnValues, comparisonOperator } = filter;

      if (columnDisplayName === 'Lead Source Type') {
         const colValIds: number[] = columnValues.map((value) => value.id);
         const leadSourceIds = await getLeadSourceIdsFromTypes(colValIds);
         const condition = buildCondition(comparisonOperator, leadSourceIds);
         whereCondition[Op.or].push({ leadSourceId: condition });
      }
      if (columnDisplayName === 'Lead Source') {
         const condition = buildCondition(comparisonOperator, columnValues);
         whereCondition[Op.or].push({ leadSourceId: condition });
      }

      if (columnDisplayName === 'Status') {
         const condition = buildCondition(comparisonOperator, columnValues);
         whereCondition[Op.or].push({ statusId: condition });
      }

      if (columnDisplayName === 'Status Type') {
         const colValIds: number[] = columnValues.map((value) => value.id);
         const statusIds = await getStatusIdsFromTypes(colValIds);
         const condition = buildCondition(comparisonOperator, statusIds);
         whereCondition[Op.or].push({ statusId: condition });
      }
   }

   return whereCondition;
}

export async function getLeadSourceIdsFromTypes(ids: number[]) {
   return await db.leadSources.findAll({
      attributes: ['id'],
      where: { typeId: { [Op.in]: ids } },
   });
}

async function getStatusIdsFromTypes(ids: number[]) {
   return await db.statuses.findAll({
      attributes: ['id'],
      where: { typeId: { [Op.in]: ids } },
   });
}

function buildCondition(operator: ComparisonOperator, values: ColumnValue[]): any {
   const sequelizeOperator = getOperator(operator);
   const condition = { [sequelizeOperator]: values.map((value) => value.id) };
   return condition;
}

function getOperator(operator: ComparisonOperator) {
   // console.log('operator:', operator);
   switch (operator) {
      case 'Is Not':
      case 'Is Not In':
         return Op.notIn;
      case 'Is':
      case 'Is In':
      default:
         return Op.in;
   }
}
