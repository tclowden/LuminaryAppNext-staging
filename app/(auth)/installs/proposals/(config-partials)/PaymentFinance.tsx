'use client';
import React, { useEffect, useState } from 'react';
import DropDown from '../../../../../common/components/drop-down/DropDown';
import Input from '../../../../../common/components/input/Input';
import Checkbox from '../../../../../common/components/checkbox/Checkbox';
import Panel from '../../../../../common/components/panel/Panel';
import Radio from '../../../../../common/components/radio/Radio';
import axios from 'axios';
import { selectUser } from '../../../../../store/slices/user';
import { useAppSelector } from '../../../../../store/hooks';

interface Props {
   handleChange: any;
   formData: any;
}

const displayType = ['25 Year Savings', 'Avg Utility Bill Savings'];

const PaymentFinance = ({ handleChange, formData }: Props) => {
   const [loanOptions, setLoanOptions] = useState<any[]>([]);
   const [downPayment, setDownPayment] = useState(false);
   const [superAdminDealerFee, setSuperAdminDealerFee] = useState(-1);

   const user = useAppSelector(selectUser);

   const setSelectedLoanOptions = (any: any, options: any) => {
      setLoanOptions([options]);
   };

   useEffect(() => {
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

            setLoanOptions(response.data);
         })
         .catch(function (error) {
            console.log(error);
         });
   }, []);

   useEffect(() => {
      // console.log('form data financier id is ', formData);
      // const selectedFinancier = loanOptions.find((i: any) => i.id == formData.financierId);
      handleChange({ target: { name: 'financierId', type: 'text', value: formData.financierId } });
   }, [loanOptions]);

   return (
      <Panel title='Payment and Financing'>
         <DropDown
            label='Loan Product'
            keyPath={['value']}
            options={loanOptions}
            selectedValues={formData?.financierId ? [loanOptions.find((i: any) => i.id == formData.financierId)] : []}
            onOptionSelect={(e: any, options: any) => {
               handleChange({ target: { name: 'financierId', type: 'text', value: options.id } });
            }}
            placeholder='Select'
            required
         />

         <Input
            type='number'
            label='Down Payment'
            name='downPayment'
            onChange={handleChange}
            value={formData?.downPayment ? formData?.downPayment : 0}
         />

         <Checkbox
            checked={!!formData['taxCreditAsDownpayment' as keyof Object]}
            onChange={handleChange}
            name={'taxCreditAsDownpayment'}
            label='Apply Tax Credit as Down Payment'
         />

         <Input
            type='number'
            label='Super Admin Set Dealer fee % (-1 turns off the override.)'
            name='overrideDealerFee'
            onChange={handleChange}
            value={formData?.overrideDealerFee ? formData?.overrideDealerFee : -1}
         />

         <Checkbox
            checked={!!formData['includeTravelFees' as keyof Object]}
            onChange={handleChange}
            name={'includeTravelFees'}
            label='Travel Fees'
         />

         <Checkbox
            checked={!!formData['offsetDisclaimer' as keyof Object]}
            onChange={handleChange}
            name={'offsetDisclaimer'}
            label='Show Offset Disclaimer'
         />

         {displayType.map((keyName: any, index: any) => (
            <Radio
               key={index}
               checked={formData['savingsOptionDisplay'] === keyName}
               name='savingsOptionDisplay'
               label={keyName}
               value={keyName}
               onChange={(e: any) => {
                  handleChange({
                     target: {
                        name: 'savingsOptionDisplay',
                        type: 'text',
                        value: e.target.value,
                     },
                  });
               }}
            />
         ))}
      </Panel>
   );
};

export default PaymentFinance;
