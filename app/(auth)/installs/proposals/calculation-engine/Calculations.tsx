import db from '@/sequelize/models';

interface pData {
   financing: Array<Object>;
   solar: Array<Object>;
   energy: Array<Object>;
}

interface calculateData {
   downPayment: number;
   panels: number;
   hasBattery: boolean;
   hasHvac: boolean;
   hasSolar: boolean;
   hasEe: boolean;
   offset: number;
   offsetHuman: number;
   fedTaxCredit: number;
   netSystemInvestment: number;
   totalLoanAmount: number;
   displaySystemSize: number;
}

export const Calculations = class Calculations {
   proposalData: any; // Set to pData when the type is working

   hasBattery: boolean;
   hasHvac: boolean;
   hasSolar: boolean;
   hasEe: boolean;

   constructor(proposalData: any) {
      this.proposalData = proposalData;

      this.hasBattery = false;
      this.hasHvac = false;
      this.hasSolar = false;
      this.hasEe = false;
   }

   getEstimatedProduction(
      janP: number,
      febP: number,
      marP: number,
      aprP: number,
      mayP: number,
      junP: number,
      julP: number,
      augP: number,
      sepP: number,
      octP: number,
      novP: number,
      decP: number
   ) {
      const janProduction = janP;
      const febProduction = febP;
      const marProduction = marP;
      const aprProduction = aprP;
      const mayProduction = mayP;
      const junProduction = junP;
      const julProduction = julP;
      const augProduction = augP;
      const sepProduction = sepP;
      const octProduction = octP;
      const novProduction = novP;
      const decProduction = decP;

      return (
         janProduction +
         febProduction +
         marProduction +
         aprProduction +
         mayProduction +
         junProduction +
         julProduction +
         augProduction +
         sepProduction +
         octProduction +
         novProduction +
         decProduction
      );
   }

   getTotalConsumed(
      jan: number,
      feb: number,
      mar: number,
      apr: number,
      may: number,
      jun: number,
      jul: number,
      aug: number,
      sep: number,
      oct: number,
      nov: number,
      dec: number
   ) {
      const janUsage = jan;
      const febUsage = feb;
      const marUsage = mar;
      const aprUsage = apr;
      const mayUsage = may;
      const junUsage = jun;
      const julUsage = jul;
      const augUsage = aug;
      const sepUsage = sep;
      const octUsage = oct;
      const novUsage = nov;
      const decUsage = dec;

      return (
         janUsage +
         febUsage +
         marUsage +
         aprUsage +
         mayUsage +
         junUsage +
         julUsage +
         augUsage +
         sepUsage +
         octUsage +
         novUsage +
         decUsage
      );
   }

   getEstimatedProductionByMonth() {
      let monthly = [];
      monthly.push(this.proposalData.solar[0]?.janProduction);
      monthly.push(this.proposalData.solar[0]?.febProduction);
      monthly.push(this.proposalData.solar[0]?.marProduction);
      monthly.push(this.proposalData.solar[0]?.aprProduction);
      monthly.push(this.proposalData.solar[0]?.mayProduction);
      monthly.push(this.proposalData.solar[0]?.junProduction);
      monthly.push(this.proposalData.solar[0]?.julProduction);
      monthly.push(this.proposalData.solar[0]?.augProduction);
      monthly.push(this.proposalData.solar[0]?.sepProduction);
      monthly.push(this.proposalData.solar[0]?.octProduction);
      monthly.push(this.proposalData.solar[0]?.novProduction);
      monthly.push(this.proposalData.solar[0]?.decProduction);
      return monthly;
   }

   getEstimatedConsumptionByMonth() {
      let monthly = [];
      monthly.push(this.proposalData.energy[0].janUsage);
      monthly.push(this.proposalData.energy[0].febUsage);
      monthly.push(this.proposalData.energy[0].marUsage);
      monthly.push(this.proposalData.energy[0].aprUsage);
      monthly.push(this.proposalData.energy[0].mayUsage);
      monthly.push(this.proposalData.energy[0].junUsage);
      monthly.push(this.proposalData.energy[0].julUsage);
      monthly.push(this.proposalData.energy[0].augUsage);
      monthly.push(this.proposalData.energy[0].sepUsage);
      monthly.push(this.proposalData.energy[0].octUsage);
      monthly.push(this.proposalData.energy[0].novUsage);
      monthly.push(this.proposalData.energy[0].decUsage);
      return monthly;
   }

   getEstimatedReducedEnergyByMonth() {
      let monthly = [];
      monthly.push(this.proposalData.energy[0].janUsage);
      monthly.push(this.proposalData.energy[0].febUsage);
      monthly.push(this.proposalData.energy[0].marUsage);
      monthly.push(this.proposalData.energy[0].aprUsage);
      monthly.push(this.proposalData.energy[0].mayUsage);
      monthly.push(this.proposalData.energy[0].junUsage);
      monthly.push(this.proposalData.energy[0].julUsage);
      monthly.push(this.proposalData.energy[0].augUsage);
      monthly.push(this.proposalData.energy[0].sepUsage);
      monthly.push(this.proposalData.energy[0].octUsage);
      monthly.push(this.proposalData.energy[0].novUsage);
      monthly.push(this.proposalData.energy[0].decUsage);
      return monthly;
   }

   getTotalSolarInvestment(hasSolar: boolean, systemSize: number, ppw: number) {
      // If no solar, then 0;
      if (!hasSolar) {
         return 0;
      }
      // Solar price cost
      return systemSize * 1000 * ppw;
   }

   getTotalEE(hasEE: boolean, eeSquareFootage: number, eePricePerSqFt: number) {
      let totalEE = 0;

      // small error where object is not defined
      if (!hasEE) {
         totalEE = eeSquareFootage * eePricePerSqFt;
      }
      return totalEE;
   }

   getTotalHvac(hasHvac: boolean, hvacSelections: any, overrideHvac: number, proposalProductsConfig: any) {
      //hvac
      let totalHvac = 0;
      let hvacTax = 0;
      let totalIncludingTaxes = 0;

      if (hasHvac) {
         // Multiple selections
         for (let i = 0; i < hvacSelections.length; i++) {
            // let HvacPackage = hvacSelections[i]['hvac_package'];
            const hvacQuantity = hvacSelections[i]['quanity'];
            const hvacProductConfigId = hvacSelections[i]['proposalProductConfigId'];
            const hvacConfig = proposalProductsConfig.find((e: any) => {
               return e.id == hvacProductConfigId;
            });
            let price = hvacConfig?.price;
            totalHvac = totalHvac + price;

            if (overrideHvac != 0) {
               price = overrideHvac;
            }

            totalHvac = totalHvac + price * hvacQuantity;
         }
      } else {
         // totalHvac = 350; // uv light
         totalHvac = 0;
         // hvacTax =  350 * $main_dealer_fee;
         // totalHvac = hvacTax;
         // totalIncludingTaxes = totalHvac; // No tax on this
         return 0;
      }

      return totalHvac;
   }

   getTotalBattery(hasBattery: boolean, batterySelections: any, proposalProductsConfig: any) {
      let totalBattery = 0;

      const overrideBattery = 0;
      // See if there's actually an override

      if (hasBattery) {
         // Multiple selections
         for (let i = 0; i < batterySelections.length; i++) {
            const batteryQuantity = batterySelections[i]['quanity'];
            const batteryProductConfigId = batterySelections[i]['proposalProductConfigId'];
            if (batteryProductConfigId == null) {
               return 0;
            }
            const batteryConfig = proposalProductsConfig.find((e: any) => {
               return e.id == batteryProductConfigId;
            });
            let price = batteryConfig.price;
            totalBattery = totalBattery + price;

            if (overrideBattery != 0) {
               price = overrideBattery;
            }

            totalBattery = totalBattery + price * batteryQuantity;
         }
      } else {
         totalBattery = 0;
      }

      return totalBattery;
   }

   getPPW(
      systemSize: number,
      stateId: string,
      systemTypeId: string,
      hasTravelFee: boolean,
      proposalBrackets: any
   ): number {
      if (systemSize == undefined) return 5.5;

      const brackets = proposalBrackets.filter((e: any) => {
         return e.stateId == stateId && e.travelFee == hasTravelFee && e.systemTypeId == systemTypeId;
      });

      let pricePerWatt = 5.5;
      let currentKw = 0;
      for (let i = 0; i < brackets.length; i++) {
         const element = brackets[i];
         // Bracket's an empty column, can safely skip
         if (element.ppw == null && element.kw == null) {
            continue;
         }
         // Get kw
         if (element.ppw != null) {
            currentKw = element.kw;
         }
         // each loop we update to the next price that fits.
         // Until it no longer compares, then we finish the looping, and boom.
         // You've selected the one within a bracket.
         if (systemSize > element.kw) {
            if (element.ppw != null) {
               pricePerWatt = element.ppw;
            }
         } else {
            // Found the price per watt, it can't be updated after this loop so it's safe to return here.
            return pricePerWatt;
         }
      }

      // Default in case there's no price setting
      return pricePerWatt;
   }

   getTotalLoanAmount(
      totalSolarInvestment: number,
      totalEE: number,
      totalHVAC: number,
      totalBattery: number,
      solarAdd: number,
      hvacAdd: number,
      eeAdd: number
   ) {
      let totalLoanAmount = totalSolarInvestment + totalEE + totalHVAC + totalBattery + solarAdd + hvacAdd + eeAdd;

      // if (this.getFinancier() == 'Cash') {
      //    totalLoanAmount = totalLoanAmount * 0.95;
      // }

      return totalLoanAmount;
   }

   getSystemSize() {
      return this.proposalData.solar[0]?.roofKw;
   }

   getPromoFedTaxCredit(totalLoanAmount: number, hasSolar: boolean) {
      if (!hasSolar) {
         return 0;
      }

      return totalLoanAmount * 0.3;
   }

   getNetSystemInvestment(totalLoanAmount: number, taxCredit: number, taxCreditAsDownpayment: boolean) {
      // Does not want their tax_credit added
      if (taxCreditAsDownpayment == false) {
         taxCredit = 0;
      }

      return totalLoanAmount - taxCredit;
   }

   // getOffset_v3 handles eemod and offset
   getEeMod() {
      return 20;
   }
   getOffset(totalConsumed: number, eeMod: number, estimatedProduction: number) {
      if (totalConsumed == 0) return 0;
      return (totalConsumed * eeMod + estimatedProduction) / totalConsumed;
   }

   costOfDoingNothing() {
      return 0;
   }

   calculate() {
      const janU = this.proposalData.monthlyProjections[0]?.janUsage;
      const febU = this.proposalData.monthlyProjections[0]?.febUsage;
      const marU = this.proposalData.monthlyProjections[0]?.marUsage;
      const aprU = this.proposalData.monthlyProjections[0]?.aprUsage;
      const mayU = this.proposalData.monthlyProjections[0]?.mayUsage;
      const junU = this.proposalData.monthlyProjections[0]?.junUsage;
      const julU = this.proposalData.monthlyProjections[0]?.julUsage;
      const augU = this.proposalData.monthlyProjections[0]?.augUsage;
      const sepU = this.proposalData.monthlyProjections[0]?.sepUsage;
      const octU = this.proposalData.monthlyProjections[0]?.octUsage;
      const novU = this.proposalData.monthlyProjections[0]?.novUsage;
      const decU = this.proposalData.monthlyProjections[0]?.decUsage;

      const janP = this.proposalData.monthlyProjections[0]?.janProduction;
      const febP = this.proposalData.monthlyProjections[0]?.febProduction;
      const marP = this.proposalData.monthlyProjections[0]?.marProduction;
      const aprP = this.proposalData.monthlyProjections[0]?.aprProduction;
      const mayP = this.proposalData.monthlyProjections[0]?.mayProduction;
      const junP = this.proposalData.monthlyProjections[0]?.junProduction;
      const julP = this.proposalData.monthlyProjections[0]?.julProduction;
      const augP = this.proposalData.monthlyProjections[0]?.augProduction;
      const sepP = this.proposalData.monthlyProjections[0]?.sepProduction;
      const octP = this.proposalData.monthlyProjections[0]?.octProduction;
      const novP = this.proposalData.monthlyProjections[0]?.novProduction;
      const decP = this.proposalData.monthlyProjections[0]?.decProduction;

      let totalConsumed = this.getTotalConsumed(janU, febU, marU, aprU, mayU, junU, julU, augU, sepU, octU, novU, decU);
      let eeMod = this.getEeMod();
      let estimatedProduction = this.getEstimatedProduction(
         janP,
         febP,
         marP,
         aprP,
         mayP,
         junP,
         julP,
         augP,
         sepP,
         octP,
         novP,
         decP
      );

      const offset = this.getOffset(totalConsumed, eeMod, estimatedProduction);

      const productsIncluded = this.proposalData.extended.map((e: any) => {
         return e.product.name;
      });

      this.hasSolar = productsIncluded.includes('Solar');
      this.hasEe = productsIncluded.includes('Energy Efficiency');
      this.hasHvac = productsIncluded.includes('HVAC');
      this.hasBattery = productsIncluded.includes('Battery');

      // Finance
      const taxCreditAsDownpayment = false;
      const hasTravelFee = false;
      const showOffsetDisclaimer = false;
      const showCostOfDoingNothing = false;

      const financierId = this.proposalData.option[0].financierId;

      // Solar related
      let systemSize = 0;
      let solarAdditionalCost = 0;
      let checkCost = 0;
      let doNetMeter = 0;
      let dualFuelUpgrade = 0;
      let homeImageUrl = 0;
      let kw = 0;
      let solarNotes = 0;
      let numberOfPanels = 0;
      let solarOverrideOffset = 0;
      let panelSize = 0;
      let solarPriceOverride = 0;
      let trenchingCost = 0;
      let dealerFee = 24;
      // Ee
      let eeAdditionalCost = 0;
      let eeNotes = 0;
      let eeOverrideOffset = 0;
      let eePriceOverride = 0;
      let eeSquareFootage = 0;

      // hvac
      let hvacSelections = [];
      let duelFuelUpgrade = 0;
      let hvacOverridePrice = 0;
      let hvacOffsetOverride = 0;
      let hvacNotes = 0;

      let batterySelections = [];
      let batteryOverridePrice = 0;

      if (this.hasSolar) {
         const solarInfo = this.proposalData.extended.find((e: any) => {
            return e.product?.name == 'Solar';
         });

         solarAdditionalCost = solarInfo.additionalCost;
         checkCost = solarInfo.checkCost;
         doNetMeter = solarInfo.doNetMeter;
         homeImageUrl = solarInfo.homeImageUrl;
         kw = solarInfo.kw;
         solarNotes = solarInfo.notes;
         numberOfPanels = solarInfo.numberOfPanels;
         solarOverrideOffset = solarInfo.overrideOffset;
         panelSize = solarInfo.panelSize;
         solarPriceOverride = solarInfo.priceOverride;
         trenchingCost = solarInfo.trenchingCost;
      }

      if (this.hasEe) {
         const eeInfo = this.proposalData.extended.find((e: any) => {
            return e.product.name == 'Energy Efficiency';
         });

         eeAdditionalCost = eeInfo.additionalCost;
         eeNotes = eeInfo.notes;
         eeOverrideOffset = eeInfo.overrideOffset;
         eePriceOverride = eeInfo.priceOverride;
         eeSquareFootage = eeInfo.squareFootage;

         console.log('Energy Efficiency', eeInfo);
      }

      if (this.hasHvac) {
         const hvacInfo = this.proposalData.extended.filter((e: any) => {
            return e.product.name == 'HVAC';
         });

         hvacSelections = hvacInfo;
         duelFuelUpgrade = hvacInfo[0].dualFuelUpgrade;
         hvacOverridePrice = hvacInfo[0].priceOverride;
         hvacOffsetOverride = hvacInfo[0].overrideOffset;
         hvacNotes = hvacInfo[0].hvacNotes;
      }

      if (this.hasBattery) {
         const batteryInfo = this.proposalData.extended.filter((e: any) => {
            return e.product.name == 'Battery';
         });
         batterySelections = batteryInfo;

         console.log('Battery Info huh', batteryInfo);
         // const formattedBattery = batteryInfo.map((e: any, index: number) => {
         //    return { quantity: e.quantity, displayOrder: index, name: e.product, batteryId: e.batteryId };
         // });

         // batterySelections = formattedBattery;
         // batteryOverridePrice;
      }

      const estimatedConsumption = totalConsumed;
      const reducedConsumptionWithPercentage = estimatedConsumption * (eeMod / 100);
      const reducedEnergy = estimatedConsumption - reducedConsumptionWithPercentage;
      const costOfDoingNothing = this.costOfDoingNothing();
      const downPayment = this.proposalData.option[0].downPayment;

      // Get these and fill them out
      let totalSolarInvestment = 0;
      let totalEE = 0;
      let totalHVAC = 0;
      let totalBattery = 0;
      let solarAdd = 0;
      let hvacAdd = 0;
      let eeAdd = 0;

      const solar = this.proposalData.extended.find((e: any) => {
         return e.systemSize != null;
      });

      // to get systemTypeId for roof or ground, use proposalSystemTypesLookup
      const systemTypeId = '6dd9dc8a-f25e-452b-a632-c78a08d54f6a';
      const stateId = '7e252530-0297-46dd-acf9-d69dffd89573';

      const systemSizeIs = solar?.systemSize;
      const ppw = this.getPPW(systemSizeIs, stateId, systemTypeId, hasTravelFee, this.proposalData.proposalBrackets);
      dealerFee = this.proposalData.proposalSettings[0].universalDealerFee;

      const eePricePerSqFt = eePriceOverride; // from config if price override is empty. proposalProductsConfig

      let hvacQuantity = 0;
      let overrideHvac = 0;

      // Main calculations
      totalSolarInvestment = this.getTotalSolarInvestment(this.hasSolar, systemSizeIs, ppw);
      totalEE = this.getTotalEE(this.hasEe, eeSquareFootage, eePricePerSqFt);
      totalHVAC = this.getTotalHvac(
         this.hasHvac,
         hvacSelections,
         overrideHvac,
         this.proposalData.proposalProductsConfig
      );

      totalBattery = this.getTotalBattery(this.hasBattery, batterySelections, this.proposalData.proposalProductsConfig);
      // solarAdd = this.getSolarAdd();
      // hvacAdd = this.getHVACAdd();
      // eeAdd = this.getEEAdd();

      const totalLoanAmount = this.getTotalLoanAmount(
         totalSolarInvestment,
         totalEE,
         totalHVAC,
         totalBattery,
         solarAdd,
         hvacAdd,
         eeAdd
      );

      const fedTaxCredit = this.getPromoFedTaxCredit(totalLoanAmount, this.hasSolar);
      const netSystemInvestment = this.getNetSystemInvestment(totalLoanAmount, fedTaxCredit, taxCreditAsDownpayment);

      const promotionalMonthlyPayment = Math.round(netSystemInvestment * 0.006936);
      const finalMonthlyPayment = Math.round(netSystemInvestment * 0.0102122);

      const prettyNumber = (ugly: number) => {
         return Math.round(ugly).toLocaleString();
      };

      return {
         systemSize: systemSizeIs,
         panels: numberOfPanels,
         estimatedYearlyProduction: estimatedProduction,
         hasSolar: this.hasSolar,
         hasEe: this.hasEe,
         hasBattery: this.hasBattery,
         hasHvac: this.hasHvac,
         estimatedProductionByMonth: prettyNumber(estimatedProduction),
         estimatedConsumptionByMonth: estimatedConsumption,
         estimatedReducedEnergyByMonth: reducedEnergy,
         costOfDoingNothing: costOfDoingNothing,
         downPayment: prettyNumber(downPayment),
         totalLoanAmount: prettyNumber(totalLoanAmount),
         fedTaxCredit: prettyNumber(fedTaxCredit),
         netSystemInvestment: prettyNumber(netSystemInvestment),
         financierId: financierId,
         promotionalMonthlyPayment: prettyNumber(promotionalMonthlyPayment),
         finalMonthlyPayment: prettyNumber(finalMonthlyPayment),
         offset: offset,
         offsetHuman: Math.round(offset),
      };
   }
};
