'use client';
import React, { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import html2pdf from 'html2pdf.js';
import axios from 'axios';
import Design from './(view-partials)/Design';
import Production from './(view-partials)/Production';
import Example from './(view-partials)/Example';
import Reviews from './(view-partials)/Reviews';
import Totals from './(view-partials)/Totals';
import Cover from './(view-partials)/Cover';
import Edit from './(view-partials)/Edit';
import Hvac from './(view-partials)/Hvac';
import PageContainer from '../../../../common/components/page-container/PageContainer';
import Grid from '../../../../common/components/grid/Grid';
import Button from '../../../../common/components/button/Button';
import { Calculations } from './calculation-engine/Calculations';

// import shineAirLogoDarkColor from '../../../../public/assets/proposal/logos/shine-air-logo-dark-color.png';
// import Button from '../../../../common/components/button/Button';

interface Props {
   proposalId: any;
   leadId: any;
}

const ViewProposalClient = ({ proposalId, leadId }: Props) => {
   const [proposalInfo, setProposalInfo] = useState({});
   const [coverInfo, setCoverInfo] = useState({});
   const [designInfo, setDesignInfo] = useState({});
   const [production, setProduction] = useState({});
   const [totals, setTotals] = useState({});
   const [show, setShow] = useState(false);
   const [previewURL, setPreviewUrl] = useState('');
   const [showHvac, setShowHvac] = useState(false);
   const printRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      if (proposalId !== null) {
         getAndSetProposalValues();
      } else {
         setShow(true);
      }
   }, []);

   const getAndSetProposalValues = () => {
      const userAuthToken = Cookies.get('LUM_AUTH');
      axios({
         method: 'get',
         url: `/api/v2/proposal-options/${proposalId}`,
         headers: {
            Authorization: `Bearer ${userAuthToken}`,
         },
      })
         .then(function (response) {
            // Proposal Option information
            const optionInfo = response.data.data;

            const proposalCalculator = new Calculations(optionInfo);
            const calculated = proposalCalculator.calculate();

            const percentageToFill = calculated.offset / 100;
            const radius = 12.91549431;
            const circumference = 2 * Math.PI * radius;
            const circleGraph = circumference * percentageToFill;

            const solarData = optionInfo.extended.find((e: any) => {
               return e.product?.name == 'Solar';
            });

            const solarProduction = [
               optionInfo.monthlyProjections[0]?.janProduction,
               optionInfo.monthlyProjections[0]?.febProduction,
               optionInfo.monthlyProjections[0]?.marProduction,
               optionInfo.monthlyProjections[0]?.aprProduction,
               optionInfo.monthlyProjections[0]?.mayProduction,
               optionInfo.monthlyProjections[0]?.junProduction,
               optionInfo.monthlyProjections[0]?.julProduction,
               optionInfo.monthlyProjections[0]?.augProduction,
               optionInfo.monthlyProjections[0]?.sepProduction,
               optionInfo.monthlyProjections[0]?.octProduction,
               optionInfo.monthlyProjections[0]?.novProduction,
               optionInfo.monthlyProjections[0]?.decProduction,
            ];
            const solarUsage = [
               optionInfo.monthlyProjections[0]?.janUsage,
               optionInfo.monthlyProjections[0]?.febUsage,
               optionInfo.monthlyProjections[0]?.marUsage,
               optionInfo.monthlyProjections[0]?.aprUsage,
               optionInfo.monthlyProjections[0]?.mayUsage,
               optionInfo.monthlyProjections[0]?.junUsage,
               optionInfo.monthlyProjections[0]?.julUsage,
               optionInfo.monthlyProjections[0]?.augUsage,
               optionInfo.monthlyProjections[0]?.sepUsage,
               optionInfo.monthlyProjections[0]?.octUsage,
               optionInfo.monthlyProjections[0]?.novUsage,
               optionInfo.monthlyProjections[0]?.decUsage,
            ];

            const hvacInfo = optionInfo.extended.find((e: any) => e.product.name == 'HVAC');
            setShowHvac(() => hvacInfo?.showDetailsSection);

            setProposalInfo(optionInfo);

            setPreviewUrl(solarData?.homeImageUrl);

            setCoverInfo(() => {
               return {
                  fullName: optionInfo.option[0].lead?.fullName,
                  street_address: optionInfo.option[0].lead?.fullAddress,
                  city: optionInfo.option[0].lead?.city,
                  state: optionInfo.option[0].lead?.state,
                  zip_code: optionInfo.option[0].lead?.zipCode,
                  email_address: optionInfo.option[0].lead.emailAddress,
                  phone_number: optionInfo.option[0].lead.phoneNumberPretty,
               };
            });
            setDesignInfo(() => {
               return {
                  displaySystemSize: solarData?.systemSize,
                  numberOfPanels: calculated?.panels,
                  hasBattery: calculated?.hasBattery,
                  hasHvac: calculated?.hasHvac,
                  offsetHuman: calculated?.offsetHuman,
                  circleGraph: circleGraph,
                  circumference: circumference,
               };
            });
            setProduction(() => {
               return {
                  production: solarProduction,
                  usage: solarUsage,
                  offset: calculated.offset,
               };
            });
            setTotals(() => {
               return {
                  downPayment: calculated?.downPayment,
                  fedTaxCredit: calculated?.fedTaxCredit,
                  netSystemInvestment: calculated?.netSystemInvestment,
                  totalLoanAmount: calculated?.totalLoanAmount,
                  selectedFinancier: optionInfo.option[0].financierId,
                  promotionalMonthlyPayment: calculated?.promotionalMonthlyPayment,
                  finalMonthlyPayment: calculated?.finalMonthlyPayment,
               };
            });
         })
         .catch(function (error) {
            console.log(error);
         });
   };

   const downloadPdf = () => {
      console.log('Download!');

      const options = {
         margin: 0,
         filename: 'Proposal.pdf',
         image: { type: 'jpeg', quality: 1 },
         html2canvas: { scale: 1 },
         jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait', precision: 1 },
      };
      try {
         html2pdf().from(printRef.current).set(options).save();
      } catch (error) {
         console.log(error);
      }
   };

   const style = `
      img {
         display: inline-block;
      }
   `;

   return (
      <PageContainer
         breadcrumbsChildren={
            <>
               <Button color='gray:250' onClick={() => downloadPdf()}>
                  Download
               </Button>
               <Button color='blue' onClick={() => setShow(true)}>
                  Edit
               </Button>
            </>
         }>
         <div ref={printRef}>
            <Grid className=''>
               <Edit
                  showEditModal={show}
                  setShow={() => {
                     setShow((prevState: boolean) => !prevState);
                  }}
                  proposalId={proposalId}
                  leadId={leadId}
                  proposalData={proposalInfo}
                  setPreviewUrl={setPreviewUrl}
                  previewURL={previewURL}
               />

               <Cover coverInfo={coverInfo} />

               <Design designInfo={designInfo} previewURL={previewURL} totals={totals} />

               <Production production={production} />

               {showHvac && <Hvac proposalInfo={proposalInfo} />}

               <Totals totals={totals} />

               <Example />

               <Reviews />
            </Grid>
         </div>
         <style>{style}</style>
      </PageContainer>
   );
};

export default ViewProposalClient;
