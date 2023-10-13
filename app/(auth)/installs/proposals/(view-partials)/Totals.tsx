'use client';
import React, { useEffect, useState } from 'react';
import shineHomeLogo1Green from '../../../../../public/assets/proposal/logos/shine-home-logo-1-green.png';
import solarHouseBlue from '../../../../../public/assets/proposal/images/solar-house-blue.jpg';
import Image from 'next/image';
import shineAirLogo from '../../../../../public/assets/proposal/logos/shine-air-logo.png';
import ssOrangWhiteLogo from '../../../../../public/assets/proposal/logos/ss-orang-white-logo.png';
import SavingsGraph from './SavingsGraph';
import DropDown from '../../../../../common/components/drop-down/DropDown';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { selectUser } from '../../../../../store/slices/user';

interface Props {
   totals: any;
}

const Totals = ({ totals }: Props) => {
   const [financiers, setFinanciers] = useState([]);
   const [selectedPreviewFinancier, setSelectedPreviewFinancier] = useState({});
   const user = useAppSelector(selectUser);

   /*
      Seems totals isn't available right as we load.
      So I'm listening to changes for totals to reach out and get the financier list.
   */
   useEffect(() => {
      console.log('totals');
      console.log(totals);

      const userAuthToken = user.token;

      axios({
         method: 'get',
         url: `/api/v2/financiers`,
         headers: {
            Authorization: `Bearer ${userAuthToken}`,
         },
      })
         .then(function (response) {
            response.data.map((e: any) => {
               e.value = e.name;
            });

            setFinanciers(response.data);
         })
         .catch(function (error) {
            console.log(error);
         });
   }, [totals]);

   /*
      When the Financier list comes in, we target the one we've got selected.
   */
   useEffect(() => {
      const selectedFinancier = financiers.find((i: any) => i.id == totals.selectedFinancier);
      setSelectedPreviewFinancier(selectedFinancier || []);
   }, [financiers, totals]);

   return (
      <div
         className='flex
          flex-col
          font-[100]
          text-lum-white
          text-[20px]
          w-full
          max-h-[1030px]
          min-h-[1030px]
          bg-no-repeat
          bg-center
          bg-cover
          relative
          bg-white
          border-b-4
        '
         style={{ backgroundImage: `url('${solarHouseBlue.src}')`, pageBreakAfter: 'always' }}>
         <div
            className='flex
            flex-col
            font-[100]
            text-[20px]
            w-full
            h-[960px]
            bg-no-repeat
            bg-center
            bg-cover
            relative
            bg-white'
            style={{ backgroundImage: `url('${solarHouseBlue.src}')` }}>
            <div className='flex flex-row w-full justify-items-center items-center mt-[30px]'>
               <Image className='w-[200px] m-[60px]' src={ssOrangWhiteLogo} alt='Shine Solar Logo' />

               <Image className='w-[200px] m-[60px]' src={shineHomeLogo1Green} alt='Shine Home Logo' />

               <Image className='w-[200px] m-[60px]' src={shineAirLogo} alt='Shine Air Logo' />
            </div>
            <div
               className='w-[768px]
                  min-h-[500px]
                  flex
                  self-center
                  mt-[25px]
                  lum-primary
                  text-[20px]
                  text-[#425563]
                  rounded
                '
               style={{ backgroundColor: '#FFF' }}>
               <div className='w-1/2'>
                  <div className='mt-[20px] mb-[25px] text-center text-[25px] text-[#425563]'>
                     25 YEAR COST OF DOING NOTHING<span className='font-size:10px;'>*</span>
                  </div>
                  <SavingsGraph />
               </div>
               <div className='w-1/2 bg-[#f5f6f7] pl-[40px] pt-[25px]'>
                  <div className='text-[20px] text-[#ff6900]'>Down Payment</div>
                  <div className='text-[26px] text-[#425563]'>${totals?.downPayment}</div>

                  <div className='text-[20px] text-[#ff6900] mt-[10px]'>Fed Tax Credit</div>
                  <div className='text-[26px] text-[#425563]'>${totals?.fedTaxCredit}</div>

                  <div className='text-[20px] text-[#ff6900] mt-[10px]'>Net System Investment</div>
                  <div className='text-[26px] text-[#425563]'>${totals?.netSystemInvestment}</div>

                  <div className='text-[20px] text-[#ff6900] mt-[10px]'>Total Loan Amount</div>
                  <div className='text-[26px] text-[#425563]'>${totals?.totalLoanAmount}</div>

                  <div className='text-[20px] text-[#ff6900] mt-[10px]'>Loan Details</div>
                  <div className='w-[335px] flex-nowrap'>
                     <DropDown
                        keyPath={['name']}
                        selectedValues={[selectedPreviewFinancier]}
                        options={financiers}
                        onOptionSelect={function (e: any, selection: any): void {
                           setSelectedPreviewFinancier(selection);
                        }}
                        placeholder='Select loan details'
                     />
                  </div>

                  <div className='text-[20px] text-[#ff6900] mt-[10px]'>Promotional Payment (First 12 months)</div>
                  <div className='text-[26px] text-[#425563]'>${totals?.promotionalMonthlyPayment}</div>

                  <div className='text-[20px] text-[#ff6900] mt-[10px]'>Payment (By 12th month)</div>
                  <div className='text-[26px] text-[#425563]'>${totals?.finalMonthlyPayment}</div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Totals;
