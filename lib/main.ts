import db from '@/sequelize/models';

export async function main() {
   await db.leadSourceTypes
      .create({
         typeName: 'Hello there',
      })
      .catch((err: any) => console.log(err));
}
