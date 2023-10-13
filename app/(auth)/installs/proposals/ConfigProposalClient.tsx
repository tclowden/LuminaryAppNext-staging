'use client';

import React, { useEffect } from 'react';
import { useState } from 'react';
import EnergyUsage from './(config-partials)/EnergyUsage';
import PaymentFinance from './(config-partials)/PaymentFinance';
import Tabs from '../../../../common/components/tabs/Tabs';
import EnergyEfficiency from './(config-partials)/EnergyEfficiency';
import ReviewAndCreate from './(config-partials)/ReviewAndCreate';
import Solar from './(config-partials)/Solar';
import Products from './(config-partials)/Products';
import Battery from './(config-partials)/Battery';
import Hvac from './(config-partials)/Hvac';
import useForm from '../../../../common/hooks/useForm';
import { ValidationParams } from '../../../../utilities/formValidation/types';
import axios from 'axios';
import Cookies from 'js-cookie';
import Breadcrumbs from '../../../../features/components/breadcrumbs/Breadcrumbs';
import PageProvider from '../../../../providers/PageProvider';
import { useRouter } from 'next/navigation';
import Button from '../../../../common/components/button/Button';
// import Breadcrumbs from '../../../../features/components/breadcrumbs/Breadcrumbs';
import useToaster from '../../../../common/hooks/useToaster';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectUser, updateUser } from '../../../../store/slices/user';

interface Products {}

interface Props {
   proposalId?: string;
   leadId?: string;
   defaultProducts: Products;
   defaultProposalTypes: Array<string>;
   proposalData: any;
   setPreviewUrl: (e: string) => string;
   previewURL: any;
   productConfig: any;
}

const ConfigProposalClient = ({
   proposalId,
   leadId,
   defaultProducts,
   defaultProposalTypes,
   proposalData,
   setPreviewUrl,
   previewURL,
   productConfig,
}: Props) => {
   const router = useRouter();
   const makeToast = useToaster();
   const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
   const [tabs, setTabs] = useState([
      { name: 'Products' },
      { name: 'Energy Usage' },
      { name: 'Payment' },
      { name: 'Review' },
   ]);
   const [isNew, setIsNew] = useState<boolean>(true);
   const user = useAppSelector(selectUser);

   // Editing an existing proposal, so filling out the form
   useEffect(() => {
      if (proposalId === null) {
         setIsNew(true);
      } else {
         setIsNew(false);
      }

      console.log('Config proposal client use effect: proposal data');
      console.log(proposalData);
      console.log(JSON.stringify(proposalData));

      if (Object.keys(proposalData).length == 0) {
         return;
      }
      const quickHandle = (name: string, value: any) => {
         handleChange({ target: { type: 'text', value: value, name: name } });
      };

      const productsIncluded = proposalData.extended.map((e: any) => {
         return e.product.name;
      });

      const hasSolar = productsIncluded.includes('Solar');
      const hasEe = productsIncluded.includes('Energy Efficiency');
      const hasHvac = productsIncluded.includes('HVAC');
      const hasBattery = productsIncluded.includes('Battery');

      if (hasSolar) quickHandle('Solar', true);
      if (hasEe) quickHandle('Energy Efficiency', true);
      if (hasHvac) quickHandle('HVAC', true);
      if (hasBattery) quickHandle('Battery', true);

      quickHandle('name', proposalData.option[0].name);

      let proposalType = proposalData.option[0].proposalType.name;
      quickHandle('proposalType', proposalType.charAt(0).toUpperCase() + proposalType.slice(1));

      // Energy usage
      quickHandle('stateId', proposalData.option[0]?.lead.stateId);
      quickHandle('utilityCompanyId', proposalData.option[0].utilityCompanyId);
      quickHandle('utilityCompany', proposalData.option[0].utility);
      quickHandle('janUsage', proposalData.monthlyProjections[0]?.janUsage);
      quickHandle('febUsage', proposalData.monthlyProjections[0]?.febUsage);
      quickHandle('marUsage', proposalData.monthlyProjections[0]?.marUsage);
      quickHandle('aprUsage', proposalData.monthlyProjections[0]?.aprUsage);
      quickHandle('mayUsage', proposalData.monthlyProjections[0]?.mayUsage);
      quickHandle('junUsage', proposalData.monthlyProjections[0]?.junUsage);
      quickHandle('julUsage', proposalData.monthlyProjections[0]?.julUsage);
      quickHandle('augUsage', proposalData.monthlyProjections[0]?.augUsage);
      quickHandle('sepUsage', proposalData.monthlyProjections[0]?.sepUsage);
      quickHandle('octUsage', proposalData.monthlyProjections[0]?.octUsage);
      quickHandle('novUsage', proposalData.monthlyProjections[0]?.novUsage);
      quickHandle('decUsage', proposalData.monthlyProjections[0]?.decUsage);
      quickHandle('janBill', proposalData.monthlyProjections[0]?.janBill);
      quickHandle('febBill', proposalData.monthlyProjections[0]?.febBill);
      quickHandle('marBill', proposalData.monthlyProjections[0]?.marBill);
      quickHandle('aprBill', proposalData.monthlyProjections[0]?.aprBill);
      quickHandle('mayBill', proposalData.monthlyProjections[0]?.mayBill);
      quickHandle('junBill', proposalData.monthlyProjections[0]?.junBill);
      quickHandle('julBill', proposalData.monthlyProjections[0]?.julBill);
      quickHandle('augBill', proposalData.monthlyProjections[0]?.augBill);
      quickHandle('sepBill', proposalData.monthlyProjections[0]?.sepBill);
      quickHandle('octBill', proposalData.monthlyProjections[0]?.octBill);
      quickHandle('novBill', proposalData.monthlyProjections[0]?.novBill);
      quickHandle('decBill', proposalData.monthlyProjections[0]?.decBill);

      // Financing
      quickHandle('financierId', proposalData.option[0].financierId);
      quickHandle('downPayment', proposalData.option[0]?.downPayment);
      quickHandle('taxCreditAsDownpayment', proposalData.option[0]?.taxCreditAsDownPayment);

      // quickHandle('savingsOptionDisplay', proposalData.option[0]?.savingsOptionDisplay?.name);
      quickHandle('overrideDealerFee', proposalData.option[0]?.overrideDealerFee);
      quickHandle('includeTravelFees', proposalData.option[0]?.includeTravelFee);
      quickHandle('offsetDisclaimer', proposalData.option[0]?.offsetDisclaimer);
      quickHandle('savingsOptionDisplay', proposalData.option[0].savingsOptionDisplay.name);

      // Solar
      if (hasSolar) {
         const solar = proposalData.extended.find((e: any) => {
            return e.product?.name == 'Solar';
         });

         quickHandle('roofKw', solar?.systemSize);
         quickHandle('panelSize', solar?.panelSize);
         quickHandle('numberOfPanels', solar?.numberOfPanels);

         const systemTypeInfo = { id: '4', type: solar?.systemType?.name, value: solar?.systemType?.name };
         quickHandle('systemType', systemTypeInfo);

         quickHandle('janProduction', proposalData.monthlyProjections[0]?.janProduction);
         quickHandle('febProduction', proposalData.monthlyProjections[0]?.febProduction);
         quickHandle('marProduction', proposalData.monthlyProjections[0]?.marProduction);
         quickHandle('aprProduction', proposalData.monthlyProjections[0]?.aprProduction);
         quickHandle('mayProduction', proposalData.monthlyProjections[0]?.mayProduction);
         quickHandle('junProduction', proposalData.monthlyProjections[0]?.junProduction);
         quickHandle('julProduction', proposalData.monthlyProjections[0]?.julProduction);
         quickHandle('augProduction', proposalData.monthlyProjections[0]?.augProduction);
         quickHandle('sepProduction', proposalData.monthlyProjections[0]?.sepProduction);
         quickHandle('octProduction', proposalData.monthlyProjections[0]?.octProduction);
         quickHandle('novProduction', proposalData.monthlyProjections[0]?.novProduction);
         quickHandle('decProduction', proposalData.monthlyProjections[0]?.decProduction);
         quickHandle('solarAdditionalCost', solar?.additionalCost);
         quickHandle('checkCost', solar?.checkCost);
         quickHandle('trenchingCost', solar?.trenchingCost);
         quickHandle('solarPriceOverride', solar?.priceOverride);
         quickHandle('solarNotes', solar?.notes);
      }

      // Ee
      if (hasEe) {
         const ee = proposalData.extended.find((e: any) => {
            return e.product?.name == 'Energy Efficiency';
         });
         quickHandle('eeSquareFootage', ee?.squareFootage);
         quickHandle('eeOverrideOffset', ee?.overrideOffset);
         quickHandle('eeOverridePrice', ee?.priceOverride);
         quickHandle('eeAdditionalCost', ee?.additionalCost);
         quickHandle('eeNotes', ee?.notes);
      }

      // Hvac
      if (hasHvac) {
         const hvac = proposalData.extended.filter((e: any) => {
            return e.product?.name == 'HVAC';
         });

         let hvacSelected: any;
         hvacSelected = [];
         hvac.forEach((e: any, i: number) => {
            const hvacProduct = proposalData.proposalProductsConfig.find((configs: any) => {
               return e.proposalProductConfigId == configs.id;
            });

            hvacSelected.push({
               tempId: crypto.randomUUID(),
               displayOrder: i,
               quantity: e.quanity,
               hvacId: e.proposalProductConfigId,
               name: hvacProduct,
            });
         });

         quickHandle('hvac', hvacSelected);
         quickHandle('hvacOverridePrice', hvac[0]?.priceOverride);
         quickHandle('hvacOverrideOffset', hvac[0]?.overrideOffset);
         quickHandle('hvacAdditionalCost', hvac[0]?.additionalCost);
         quickHandle('hvacNotes', hvac[0]?.notes);
         quickHandle('dualFuelUpgrade', hvac[0]?.dualFuelUpgrade);
         quickHandle('HVACDisplay', hvac[0]?.showDetailsSection);
      }

      // Battery
      if (hasBattery) {
         const battery = proposalData.extended.filter((e: any) => {
            return e.product?.name == 'Battery';
         });

         let batterySelected: any;
         batterySelected = [];
         battery.forEach((e: any, i: number) => {
            const batteryProduct = proposalData.proposalProductsConfig.find((configs: any) => {
               return e.proposalProductConfigId == configs.id;
            });

            batterySelected.push({
               tempId: crypto.randomUUID(),
               displayOrder: i,
               quantity: e.quanity,
               hvacId: e.proposalProductConfigId,
               name: batteryProduct,
            });
         });
         quickHandle('battery', batterySelected);
         quickHandle('batteryOverridePrice', battery[0]?.priceOverride);
      }

      setTabs((tabsCopy: any) => {
         // Add in the product
         let tc = [{ name: 'Products' }, { name: 'Energy Usage' }, { name: 'Payment' }];

         // Add in products one at a time in order, plus the one we've got.
         if (hasSolar) tc.push({ name: 'Solar' });
         if (hasEe) tc.push({ name: 'EE' });
         if (hasHvac) tc.push({ name: 'HVAC' });
         if (hasBattery) tc.push({ name: 'Battery' });

         tc.push({ name: 'Review' });

         return tc;
      });
   }, []);

   const handleFormSubmit = (e: any) => {
      console.log('handle form submit!!');
      console.log(values);
      console.log(JSON.stringify(values));
      let copyFormData = { ...values };

      // Get Products organized
      let productsToSave = [];
      if (values.solar) productsToSave.push({ productType: 'solar', display: true });
      if (values.hvac) productsToSave.push({ productType: 'hvac', display: true });
      if (values.ee) productsToSave.push({ productType: 'ee', display: true });
      if (values.battery) productsToSave.push({ productType: 'battery', display: true });
      copyFormData.productsToSave = productsToSave;

      // Attach leadId
      copyFormData.leadId = leadId;
      copyFormData.tech = user.id;

      // Fill in Meta data, like proposal tech saving or client if Updating
      copyFormData.homeImageUrl = previewURL !== null ? previewURL : '';

      // Batteries
      const batteriesToSave = [];
      if (copyFormData.battery)
         batteriesToSave.push({ batteryType: copyFormData.battery.id, unitAmount: copyFormData.batteryQuantity });
      copyFormData.batteriesToSave = batteriesToSave;

      // Convert Floats
      const floatList = [
         'panelSize',
         'numberOfPanels',
         'janProduction',
         'febProduction',
         'marProduction',
         'aprProduction',
         'mayProduction',
         'junProduction',
         'julProduction',
         'augProduction',
         'sepProduction',
         'octProduction',
         'novProduction',
         'decProduction',
         'solarAdditionalCost',
         'checkCost',
         'trenchingCost',
         'solarPriceOverride',
         'janUsage',
         'febUsage',
         'marUsage',
         'aprUsage',
         'mayUsage',
         'junUsage',
         'julUsage',
         'augUsage',
         'sepUsage',
         'octUsage',
         'novUsage',
         'decUsage',
         'janBill',
         'febBill',
         'marBill',
         'aprBill',
         'mayBill',
         'junBill',
         'julBill',
         'augBill',
         'sepBill',
         'octBill',
         'novBill',
         'decBill',
         'additionalCost',
      ];
      Object.keys(copyFormData).forEach((e) => {
         if (floatList.includes(e)) copyFormData[e] = parseFloat(copyFormData[e]);
      });

      // Object reads and defaults for Multi selects
      copyFormData.systemType = copyFormData.systemType?.value ? copyFormData.systemType?.value : 'Ground Mount';
      copyFormData.state = copyFormData.state ? copyFormData.state : 'Arkansas';
      copyFormData.utilityCompany = copyFormData.utilityCompany?.value ? copyFormData.utilityCompany : 'None';
      copyFormData.financier = copyFormData?.financier;
      copyFormData.hvacUnit = copyFormData.hvacUnit?.value ? copyFormData.hvacUnit?.value : 'None';
      copyFormData.homeImageUrl = previewURL;

      if (isNew) {
         const userAuthToken = Cookies.get('LUM_AUTH');
         axios
            .post(`/api/v2/proposal-options`, copyFormData, {
               headers: { Authorization: `Bearer ${userAuthToken}` },
            })
            .then((res: any) => {
               if (res.data.success) {
                  const newProposalId = res.data.id;
                  makeToast(true, 'Proposal Created');
                  router.push(`/installs/proposals/${newProposalId}`);
               } else {
                  makeToast(false, 'Error Saving');
                  console.log('Invalid Json, or failure');
               }
            })
            .catch((err: any) => {
               console.log('err:', err);
               makeToast(false, 'Error Saving');
            });
      }

      const update = !isNew;
      if (update) {
         const userAuthToken = Cookies.get('LUM_AUTH');
         axios
            .post(`/api/v2/proposal-options/${proposalId}`, copyFormData, {
               headers: { Authorization: `Bearer ${userAuthToken}` },
            })
            .then((res: any) => {
               if (res.data.success) {
                  makeToast(true, 'Proposal Updated');
                  const newProposalId = res.data.id;
                  router.push(`/installs/proposals/${newProposalId}`);
               } else {
                  console.log('Invalid Json, or failure');
                  makeToast(false, 'Error Saving');
               }
            })
            .catch((err: any) => {
               console.log('err:', err);
               makeToast(false, 'Error Saving');
            });
      }
   };

   const autoFill = () => {
      setMultiValues({
         Solar: true,
         'Energy Efficiency': true,
         HVAC: true,
         Battery: true,
         proposalType: 'Residential',
         utilityCompany: {
            id: 'b8294e6c-ec84-4587-979e-70b739bdef75',
            name: 'C&L Electric',
            specialNotes: '"Full benefit" Net Metering ',
            netMeter: true,
            connectionFee: '25.00',
            additionalCost: '0.00',
            oldId: 12,
            createdAt: '2023-08-22T02:35:34.423Z',
            updatedAt: '2023-08-22T02:35:34.423Z',
            deletedAt: null,
            stateId: 'd55c4e1c-cac4-439d-87a9-f2dd6a8e961b',
            netMeteringTypeId: '88613fc6-b824-40d1-8b8b-9ac0ee947267',
            state: {
               id: 'd55c4e1c-cac4-439d-87a9-f2dd6a8e961b',
               name: 'Arkansas',
               abbreviation: 'AR',
               supported: false,
               oldId: null,
               createdAt: '2023-08-22T02:35:34.408Z',
               updatedAt: '2023-08-22T02:35:34.408Z',
               deletedAt: null,
            },
            stateName: 'Arkansas',
            value: 'C&L Electric',
         },
         utilityCompanyId: 'b8294e6c-ec84-4587-979e-70b739bdef75',
         janUsage: null,
         febUsage: null,
         marUsage: null,
         aprUsage: null,
         mayUsage: null,
         junUsage: null,
         julUsage: null,
         augUsage: null,
         sepUsage: null,
         octUsage: null,
         novUsage: null,
         decUsage: null,
         janBill: null,
         febBill: null,
         marBill: null,
         aprBill: null,
         mayBill: null,
         junBill: null,
         julBill: null,
         augBill: null,
         sepBill: null,
         octBill: null,
         novBill: null,
         decBill: null,
         financierId: '024132d5-1d56-4c18-9f2e-7f3d416361b3',
         downPayment: '1500',
         taxCreditAsDownpayment: true,
         includeTravelFees: true,
         offsetDisclaimer: true,
         savingsOptionDisplay: '25 Year Savings Breakdown',
         roofKw: '5.6',
         panelSize: 320,
         numberOfPanels: 100,
         systemType: 'roof',
         janProduction: 1400,
         febProduction: 1400,
         marProduction: 1400,
         aprProduction: 1400,
         mayProduction: 1400,
         junProduction: 1400,
         julProduction: 1400,
         augProduction: 1400,
         sepProduction: 1400,
         octProduction: 1400,
         novProduction: 1400,
         decProduction: 1400,
         solarAdditionalCost: 100,
         checkCost: 200,
         trenchingCost: 300,
         solarPriceOverride: 8,
         solarNotes: 'Solar filled out',
         eeSquareFootage: '4500',
         eeOverrideOffset: '20',
         eeOverridePrice: '2.8',
         eeAdditionalCost: '100',
         eeNotes: 'EE notes!',
         hvac: [
            {
               tempId: '5fb1c025-d05f-43b2-b8d8-c9f034f67dc0',
               quantity: '1',
               displayOrder: 0,
               name: {
                  id: '0aafb915-07f9-4f4b-bfc1-11cad52c97bb',
                  name: 'Gold 1.5-2 Ton',
                  offsetPercentage: null,
                  price: 14237,
                  pricePerSquareFt: null,
                  oldId: 7,
                  createdAt: '2023-08-22T04:24:03.045Z',
                  updatedAt: '2023-08-22T04:24:03.045Z',
                  deletedAt: null,
                  productId: '1766f3fc-4822-4426-81f8-d61ca6d4866c',
                  product: {
                     id: '1766f3fc-4822-4426-81f8-d61ca6d4866c',
                     name: 'HVAC',
                     description: "Product in legacy luminary doesn't have a description...",
                     iconName: 'HvacPm',
                     iconColor: 'yellow',
                     primary: true,
                     oldId: 8,
                     createdAt: '2023-08-22T04:23:42.854Z',
                     updatedAt: '2023-08-22T04:23:42.854Z',
                     deletedAt: null,
                  },
               },
               hvacId: '0aafb915-07f9-4f4b-bfc1-11cad52c97bb',
            },
            {
               tempId: '1b850244-0953-4ddb-97b9-1689e695c10e',
               quantity: '2',
               displayOrder: 1,
               name: {
                  id: '30df7056-d45b-4e5c-82df-97610290a646',
                  name: 'Platinum 5 Ton',
                  offsetPercentage: null,
                  price: 20393,
                  pricePerSquareFt: null,
                  oldId: 4,
                  createdAt: '2023-08-22T04:24:03.043Z',
                  updatedAt: '2023-08-22T04:24:03.043Z',
                  deletedAt: null,
                  productId: '1766f3fc-4822-4426-81f8-d61ca6d4866c',
                  product: {
                     id: '1766f3fc-4822-4426-81f8-d61ca6d4866c',
                     name: 'HVAC',
                     description: "Product in legacy luminary doesn't have a description...",
                     iconName: 'HvacPm',
                     iconColor: 'yellow',
                     primary: true,
                     oldId: 8,
                     createdAt: '2023-08-22T04:23:42.854Z',
                     updatedAt: '2023-08-22T04:23:42.854Z',
                     deletedAt: null,
                  },
               },
               hvacId: '30df7056-d45b-4e5c-82df-97610290a646',
            },
         ],
         dualFuelUpgrade: true,
         hvacOverridePrice: '10000',
         hvacAdditionalCost: '200',
         hvacOverrideOffset: '10',
         hvacNotes: 'HVAC Notes',
         battery: [
            {
               tempId: '3e41cfd1-57c9-4679-a615-0c7a17b77b4e',
               quantity: '1',
               displayOrder: 0,
               name: {
                  id: 'ac89dea4-1a5c-430f-8b52-7d1a29f9099c',
                  name: 'Enphase 20kw',
                  offsetPercentage: null,
                  price: 35125,
                  pricePerSquareFt: null,
                  oldId: 8,
                  createdAt: '2023-08-22T04:24:03.033Z',
                  updatedAt: '2023-08-22T04:24:03.033Z',
                  deletedAt: null,
                  productId: '49b3b884-cd7f-4886-a0da-f9b2258e1bdc',
                  product: {
                     id: '49b3b884-cd7f-4886-a0da-f9b2258e1bdc',
                     name: 'Battery',
                     description: "Product in legacy luminary doesn't have a description...",
                     iconName: 'Battery',
                     iconColor: 'purple',
                     primary: false,
                     oldId: 9,
                     createdAt: '2023-08-22T04:23:42.855Z',
                     updatedAt: '2023-08-22T04:23:42.855Z',
                     deletedAt: null,
                  },
               },
               batteryId: 'ac89dea4-1a5c-430f-8b52-7d1a29f9099c',
            },
            {
               tempId: 'beb5514d-db35-4f5e-bb6c-7fff0775ef23',
               quantity: '2',
               displayOrder: 1,
               name: {
                  id: '9d7f615a-bc27-44d4-9253-7ec5119f3770',
                  name: 'Tesla Powerwall 2',
                  offsetPercentage: null,
                  price: 22800,
                  pricePerSquareFt: null,
                  oldId: null,
                  createdAt: '2023-08-22T04:23:59.491Z',
                  updatedAt: '2023-08-22T04:23:59.491Z',
                  deletedAt: null,
                  productId: '49b3b884-cd7f-4886-a0da-f9b2258e1bdc',
                  product: {
                     id: '49b3b884-cd7f-4886-a0da-f9b2258e1bdc',
                     name: 'Battery',
                     description: "Product in legacy luminary doesn't have a description...",
                     iconName: 'Battery',
                     iconColor: 'purple',
                     primary: false,
                     oldId: 9,
                     createdAt: '2023-08-22T04:23:42.855Z',
                     updatedAt: '2023-08-22T04:23:42.855Z',
                     deletedAt: null,
                  },
               },
               batteryId: '9d7f615a-bc27-44d4-9253-7ec5119f3770',
            },
         ],
         batteryOverridePrice: '5000',
         name: 'Test Full Proposal Yipe!',
         productsToSave: [
            { productType: 'hvac', display: true },
            { productType: 'battery', display: true },
         ],
         leadId: '0d8c3d57-a3c2-4739-8eef-6a2daeb647d2',
         tech: 'bc227b9a-3f12-414d-aa98-cb1abbeac88c',
         homeImageUrl: '',
         batteriesToSave: [{}],
         state: 'Arkansas',
         hvacUnit: 'None',
      });
   };

   const {
      handleSubmit,
      handleChange,
      setMultiValues,
      handleBlur,
      setErrorAfterSubmit,
      values,
      errors,
      errorAfterSubmit,
   } = useForm({
      initialValues: {},
      // validationSchema: ProposalFormValidationSchema,
      onSubmit: handleFormSubmit,
   });

   const pageProviderConfig = {
      permissions: [],
      fallbackRoute: '/login',
   };

   const next = () => {
      setActiveTabIndex((e) => {
         if (activeTabIndex == tabs.length) return 0;
         return activeTabIndex + 1;
      });
   };

   return (
      <PageProvider>
         <div className='flex flex-col gap-4'>
            <div className='flex flex-row items-start gap-4'>
               <Tabs tabs={tabs} activeTabIndex={activeTabIndex} setActiveTabIndex={setActiveTabIndex} />
               <Button onClick={next}>Next</Button>
               {/* <Button onClick={autoFill}>Auto Fill (Testing)</Button> */}
            </div>

            <form onSubmit={handleSubmit}>
               {tabs[activeTabIndex]?.name == 'Products' && (
                  <Products
                     includedProducts={defaultProducts}
                     proposalTypes={defaultProposalTypes}
                     handleChange={handleChange}
                     formData={values}
                     tabs={tabs}
                     setTabs={setTabs}
                  />
               )}
               {tabs[activeTabIndex]?.name == 'Energy Usage' && (
                  <EnergyUsage handleChange={handleChange} formData={values} />
               )}
               {tabs[activeTabIndex]?.name == 'Payment' && (
                  <PaymentFinance handleChange={handleChange} formData={values} />
               )}
               {tabs[activeTabIndex]?.name == 'Solar' && (
                  <Solar
                     handleChange={handleChange}
                     formData={values}
                     previewURL={previewURL}
                     setPreviewUrl={setPreviewUrl}
                     leadId={leadId}
                     proposalData={proposalData}
                  />
               )}
               {tabs[activeTabIndex]?.name == 'EE' && (
                  <EnergyEfficiency handleChange={handleChange} formData={values} />
               )}
               {tabs[activeTabIndex]?.name == 'HVAC' && (
                  <Hvac
                     handleChange={handleChange}
                     formData={values}
                     setMultiValues={setMultiValues}
                     productConfig={productConfig}
                  />
               )}
               {tabs[activeTabIndex]?.name == 'Battery' && (
                  <Battery
                     handleChange={handleChange}
                     formData={values}
                     setMultiValues={setMultiValues}
                     productConfig={productConfig}
                  />
               )}
               {tabs[activeTabIndex]?.name == 'Review' && (
                  <ReviewAndCreate
                     handleChange={handleChange}
                     formData={values}
                     handleSubmit={handleFormSubmit}
                     isNew={isNew}
                  />
               )}
            </form>
         </div>
      </PageProvider>
   );
};

export default ConfigProposalClient;
