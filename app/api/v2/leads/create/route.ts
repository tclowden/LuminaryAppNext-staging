import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import * as Yup from 'yup';
import { deepCopy } from '@/utilities/helpers';
import { Op } from 'sequelize';
import { triggerAutomation } from '@/serverActions';

async function createLead(request: NextRequest) {
   try {
      const reqBody = await request.json();
      const phoneNumber = reqBody?.phoneNumber;
      const oldLeadSourceId = reqBody?.leadSourceId;

      if (!phoneNumber || !oldLeadSourceId) {
         throw new LumError(401, 'Lead has missing values');
      }

      const formattedCreateLeadObject = await formatCreateLeadObject(reqBody);

      return NextResponse.json(formattedCreateLeadObject, { status: 200 });
   } catch (err: any) {
      console.log('err:', err);
      return NextResponse.json(null, { status: err?.statusCode || 500, statusText: err?.errorMessage || 'Error...' });
   }
}

async function formatCreateLeadObject(reqBody: any) {
   // Grab the easy values that shouldnt change
   const newLeadObject: any = {};

   const newLeadStatusId: any = await db.statuses.findOne({
      where: {
         name: {
            [Op.like]: 'New Lead',
         },
      },
      raw: true,
   });

   newLeadObject.firstName = reqBody.firstName?.trim();
   newLeadObject.lastName = reqBody.lastName?.trim();
   newLeadObject.phoneNumber = reqBody.phoneNumber?.trim();
   newLeadObject.email = reqBody.email?.trim();
   newLeadObject.ownerId = reqBody.ownerId;
   newLeadObject.streetAddress = reqBody.streetAddress;
   newLeadObject.city = reqBody.city?.trim();
   newLeadObject.state = reqBody.state?.trim();
   newLeadObject.zip = reqBody.zip?.trim();

   newLeadObject.homeOwner = reqBody.homeOwner?.trim();
   newLeadObject.typeOfHome = reqBody.typeOfHome?.trim();
   newLeadObject.lastUtilityBill = reqBody.lastUtilityBill?.trim();
   newLeadObject.averageUtilityBill = reqBody.averageUtilityBill?.trim();
   newLeadObject.creditScore = reqBody.creditScore?.trim();
   newLeadObject.smsConsent = reqBody.smsConsent?.trim();
   newLeadObject.gclid = reqBody.gclid?.trim();
   newLeadObject.everflowOfferId = reqBody.everflowOfferId?.trim();
   newLeadObject.everflowTransactionId = reqBody.everflowTransactionId?.trim();

   const newLead = await db.leads.create({
      statusId: newLeadStatusId.id,
      firstName: newLeadObject.firstName,
      lastName: newLeadObject.lastName,
      phoneNumber: newLeadObject.phoneNumber,
      leadSourceId: reqBody.leadSourceId,
      email: newLeadObject.email,
      ownerId: newLeadObject.ownerId,
      streetAddress: newLeadObject.streetAddress,
      city: newLeadObject.city,
      state: newLeadObject.state,
      zip: newLeadObject.zip,
   });

   triggerAutomation.fire('lead_created', {
      leadId: newLead.id,
      executorId: null,
      newValue: '',
      prevValue: '',
      orderId: null,
   })

   console.log('newLead: ', newLead);
   return newLead;

   //   with new lead id create the fieldsOnLead
   // const homeowner = createFieldOnLead(reqBody, newLead.id, 'homeOwner');
   // const typeOfHome = createFieldOnLead(reqBody, newLead.id, 'typeOfHome');
   // const lastUtilityBill = createFieldOnLead(reqBody, newLead.id, 'lastUtilityBill');
   // const averageUtilityBill = createFieldOnLead(reqBody, newLead.id, 'averageUtilityBill');
   // const creditScore = createFieldOnLead(reqBody, newLead.id, 'creditScore');
   // const smsConsent = createFieldOnLead(reqBody, newLead.id, 'smsConsent');
   // const archiveLeadId = createFieldOnLead(reqBody, newLead.id, 'archiveLeadId');
   // const gclid = createFieldOnLead(reqBody, newLead.id, 'gclid');
   // const everflowOfferId = createFieldOnLead(reqBody, newLead.id, 'everflowOfferId');
   // const everflowTransactionId = createFieldOnLead(reqBody, newLead.id, 'everflowTransactionId');

   // await Promise.all([
   //    homeowner,
   //    typeOfHome,
   //    lastUtilityBill,
   //    averageUtilityBill,
   //    creditScore,
   //    smsConsent,
   //    archiveLeadId,
   //    gclid,
   //    everflowOfferId,
   //    everflowTransactionId,
   // ])
   //    .then((res) => res)
   //    .catch((err) => console.log('err at creating fieldsOnLead: ', err));
}

async function createFieldOnLead(reqBody: any, leadId: string, fieldName: string) {
   switch (fieldName) {
      case 'homeOwner':
         const homeOwnerFieldId = await db.leadFields.findOne({
            where: { label: { [Op.iLike]: 'Homeowner' } },
         });
         await db.fieldsOnLeads
            .create({
               leadId: leadId,
               answer: reqBody.homeOwner,
               leadFieldId: homeOwnerFieldId.id,
            })
            .catch((err: any) => console.log('err at homeOwner: ', err));
         break;
      case 'typeOfHome':
         const typeOfHomeFieldId = await db.leadFields.findOne({
            where: { label: { [Op.iLike]: 'Type Of Home' } },
         });

         await db.fieldsOnLeads
            .create({
               leadId: leadId,
               answer: reqBody.typeOfHome,
               leadFieldId: typeOfHomeFieldId.id,
            })
            .catch((err: any) => console.log('err at typeOfHomeFieldId: ', err));
         break;
      case 'lastUtilityBill':
         const lastUtilityBillFieldId = await db.leadFields.findOne({
            where: { label: { [Op.iLike]: 'Last Utility Bill' } },
         });

         await db.fieldsOnLeads
            .create({
               leadId: leadId,
               answer: reqBody.lastUtilityBill,
               leadFieldId: lastUtilityBillFieldId.id,
            })
            .catch((err: any) => console.log('err at lastUtilityBillFieldId: ', err));
         break;
      case 'averageUtilityBill':
         const averageUtilityBillFieldId = await db.leadFields.findOne({
            where: { label: { [Op.iLike]: 'Average Utility Bill' } },
         });

         await db.fieldsOnLeads
            .create({
               leadId: leadId,
               answer: reqBody.averageUtilityBill,
               leadFieldId: averageUtilityBillFieldId.id,
            })
            .catch((err: any) => console.log('err at averageUtilityBillFieldId: ', err));
         break;
      case 'creditScore':
         const creditScoreFieldId = await db.leadFields.findOne({
            where: { label: { [Op.iLike]: 'Credit Score' } },
         });
         await db.fieldsOnLeads
            .create({
               leadId: leadId,
               answer: reqBody.creditScore,
               leadFieldId: creditScoreFieldId.id,
            })
            .catch((err: any) => console.log('err at creditScoreFieldId: ', err));
         break;
      case 'smsConsent':
         const smsConsentFieldId = await db.leadFields.findOne({
            where: { label: { [Op.iLike]: 'SMS Consent' } },
         });

         await db.fieldsOnLeads
            .create({
               leadId: leadId,
               answer: reqBody.smsConsent,
               leadFieldId: smsConsentFieldId.id,
            })
            .catch((err: any) => console.log('err at smsConsentFieldId: ', err));
         break;
      case 'archiveLeadId':
         const archiveLeadIdFieldId = await db.leadFields.findOne({
            where: { label: { [Op.iLike]: 'Archive Lead Id' } },
         });

         await db.fieldsOnLeads
            .create({
               leadId: leadId,
               answer: reqBody.archiveLeadId,
               leadFieldId: archiveLeadIdFieldId.id,
            })
            .catch((err: any) => console.log('err at archiveLeadIdFieldId: ', err));
         break;
      case 'gclid':
         const gclidFieldId = await db.leadFields.findOne({
            where: { label: { [Op.iLike]: 'Gclid' } },
         });

         await db.fieldsOnLeads
            .create({
               leadId: leadId,
               answer: reqBody.gclid,
               leadFieldId: gclidFieldId.id,
            })
            .catch((err: any) => console.log('err at gclidFieldId: ', err));
         break;
      case 'everflowOfferId':
         const everflowOfferIdFieldId = await db.leadFields.findOne({
            where: { label: { [Op.iLike]: 'Everflow Offer Id' } },
         });

         await db.fieldsOnLeads
            .create({
               leadId: leadId,
               answer: reqBody.everflowOfferId,
               leadFieldId: everflowOfferIdFieldId.id,
            })
            .catch((err: any) => console.log('err at everflowOfferIdFieldId: ', err));
         break;
      case 'everflowTransactionId':
         const everflowTransactionIdFieldId = await db.leadFields.findOne({
            where: { label: { [Op.iLike]: 'Everflow Transaction Id' } },
         });

         await db.fieldsOnLeads
            .create({
               leadId: leadId,
               answer: reqBody.everflowTransactionId,
               leadFieldId: everflowTransactionIdFieldId.id,
            })
            .catch((err: any) => console.log('err at everflowTransactionIdFieldId: ', err));
         break;

      default:
         console.log('nothing found');
         break;
   }
}
export { createLead as POST };
