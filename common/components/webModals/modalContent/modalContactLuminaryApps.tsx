import React, { useState, FormEvent } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Icon from '../../Icon';
import WebButton from '@/app/(website)/(partials)/button';

import ImageLuminaryBear from '@/public/assets/website/luminary-bear.png';
import ImageYetiCooler from '@/public/assets/website/yeti-cooler.png';

const ModalContactLuminaryApps = ({ handleClose }: { handleClose: () => void }) => {
   const path = usePathname();

   const [firstName, setFirstName] = useState('');
   const [lastName, setLastName] = useState('');
   const [email, setEmail] = useState('');
   const [phone, setPhone] = useState('');
   const [companyName, setCompanyName] = useState('');
   const [numberUsers, setNumberUsers] = useState('');
   const [reqDemo, setReqDemo] = useState(true);
   const [reqPricing, setReqPricing] = useState(false);
   const [reqOther, setReqOther] = useState(false);

   const [success, setSuccess] = useState<boolean | null | string>(null);

   const handleSubmit = (event: FormEvent) => {
      event.preventDefault();

      const data = {
         firstName: firstName,
         lastName: lastName,
         email: email,
         phone: +phone.replace(/\D/g, ''),
         companyName: companyName,
         numberUsers: numberUsers,
         requestDemo: reqDemo,
         requestPricing: reqPricing,
         requestOther: reqOther,
         enteredToWinYeti: path === '/win' ? true : false,
      };

      // Save the data
      fetch(`https://hooks.zapier.com/hooks/catch/1681335/35weu8m/`, {
         method: 'POST',
         body: JSON.stringify(data),
      })
         .then((res) => {
            console.log(res);
            if (res.status === 200) {
               setSuccess(true);
            } else {
               setSuccess(false);
            }
         })
         .catch((error) => {
            console.error('Error:', error);
            setSuccess(false);
         });
   };

   return (
      <div className=''>
         {success === null && (
            <form className='grid place-items-center' onSubmit={handleSubmit} method='POST'>
               <div className='mb-3 md:mb-10 text-center text-[#052130] text-xl md:text-3xl font-bold'>
                  Contact LuminaryApps
               </div>

               <div className='grid gap-2 md:gap-5'>
                  <div className='grid md:grid-cols-2 gap-2 md:gap-5'>
                     <label className='text-[#4F748A] text-sm font-semibold leading-tight'>
                        First Name*
                        <input
                           className='mt-1 px-3 w-full h-8 md:h-12 text-[#052130] bg-lum-white outline-[#4F748A] outline-1 rounded-md shadow-[0_4px_15px_0px_rgba(5,27,40,0.05)] text-base font-medium leading-tight'
                           type='text'
                           autoComplete='given-name'
                           required={true}
                           value={firstName}
                           onInput={(e) => {
                              const val = (e.target as HTMLInputElement).value;
                              setFirstName(val);
                           }}
                        />
                     </label>

                     <label className='text-[#4F748A] text-sm font-semibold leading-tight'>
                        Last Name*
                        <input
                           type='text'
                           className='mt-1 px-3 w-full h-8 md:h-12 text-[#052130] bg-lum-white outline-[#4F748A] outline-1 rounded-md shadow-[0_4px_15px_0px_rgba(5,27,40,0.05)] text-base font-medium leading-tight'
                           autoComplete='family-name'
                           required={true}
                           value={lastName}
                           onInput={(e) => {
                              const val = (e.target as HTMLInputElement).value;
                              setLastName(val);
                           }}
                        />
                     </label>
                  </div>

                  <label className='text-[#4F748A] text-sm font-semibold leading-tight'>
                     Email*
                     <input
                        type='text'
                        className='mt-1 px-3 w-full h-8 md:h-12 text-[#052130] bg-lum-white outline-[#4F748A] outline-1 rounded-md shadow-[0_4px_15px_0px_rgba(5,27,40,0.05)] text-base font-medium leading-tight'
                        autoComplete='email'
                        required={true}
                        value={email}
                        onInput={(e) => {
                           const val = (e.target as HTMLInputElement).value;
                           setEmail(val);
                        }}
                     />
                  </label>

                  <label className='text-[#4F748A] text-sm font-semibold leading-tight'>
                     Phone Number*
                     <input
                        type=''
                        className='mt-1 px-3 w-full h-8 md:h-12 text-[#052130] bg-lum-white outline-[#4F748A] outline-1 rounded-md shadow-[0_4px_15px_0px_rgba(5,27,40,0.05)] text-base font-medium leading-tight'
                        autoComplete='tel'
                        required={true}
                        value={phone}
                        onInput={(e) => {
                           const val = (e.target as HTMLInputElement).value;
                           const phone = val.replace(/(\D+)/g, '');
                           const code = phone.substr(0, 3),
                              first3 = phone.substr(3, 3),
                              last4 = phone.substr(6, 4);
                           setPhone(phone && '(' + code + (first3 && ') ') + first3 + (last4 && '-') + last4);
                        }}
                     />
                  </label>

                  <label className='text-[#4F748A] text-sm font-semibold leading-tight'>
                     Company Name
                     <input
                        type='text'
                        className='mt-1 px-3 w-full h-8 md:h-12 text-[#052130] bg-lum-white outline-[#4F748A] outline-1 rounded-md shadow-[0_4px_15px_0px_rgba(5,27,40,0.05)] text-base font-medium leading-tight'
                        autoComplete='organization'
                        value={companyName}
                        onInput={(e) => {
                           const val = (e.target as HTMLInputElement).value;
                           setCompanyName(val);
                        }}
                     />
                  </label>

                  <label className='text-[#4F748A] text-sm font-semibold leading-tight'>
                     Estimated Number of Luminary Users
                     <input
                        type='number'
                        className='mt-1 px-3 w-full h-8 md:h-12 text-[#052130] bg-lum-white outline-[#4F748A] outline-1 rounded-md shadow-[0_4px_15px_0px_rgba(5,27,40,0.05)] text-base font-medium leading-tight'
                        value={numberUsers}
                        onInput={(e) => {
                           const val = (e.target as HTMLInputElement).value;
                           setNumberUsers(val);
                        }}
                     />
                  </label>

                  <label className='text-[#4F748A] text-sm font-semibold leading-tight'>
                     What are you interested in?
                  </label>

                  <div className='grid md:flex flex-wrap gap-2 md:gap-14 justify-between'>
                     <OptionCheckbox
                        checkedColor='bg-gradient-to-r from-[#28D2FF] to-[#1CB3FF]'
                        text='Request Demo'
                        initial={reqDemo}
                        onChange={(e) => setReqDemo(e)}
                     />
                     <OptionCheckbox
                        checkedColor='bg-gradient-to-r from-[#09D770] to-[#0AD79E]'
                        text='Pricing Information'
                        initial={reqPricing}
                        onChange={(e) => setReqPricing(e)}
                     />
                     <OptionCheckbox
                        checkedColor='bg-gradient-to-r from-[#DB2492] to-[#B825C8]'
                        text='Other Information'
                        initial={reqPricing}
                        onChange={(e) => setReqOther(e)}
                     />
                  </div>
               </div>

               <div className='mt-5 md:mt-12 w-full flex flex-wrap gap-5 justify-center md:justify-end'>
                  <WebButton
                     className='order-last sm:order-first shadow-[0_4px_15px_0px_rgba(5,27,40,0.05)] bg-lum-white md:max-w-[150px]'
                     onClick={handleClose}>
                     <div className='text-center text-[#4F748A] text-lg font-medium leading-tight'>Cancel</div>
                  </WebButton>
                  <WebButton
                     className='shadow-[0_4px_15px_0px_rgba(5,27,40,0.05)] bg-gradient-to-r from-[#28D2FF] to-[#1CB3FF] md:max-w-[150px]'
                     type='submit'>
                     <div className='text-center text-lum-white text-lg font-medium leading-tight'>Submit</div>
                  </WebButton>
               </div>
            </form>
         )}

         {success === true && (
            <div className='md:max-w-[700px] md:px-20 grid'>
               <div className='z-10 grid place-items-center'>
                  <div className='md:flex items-center gap-2'>
                     <Icon name='CheckMark' className='h-[30px] w-auto fill-[#09D770] m-auto' />
                     <div className='text-center text-[#052130] text-3xl font-bold leading-[50px]'> Form Submitted</div>
                  </div>

                  {path === '/win' && (
                     <div className='mt-2 text-center text-[#4F748A] text-base font-normal leading-normal'>
                        You have been successfully submitted in a drawing to win this YETI Cooler!
                     </div>
                  )}

                  <div className='my-7 w-full max-w-[250px] md:max-w-[350px] bg-lum-white p-4 aspect-square rounded-full grid place-items-center shadow-[0_10px_40px_0px_rgba(0,50,72,0.10)]'>
                     {path === '/win' ? (
                        <Image
                           src={ImageYetiCooler}
                           alt='Win Yeti Cooler'
                           width={313}
                           className='w-[220px] md:w-[313px] h-auto'
                        />
                     ) : (
                        <Image
                           src={ImageLuminaryBear}
                           alt='Luminary Bear'
                           width={265}
                           className='w-[200px] md:w-[265px] h-auto'
                        />
                     )}
                  </div>

                  <div className='text-center text-[#4F748A] text-base font-normal leading-normal'>
                     A member of the Luminary Team will be in contact with you soon.
                  </div>

                  <WebButton
                     className='mt-5 shadow-[0_4px_15px_0px_rgba(5,27,40,0.05)] bg-gradient-to-r from-[#28D2FF] to-[#1CB3FF] max-w-[150px]'
                     onClick={handleClose}>
                     <div className='text-center text-white text-lg font-medium leading-tight'>Done</div>
                  </WebButton>
               </div>
            </div>
         )}

         {success === false && (
            <div className='text-center my-3 font-medium'>
               <div className='text-center text-[#052130] text-3xl font-bold leading-[50px]'>Uh Oh...</div>
               <div className='text-center text-[#4F748A] text-base font-normal leading-normal'>
                  Something went wrong. Please try again later.
               </div>
            </div>
         )}
      </div>
   );
};

const OptionCheckbox = ({
   className,
   text,
   initial = false,
   checkedColor = 'bg-[#1480EB]',
   onChange,
}: {
   className?: string;
   text: string;
   initial?: boolean;
   checkedColor?: string;
   onChange: ([]: any) => void;
}) => {
   const [checked, setChecked] = useState(initial);

   const handleclick = () => {
      onChange && onChange(!checked);
      setChecked((prev) => !prev);
   };

   return (
      <div
         className='capitalize text-base flex gap-2 items-center text-[#052130] font-medium cursor-pointer select-none'
         onClick={handleclick}>
         <input type='checkbox' name='text' className='hidden' checked={checked} readOnly />
         <div
            className={`${
               checked ? checkedColor : 'bg-lum-white'
            } p-1 h-6 aspect-square rounded shadow-[0_4px_15px_0px_rgba(5,27,40,0.05)] ${className}`}>
            {checked && <Icon name='CheckMark' className='fill-lum-white' />}
         </div>
         {text}
      </div>
   );
};

export default ModalContactLuminaryApps;
