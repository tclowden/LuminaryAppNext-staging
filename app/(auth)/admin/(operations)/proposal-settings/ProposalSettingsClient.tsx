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
import LoadingBackdrop from '../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';

interface Props {}
const ProposalSettingsClient = ({}: Props) => {
   const [productsWithDealerFee, setProposalSupportedProducts] = useState<any>();
   const [currentTax, setCurrentTax] = useState<String>();
   const authToken = Cookies.get('LUM_AUTH');
   // const contextData = useAppSelector(selectPageContext);
   useEffect(() => {
      console.log('something powerful and amazing');

      fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/proposal-settings`, {
         method: 'GET',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${authToken}` },
         cache: 'no-store',
      })
         .then((res) => {
            if (res.ok) {
               return res.json();
            } else console.log('res was not okay...', res);
         })
         .then((res) => {
            console.log(res, 'is res <---');
            res.proposalSupportedProducts.map((e: any) => {
               handleChange({
                  target: {
                     type: 'text',
                     name: e.name,
                     value: e.value,
                  },
               });
            });

            handleChange({
               target: {
                  type: 'text',
                  name: 'dealerFee',
                  value: res.universalDealerFee.universalDealerFee,
               },
            });
         })
         .catch((err) => {
            console.log('err:', err);
         });
   }, []);

   const router = useRouter();
   const [taxFile, setTaxFile] = useState<any>();
   const [isSaving, setIsSaving] = useState<boolean>(false);

   const user = useAppSelector(selectUser);

   const handleFileSelect = (e: any) => {
      const selectedFile: any = e.target.files[0];
      if (selectedFile !== undefined) {
         const reader = new FileReader();
         reader.addEventListener('load', () => {
            setTaxFile((e: any) => {
               let eCopy = { ...e };
               const sResult = String(reader.result);
               const lines = sResult.split(/\r?\n/);
               const headerLessLines = lines.shift();
               console.log('Check if headers are right', headerLessLines);
               const jsonLines = JSON.stringify(lines);
               console.log(jsonLines);
               return jsonLines;
            });
         });

         reader.readAsText(selectedFile);
      }
   };

   const handleSaveProposalSettings = async (e: any, updatedFormValues: any) => {
      setIsSaving(true);
      const saveOb = {
         universalDealerFee: parseFloat(values['dealerFee']),
         dealerFeeSolar: values['solar'],
         dealerFeeEe: values['ee'],
         dealerFeeHvac: values['hvac'] ? values['hvac'] : false,
         dealerFeeBattery: values['battery'] ? values['battery'] : false,
         taxFile: taxFile,
      };

      fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/proposal-settings`, {
         method: 'POST',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${authToken}` },
         body: JSON.stringify(saveOb),
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
   };

   const ProposalSettingsValidationSchema: YupSchemaObject<any> = {
      dealerFee: Yup.string().required('Dealer fee is required in order to calculate Proposal totals'),
      productsUsingDealerFee: Yup.object(),
      taxTable: Yup.mixed(),
   };

   const products = [
      { id: 0, name: 'solar', value: false },
      { id: 1, name: 'ee', value: false },
      { id: 2, name: 'hvac', value: false },
      { id: 3, name: 'battery', value: false },
   ] as any;

   const { values, errors, handleSubmit, handleBlur, handleChange } = useForm({
      initialValues: {},
      validationSchema: ProposalSettingsValidationSchema,
      onSubmit: handleSaveProposalSettings,
   });

   const handleProductChange = (e: any) => {
      handleChange(e);
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

   const downloadCurrentTaxes = () => {
      fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/proposal-settings/tax`, {
         method: 'GET',
         headers: { 'Content-type': 'application/json', Authorization: `Bearer ${authToken}` },
         redirect: 'follow',
      })
         .then((response) => response.json())
         .then((result) => {
            console.log(result);

            result.forEach((e: any) => {
               delete e.id;
               delete e.proposalSettingId;
            });

            console.log('Get current taxes and allow user to download');
            // assuming jsonStr is your json string
            // Prepare the file
            const stringCurrent = String(JSONtoCSV(result));
            let fileBlob = new Blob([stringCurrent], { type: 'application/json; charset=utf-8' });
            // Create a URL for the file
            let fileURL = URL.createObjectURL(fileBlob);
            // Create a temporary downloadable link
            let tempLink = document.createElement('a');
            tempLink.href = fileURL;
            tempLink.setAttribute('download', 'taxesTable.csv');
            tempLink.click();
         })
         .catch((error) => console.log('error', error));
   };

   const capitalizeFirstLetter = (target: string) => {
      return target.charAt(0).toUpperCase() + target.slice(1);
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
            breadcrumbsTitle='Proposal Settings'>
            <Grid>
               <Explainer description='Upload CSV file with all applicable taxes by zip code. NEW FILE MUST MATCH EXISTING FILE FORMAT! Please download original and compare file before uploading new tax table to ensure format is correct.'>
                  <h3>Universal Dealer Fee (percent)</h3>

                  <Input
                     type='number'
                     onChange={handleChange}
                     name='dealerFee'
                     // onBlur={handleBlur}
                     value={typeof values?.dealerFee == 'undefined' ? 0 : values?.dealerFee}
                     label='Universal Dealer Fee (percent)'
                  />

                  <h3>Products with Dealer Fee Included (Universal Dealer Fee will NOT be applied)</h3>

                  {products.map((e: any, index: number) => {
                     return (
                        <Checkbox
                           key={e.name}
                           label={capitalizeFirstLetter(e.name)}
                           checked={!!values[e.name as keyof Object]}
                           onChange={handleChange}
                           name={e.name}
                        />
                     );
                  })}
               </Explainer>

               <Explainer description='What is the Universal Dealer Fee and which products have a dealer fee included? Pricing specified here will be used to calulate cost and payment in the proposal app.'>
                  <Grid>
                     <Grid>
                        <h3>Taxes Table Upload</h3>
                        <span className='flex mt-[20px]'>
                           <input className='w-[225px]' name='taxConfig' type='file' onChange={handleFileSelect} />
                           <Icon
                              className='mt-[5px] cursor-pointer'
                              color='gray'
                              name='DownloadThickBottom'
                              width={22}
                              height={22}
                              onClick={downloadCurrentTaxes}
                           />
                        </span>
                     </Grid>
                  </Grid>
               </Explainer>
            </Grid>
            <LoadingBackdrop isOpen={isSaving} zIndex={101} />
         </PageContainer>
      </>
   );
};

export default ProposalSettingsClient;
