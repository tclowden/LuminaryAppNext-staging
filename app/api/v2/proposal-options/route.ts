import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
import * as Yup from 'yup';

async function createNewProposalOption(request: NextRequest, body: any, options: any) {
   const reqBody = await request.json();

   const schema = Yup.object({
      name: Yup.string().required(),
      proposalType: Yup.string().required(),
      utilityCompanyId: Yup.string().required(),
      financierId: Yup.string().required(),
   });
   await schema.validate(reqBody);

   const proposalId = await createProposalOption(reqBody);

   return NextResponse.json({ success: true, id: proposalId }, { status: 200 });
}

export { createNewProposalOption as POST };

async function createProposalOption(body: any) {
   try {
      const products = await getProducts();
      const systemTypes = await getSystemTypes();
      const savingsDisplayId = await getSavingsDisplayId(body.savingsOptionDisplay);
      const st = systemTypes;

      const proposalTypeMatchId = st.find((e: any) => {
         return e.name.toLowerCase() == body.proposalType.toLowerCase();
      });

      const proposalTypeId = proposalTypeMatchId.id;

      const taxCredit = body.taxCreditAsDownpayment || false;

      const proposalOptionSaveInfo = {
         name: body.name,
         downPayment: body.downPayment,
         taxCreditAsDownPayment: taxCredit,
         overrideDealerFee: body.overrideDealerFee || null,
         offsetDisclaimer: body.offsetDisclaimer,

         leadId: body.leadId,
         proposalTypeId: proposalTypeId,
         proposalTechId: body.tech,
         financierId: body.financierId,
         utilityCompanyId: body.utilityCompanyId,
         includeTravelFee: body.includeTravelFees,
         savingsOptionDisplayId: savingsDisplayId,
      };

      const createdProposalOptions = await db.proposalOptions.create(proposalOptionSaveInfo);
      const savedProposalOptionId = createdProposalOptions.dataValues.id;

      await db.proposalMonthlyProjections.create({
         janUsage: body.janUsage,
         febUsage: body.febUsage,
         marUsage: body.marUsage,
         aprUsage: body.aprUsage,
         mayUsage: body.mayUsage,
         junUsage: body.junUsage,
         julUsage: body.julUsage,
         augUsage: body.augUsage,
         sepUsage: body.sepUsage,
         octUsage: body.octUsage,
         novUsage: body.novUsage,
         decUsage: body.decUsage,
         janBill: body.janBill,
         febBill: body.febBill,
         aprBill: body.aprBill,
         marBill: body.marBill,
         mayBill: body.mayBill,
         junBill: body.junBill,
         julBill: body.julBill,
         augBill: body.augBill,
         sepBill: body.sepBill,
         octBill: body.octBill,
         novBill: body.novBill,
         decBill: body.decBill,
         janProduction: body.janProduction,
         febProduction: body.febProduction,
         aprProduction: body.aprProduction,
         marProduction: body.marProduction,
         mayProduction: body.mayProduction,
         junProduction: body.junProduction,
         julProduction: body.julProduction,
         augProduction: body.augProduction,
         sepProduction: body.sepProduction,
         octProduction: body.octProduction,
         novProduction: body.novProduction,
         decProduction: body.decProduction,
         proposalOptionId: savedProposalOptionId,
      });

      if (body.Solar) {
         const proposalSystemTypesLookup = await db.proposalSystemTypesLookup.findAll().catch((err: any) => {
            console.log(err);
            throw new LumError(400, err);
         });

         const solarTypeMatch = proposalSystemTypesLookup.find((e: any) => {
            return e.name.toLowerCase() == body.systemType.toLowerCase();
         });
         const solarTypeMatchId = solarTypeMatch.id;
         const proposalOptionsExtended = await db.proposalOptionsExtended.create({
            systemSize: body.roofKw,
            panelSize: body.panelSize,
            numberOfPanels: body.panelSize,
            homeImageUrl: body.homeImageUrl,
            priceOverride: body.solarPriceOverride,
            additionalCost: body.solarAdditionalCost,
            checkCost: body.checkCost,
            trenchingCost: body.trenchingCost,
            systemTypeId: solarTypeMatchId,
            notes: body.solarNotes,
            productId: products.find((e: any) => e.name == 'Solar').id,
            proposalOptionId: savedProposalOptionId,
         });
      }
      if (body['Energy Efficiency']) {
         const proposalOptionsExtended = await db.proposalOptionsExtended.create({
            productId: products.find((e: any) => e.name == 'Energy Efficiency').id,
            squareFootage: body.eeSquareFootage,
            overrideOffset: body.eeOverrideOffset,
            priceOverride: body.eeOverridePrice,
            additionalCost: body.eeAdditionalCost,
            notes: body.eeNotes,
            proposalOptionId: savedProposalOptionId,
         });
      }

      // So there's the hvac data we've got to save.
      // If we save them seperately then, which one holds the override, notes, additional cost, etc.

      if (body.hvac?.length > 0) {
         body.hvac.forEach(async (singleHVAC: any) => {
            const temp = {
               productId: products.find((e: any) => e.name == 'HVAC').id,
               quanity: singleHVAC.quantity,
               proposalProductConfigId: singleHVAC.hvacId,
               dualFuelUpgrade: body.dualFuelUpgrade,
               overrideOffset: body.hvacOverridePrice,
               additionalCost: body.hvacAdditionalCost,
               priceOverride: body.hvacOverrideOffset,
               notes: body.hvacNotes,
               showDetailsSection: body.HVACDisplay,
               proposalOptionId: savedProposalOptionId,
            };
            const proposalOptionsExtended = await db.proposalOptionsExtended.create(temp);
         });
      }

      if (body.battery?.length > 0) {
         body.battery.forEach(async (singleBattery: any) => {
            const proposalOptionsExtended = await db.proposalOptionsExtended.create({
               productId: products.find((e: any) => e.name == 'Battery').id,
               proposalProductConfigId: singleBattery.batteryId,
               quanity: singleBattery.quantity,
               priceOverride: body.batteryOverridePrice,
               proposalOptionId: savedProposalOptionId,
            });
         });
      }

      return savedProposalOptionId;
   } catch (err) {
      console.log(err);
   }
}

async function getProducts() {
   const products = await db.productsLookup
      .findAll({
         where: {
            proposalSupported: true,
         },
      })
      .catch((err: any) => {
         console.log(err);
         throw new LumError(400, err);
      });

   return products;
}

async function getSystemTypes() {
   const ptl = await db.proposalTypesLookup.findAll().catch((err: any) => {
      console.log(err);
      throw new LumError(400, err);
   });
   return ptl;
}

async function getSavingsDisplayId(name: string) {
   const savingsTypes = await db.proposalSavingOptionTypesLookup.findAll().catch((err: any) => {
      console.log(err);
      throw new LumError(400, err);
   });

   const type = savingsTypes.find((e: any) => {
      return (e.name = name);
   });

   if (type == undefined) return savingsTypes[0]?.id;

   return type?.id;
}
