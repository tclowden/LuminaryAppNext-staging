'use client';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Button from '../../../../../common/components/button/Button';
import Checkbox from '../../../../../common/components/checkbox/Checkbox';
import Input from '../../../../../common/components/input/Input';
import PageContainer from '../../../../../common/components/page-container/PageContainer';
import { ColumnType } from '../../../../../common/components/table/tableTypes';
import useForm, { YupSchemaObject } from '../../../../../common/hooks/useForm';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { selectPageContext, setPageContext } from '../../../../../store/slices/pageContext';
import { selectUser } from '../../../../../store/slices/user';
import Icon from '../../../../../common/components/Icon';
import Explainer from '../../../../../common/components/explainer/Explainer';
import Grid from '../../../../../common/components/grid/Grid';

import Cookies from 'js-cookie';
import BatteryTable from './(partials)/batteries';
import HvacTable from './(partials)/hvac';
import { Console } from 'console';
import LoadingBackdrop from '../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';

interface Props {}
const ProposalPricingClient = ({}: Props) => {
   const router = useRouter();
   const [solarFile, setSolarFile] = useState<any>();
   const [addonFile, setAddonFile] = useState<any>();
   const [isSaving, setIsSaving] = useState<boolean>(false);

   const contextData = useAppSelector(selectPageContext);

   useEffect(() => {
      const authToken = Cookies.get('LUM_AUTH');
      fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/proposal-settings/price`, {
         method: 'GET',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${authToken}` },
         redirect: 'follow',
      })
         .then((response) => response.json())
         .then((result) => {
            console.log(result);
            if (result.results.length == 0) {
               return;
            }

            if (result.success) {
               console.log(result.results);

               const batteries = JSON.parse(result.results.proposalProductPrices.batteryJson).map((battery: any) => {
                  return {
                     ...battery,
                     actionsConfig: { delete: true },
                  };
               });

               const hvacs = JSON.parse(result.results.proposalProductPrices.hvacJson).map((hvac: any) => {
                  return {
                     ...hvac,
                     actionsConfig: { delete: true },
                  };
               });

               setMultiValues({
                  batteries: batteries,
                  hvacs: hvacs,
                  ee: result.results.proposalProductPrices.eePpw,
               });
            }
         })
         .catch((error) => console.log('error', error));
   }, []);

   const user = useAppSelector(selectUser);

   const handleFileSelect = (e: any) => {
      const selectedFile: any = e.target.files[0];
      const name = e.target.name;
      if (selectedFile !== undefined) {
         const reader = new FileReader();
         reader.addEventListener('load', () => {
            if (name == 'solarConfig') {
               setSolarFile((e: any) => {
                  let eCopy = { ...e };
                  const sResult = String(reader.result);
                  const jsonLines = JSON.stringify(sResult);
                  console.log(jsonLines);
                  return jsonLines;
               });
            }

            if (name == 'addonConfig') {
               setAddonFile((e: any) => {
                  let eCopy = { ...e };
                  const sResult = String(reader.result);
                  const jsonLines = JSON.stringify(sResult);
                  console.log(jsonLines);
                  return jsonLines;
               });
            }
         });

         reader.readAsText(selectedFile);
      }
   };

   const handleSaveProposalSettings = async (e: any, updatedFormValues: any) => {
      setIsSaving(true);
      try {
         let batteries = values.batteries;
         batteries.forEach((e: any) => {
            delete e.actionsConfig;
         });

         let hvacs = values.hvacs;
         hvacs.forEach((e: any) => {
            delete e.actionsConfig;
         });

         const sendData = {
            solarJSON: solarFile,
            addonJSON: addonFile,
            eePrice: values.ee,
            batteryPricing: batteries,
            hvacPricing: hvacs,
         };

         fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/proposal-settings/price`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json', Authorization: `Bearer ${user.token}` },
            body: JSON.stringify(sendData),
            redirect: 'follow',
         })
            .then((response) => response.json())
            .then((result) => {
               console.log(result);
               setIsSaving(false);
            })
            .catch((error) => {
               console.log('error', error);
               setIsSaving(false);
            });
      } catch (error) {
         setIsSaving(false);
         console.error(error);
      }
   };

   const ProposalSettingsValidationSchema: YupSchemaObject<any> = {
      ee: Yup.string().required('Dealer fee is required in order to calculate Proposal totals'),
   };

   const { values, errors, handleSubmit, handleBlur, handleChange, setMultiValues } = useForm({
      initialValues: {},
      validationSchema: ProposalSettingsValidationSchema,
      onSubmit: handleSaveProposalSettings,
   });

   const handleProductChange = (e: any) => {
      handleChange(e);
   };

   const downloadSolarPrices = () => {
      console.log('Download the solar prices');
      const authToken = Cookies.get('LUM_AUTH');
      fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/proposal-settings/ppw`, {
         method: 'GET',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${authToken}` },
         redirect: 'follow',
      })
         .then((response) => response.json())
         .then((result) => {
            // assuming jsonStr is your json string
            // Prepare the file
            const stringCurrent = String(JSONtoCSV(result.data));
            let fileBlob = new Blob([stringCurrent], { type: 'application/json; charset=utf-8' });
            // Create a URL for the file
            let fileURL = URL.createObjectURL(fileBlob);
            // Create a temporary downloadable link
            let tempLink = document.createElement('a');
            tempLink.href = fileURL;
            tempLink.setAttribute('download', 'ppw.csv');
            tempLink.click();
         })
         .catch((error) => console.log('error', error));
   };

   const downloadAddonPrices = () => {
      console.log('Download the addon prices');
      const authToken = Cookies.get('LUM_AUTH');
      fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/proposal-settings/addon`, {
         method: 'GET',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${authToken}` },
         redirect: 'follow',
      })
         .then((response) => response.json())
         .then((result) => {
            // assuming jsonStr is your json string
            // Prepare the file
            const stringCurrent = String(JSONtoCSV(result));
            let fileBlob = new Blob([stringCurrent], { type: 'application/json; charset=utf-8' });
            // Create a URL for the file
            let fileURL = URL.createObjectURL(fileBlob);
            // Create a temporary downloadable link
            let tempLink = document.createElement('a');
            tempLink.href = fileURL;
            tempLink.setAttribute('download', 'addons.csv');
            tempLink.click();
         })
         .catch((error) => console.log('error', error));
   };

   const capitalizeFirstLetter = (target: string) => {
      return target.charAt(0).toUpperCase() + target.slice(1);
   };

   const JSONtoCSV = (jsonArr: any, delimiter = ',') => {
      // Map over the jsonArr and create an array for each object
      let csvArr = jsonArr.map(function (row: any) {
         return Object.values(row);
      });

      // Add the headers to the start of csvArr
      csvArr.unshift(Object.keys(jsonArr[0]));

      // Join each array in csvArr into a string using the delimiter, and then join those strings using newline characters
      let csvStr = csvArr
         .map(function (row: any) {
            return row.join(delimiter);
         })
         .join('\n');

      return csvStr;
   };

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Button color='blue' onClick={handleSubmit} data-test={'submitBtn'}>
                     Save
                  </Button>
                  <Button
                     color='white'
                     onClick={() => {
                        router.back();
                     }}>
                     Cancel
                  </Button>
               </>
            }
            breadcrumbsTitle='Proposal Pricing'>
            <Grid>
               <Explainer description='Pricing specified here will be used to calulate cost and payment in the proposal app.'>
                  <Grid>
                     <span className=''>
                        <div>Solar Prices by state</div>
                        <div className='flex'>
                           <input
                              className='flex w-[225px]'
                              name='solarConfig'
                              type='file'
                              onChange={handleFileSelect}
                           />
                           <Icon
                              className='mt-[5px] cursor-pointer'
                              color='gray'
                              name='DownloadThickBottom'
                              width={22}
                              height={22}
                              onClick={downloadSolarPrices}
                           />
                        </div>
                     </span>
                  </Grid>
                  <Grid>
                     <span className='mt-[35px]'>
                        <div>Addons that add to the price</div>
                        <div className='flex'>
                           <input
                              className='flex w-[225px]'
                              name='addonConfig'
                              type='file'
                              onClick={downloadSolarPrices}
                           />
                           <Icon
                              className='mt-[5px] cursor-pointer'
                              color='gray'
                              name='DownloadThickBottom'
                              width={22}
                              height={22}
                              onClick={downloadAddonPrices}
                           />
                        </div>
                     </span>
                  </Grid>
               </Explainer>

               <Explainer description='Pricing specified here will be used to calulate cost and payment in the proposal app.'>
                  <Grid>
                     <Grid>
                        <h3>Energy Efficiency Pricing</h3>
                        <Input
                           type='number'
                           onChange={handleChange}
                           name='ee'
                           value={typeof values?.ee == 'undefined' ? 0 : values?.ee}
                           label='Energy Efficiency - Price Per Square Foot'
                           required
                        />
                     </Grid>
                  </Grid>
               </Explainer>
               <Explainer description='Pricing specified here will be used to calulate cost and payment in the proposal app.'>
                  <div className='mb-[10px]'>Battery Pricing</div>

                  <BatteryTable values={values} handleChange={handleChange} handleBlur={handleBlur} />

                  <div className='mt-[50px] mb-[10px]'>Hvac Pricing</div>
                  <HvacTable values={values} handleChange={handleChange} handleBlur={handleBlur} />
               </Explainer>
            </Grid>
            <LoadingBackdrop isOpen={isSaving} zIndex={101} />
         </PageContainer>
      </>
   );
};

export default ProposalPricingClient;
