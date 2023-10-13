'use client';

import React, { useContext, useEffect, useState } from 'react';
import { TwilioContext } from '@/providers/TwilioProvider';
import Button from '../button/Button';
import Input from '../input/Input';
import KeyPad from './KeyPad';

const ManualDialer = () => {
   const { makeOutboundCall } = useContext(TwilioContext);

   let [phoneNumber, setPhoneNumber] = useState<string>('');
   let [formattedNumber, setFormattedNumber] = useState<string>('');

   useEffect(() => {
      var formatted = phoneNumber.replace(/(\d{1,2})(\d{1})?(\d{1,3})?(\d{1,4})?/, function (_, p1, p2, p3, p4) {
         let output = '';
         if (p1) output = `(${p1}`;
         if (p2) output += `${p2})`;
         if (p3) output += ` ${p3}`;
         if (p4) output += `-${p4}`;
         return output;
      });

      setFormattedNumber(formatted);
   }, [phoneNumber]);

   // User input from keypad
   const handleKeyClick = (digit: string) => {
      setPhoneNumber((phoneNumber += digit));
   };

   const handlePhoneNumberChange = (e: any) => {
      const strippedPhoneNumber = e.target.value.replace(/\D+/g, '');
      setPhoneNumber(strippedPhoneNumber);
   };

   const handleDelete = () => {
      let newPhone = phoneNumber.slice(0, -1);
      setPhoneNumber(newPhone);
   };

   const startCall = async () => {
      await makeOutboundCall(phoneNumber);
   };

   return (
      <div className='bg-lum-white dark:bg-lum-gray-700 p-[30px] w-[280px] rounded-[4px] shadow-[0px_1px_2x_rgba(16, 24, 30, 0.15)]'>
         <Input
            type='tel'
            value={formattedNumber}
            onChange={(e) => handlePhoneNumberChange(e)}
            autoFocus
            textCentered
         />
         <KeyPad handleKeyClick={handleKeyClick} />
         <div className='grid grid-cols-3 gap-x-10px w-full'>
            <div>&nbsp;</div>

            <div className='flex justify-center'>
               <Button iconName='PhoneAngled' color='green' size='xl' onClick={startCall} />
            </div>
            <div className='flex justify-end'>
               <Button iconName='Backspace' color='transparent' iconColor='gray:300' size='xl' onClick={handleDelete} />
            </div>
         </div>
      </div>
   );
};

export default ManualDialer;
