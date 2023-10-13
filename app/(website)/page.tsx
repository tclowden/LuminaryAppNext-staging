// https://www.figma.com/file/45ncWooUzHnFDtx1Kkp1Pi/Luminary-Saas-Product?node-id=694%3A94661&mode=dev
import Image from 'next/image';
import React from 'react';

import ImageScorecardScreenshot from '@/public/assets/website/scorecard-screenshot.jpeg';
import ImageDashboard from '@/public/assets/website/dashboard-screenshot.jpeg';
import ImageAutomations from '@/public/assets/website/automations-screenshot.jpeg';
import ImagePipe from '@/public/assets/website/pipe-screenshot.jpeg';
import ImageMarketingFilter from '@/public/assets/website/filter-screenshot.jpeg';
import ImageMobileApp from '@/public/assets/website/mobile-app.png';
import ImageNathanPyle from '@/public/assets/website/nathan-pyle.png';
import ImageOperations from '@/public/assets/website/operations-screenshot.jpeg';
import ImageChrisTrudo from '@/public/assets/website/chris-trudo.png';
import ImageInboundCalls from '@/public/assets/website/inbound-calls-screenshot.jpeg';

import IconLeadManagement from '@/public/assets/website/icon-lead-management.svg';
import IconLeadUsers from '@/public/assets/website/icon-leads-users.svg';
import IconMarketingTools from '@/public/assets/website/icon-marketing-tools.svg';
import IconOpsManagement from '@/public/assets/website/icon-ops-management.svg';
import IconOutboundCall from '@/public/assets/website/icon-outbound-call.svg';
import IconSalesApp from '@/public/assets/website/icon-sales-app.svg';
import IconSalesManagement from '@/public/assets/website/icon-sales-management.svg';
import WebButton from './(partials)/button';
import WebSection from './(partials)/section';

const style = {
   title: {
      dark: 'text-lum-white text-[23px] md:text-[40px] font-bold leading-[30px] md:leading-10',
      light: 'text-[#052130] text-[23px] md:text-[40px] font-bold leading-[30px] md:leading-[50px]',
   },
   subTitle: {
      dark: 'mt-4 text-[#85A4BB] text-[15px] md:text-lg font-normal leading-snug md:leading-normal',
      light: 'mt-4 text-[#4F748A] text-[15px] md:text-lg font-normal leading-snug md:leading-normal',
   },
};

const Home = () => {
   return (
      <div className=''>
         {/* All in one solution */}
         <WebSection
            variant='dark'
            className='pb-0 md:py-24 md:grid md:grid-cols-[1fr_1fr_1fr_1fr_1fr] md:gap-5'
            priority={true}>
            <div className='col-span-2 md:pl-10'>
               <div className='mb-4 max-w-[412px] text-lum-white text-2xl md:text-3xl font-bold leading-[30px] md:leading-10'>
                  Your All-in-One Solution to Manage Leads, Marketing, Sales & Fulfillment
               </div>
               <div className='text-[#20CAF7] text-[15px] md:text-lg font-normal leading-snug md:leading-normal'>
                  LuminaryApps is more than just a CRM. It gives you all the tools you need for your start-to-finish
                  business process.
               </div>
               <WebButton
                  className='mt-5 mb-8 bg-gradient-to-r from-[#28D2FF] to-[#1CB3FF]'
                  openWebModal={'contact-luminary-apps'}>
                  Request a Demo
               </WebButton>
            </div>
            <Image
               src={ImageScorecardScreenshot}
               alt='Incoming Calls'
               className='rounded-t-md md:rounded-lg shadow-[0_9px_50px_0px_rgba(3,16,24,0.50)] col-span-3 justify-self-end'
               quality={100}
            />
         </WebSection>

         {/* Welcome to luminary Suite of Apps */}
         <WebSection variant='light' className='md:py-32 md:pb-42' priority={true}>
            <div className={`text-center ${style.title.light}`}>
               Welcome to the Luminary
               <br className='md:hidden' /> Suite of Apps
            </div>
            <div className={`text-center ${style.subTitle.light}`}>
               Running your business just got a whole lot easier.
               <br />
               Everything you need, nothing you don't.
            </div>

            <div className='mt-8 md:mt-12 px-8 grid gap-5 md:gap-10 md:grid-cols-2 lg:grid-cols-4'>
               <div className='max-w-[240px] bg-lum-white rounded-md shadow-[0_10px_40px_0px_rgba(5,19,26,0.05)]'>
                  <div className='w-full h-[5px] rounded-t-md bg-gradient-to-r from-[#DB2492] to-[#DB24D4]'></div>
                  <div className='px-10 py-6 h-full flex flex-col place-items-center'>
                     <IconLeadManagement className='h-9 md:h-11' width={'100%'} height={45} />
                     <div className='pt-3 md:pt-5 text-center text-[#294452] text-base font-medium leading-[18px] md:leading-tight'>
                        Customer Relations
                        <br />& Lead Management
                     </div>
                  </div>
               </div>
               <div className='max-w-[240px] bg-lum-white rounded-md shadow-[0_10px_40px_0px_rgba(5,19,26,0.05)]'>
                  <div className='w-full h-[5px] rounded-t-md bg-gradient-to-r from-[#09D770] to-[#0DD8C3]'></div>
                  <div className='px-10 py-6 h-full flex flex-col place-items-center'>
                     <IconSalesManagement className='h-9 md:h-11' width={'100%'} height={45} />
                     <div className='pt-3 md:pt-5 text-center text-[#294452] text-base font-medium leading-[18px] md:leading-tight'>
                        Inside Sales &<br /> Sales Management
                     </div>
                  </div>
               </div>
               <div className='max-w-[240px] bg-lum-white rounded-md shadow-[0_10px_40px_0px_rgba(5,19,26,0.05)]'>
                  <div className='w-full h-[5px] rounded-t-md bg-gradient-to-r from-[#28D2FF] to-[#19ADFF]'></div>
                  <div className='px-10 py-6 h-full flex flex-col place-items-center'>
                     <IconMarketingTools className='h-9 md:h-11' width={'100%'} height={45} />
                     <div className='pt-3 md:pt-5 text-center text-[#294452] text-base font-medium leading-[18px] md:leading-tight'>
                        Marketing Tools <br />& Automations
                     </div>
                  </div>
               </div>
               <div className='max-w-[240px] bg-lum-white rounded-md shadow-[0_10px_40px_0px_rgba(5,19,26,0.05)]'>
                  <div className='w-full h-[5px] rounded-t-md bg-gradient-to-r from-[#F07300] to-[#E55E14]'></div>
                  <div className='px-10 py-6 h-full flex flex-col place-items-center'>
                     <IconOpsManagement className='h-9 md:h-11' width={'100%'} height={45} />
                     <div className='pt-3 md:pt-5 text-center text-[#294452] text-base font-medium leading-[18px] md:leading-tight'>
                        Ops & Fulfillment Management
                     </div>
                  </div>
               </div>
            </div>
         </WebSection>

         {/* Business Intelligence Reimagined */}
         <WebSection variant='dark' className='!pb-0'>
            <div className={`text-center ${style.title.dark}`}>Business Intelligence Reimagined</div>
            <div className={`text-center ${style.subTitle.dark}`}>
               Get an in depth look at the health of your sales organization
               <br className='hidden md:inline' /> with our detailed home dashboard view
            </div>
            <Image
               src={ImageDashboard}
               alt='Business Intelligence Reimagined'
               className='mt-10 rounded-t-xl shadow-[0_9px_50px_0px_rgba(3,16,24,0.50)]'
               quality={100}
            />
         </WebSection>

         {/* Customer Relations */}
         <WebSection variant='light' className='md:py-28 md:grid md:grid-cols-[1fr_1fr_1fr_1fr_1fr] md:gap-14'>
            <div className='md:order-2 col-span-2'>
               <IconLeadManagement className='mb-4 h-9 md:h-[75px] w-auto' width={'100%'} height={75} />
               <div className={`text-left ${style.title.light}`}>
                  Customer Relations
                  <br />& Lead Management
               </div>
               <div className={`text-left ${style.subTitle.light}`}>
                  Easily add or import leads, multi view sales pipeline, analytics & dashboards and custom lead
                  distribution.
               </div>
               <WebButton
                  className='mt-5 mb-8 bg-gradient-to-r from-[#DB2492] to-[#DD25D1]'
                  openWebModal={'contact-luminary-apps'}>
                  Request a Demo
               </WebButton>
            </div>
            <Image
               src={ImagePipe}
               alt='Lead Management'
               quality={100}
               className='rounded-[10px] shadow-[0_10px_40px_0px_rgba(3,16,24,0.10)] col-span-3 justify-self-start'
            />
         </WebSection>

         {/* Inside Sales & Sales Management */}
         <WebSection variant='dark' className='pb-0 md:py-28 md:grid md:grid-cols-[1fr_1fr_1fr_1fr_1fr] md:gap-14'>
            <div className='col-span-2'>
               <IconSalesManagement className='mb-4 h-9 md:h-[75px] w-auto' width={'100%'} height={75} />
               <div className={`${style.title.dark}`}>
                  Inside Sales & Sales
                  <br />
                  Management
               </div>
               <div className={`${style.subTitle.dark}`}>
                  In app calling and texting, sales team leaderboard, optimized for speed to contact, real-time call
                  monitoring.
               </div>
               <WebButton
                  className='mt-5 mb-8 bg-gradient-to-r from-[#0BD875] to-[#0ED9BC]'
                  openWebModal={'contact-luminary-apps'}>
                  Request a Demo
               </WebButton>
            </div>
            <Image
               src={ImageInboundCalls}
               alt='Incoming Calls'
               className='rounded-t-md md:rounded-[6px] shadow-[0_10px_40px_0px_rgba(3,16,24,0.10)] col-span-3 justify-self-end'
            />
         </WebSection>

         {/* Marketing Tools & Automations */}
         <WebSection variant='light' className='md:py-28 md:grid md:grid-cols-[1fr_1fr_1fr_1fr_1fr] md:gap-14'>
            <div className='col-span-2 md:order-2'>
               <IconMarketingTools className='mb-4 h-9 md:h-[75px] w-auto' width={'100%'} height={75} />
               <div className={`${style.title.light}`}>
                  Marketing Tools &<br />
                  Automations
               </div>
               <div className={`${style.subTitle.light}`}>
                  Set up customized filters to market to and connect with a specific group of leads.{' '}
               </div>
               <WebButton
                  className='mt-5 mb-8 bg-gradient-to-r from-[#28D2FF] to-[#1CB3FF]'
                  openWebModal={'contact-luminary-apps'}>
                  Request a Demo
               </WebButton>
            </div>
            <Image
               src={ImageMarketingFilter}
               alt='Marrketing Tools'
               className='rounded-[15px] shadow-[0_10px_50px_0px_rgba(5,29,43,0.25)] col-span-3'
            />
         </WebSection>

         {/* Redifining what software can do for you */}
         <WebSection variant='dark' className='!pb-0'>
            <div className={`text-center ${style.title.dark}`}>Redefining what software can do for you</div>
            <div className={`text-center ${style.subTitle.dark}`}>
               Create advanced customer segments, send customized broadcasts and configure
               <br className='hidden md:inline' /> automated marketing flows. Then sit back and let Luminary do the
               rest.
            </div>
            <Image
               src={ImageAutomations}
               alt='Automations'
               className='mt-10 rounded-t-[10px] shadow-[0_10px_50px_0px_rgba(3,19,29,0.50)]'
            />
         </WebSection>

         {/* Ops & Fulfillment Management */}
         <WebSection variant='light' className='!pb-0 md:pt-28 md:grid md:grid-cols-[1fr_1fr_1fr_1fr_1fr] md:gap-14'>
            <div className='col-span-2'>
               <IconOpsManagement className='mb-4 h-9 md:h-[75px] w-auto' width={'100%'} height={75} />
               <div className={`${style.title.light}`}>
                  Operations & Fulfillment
                  <br />
                  Management
               </div>
               <div className={`${style.subTitle.light}`}>
                  Customize products with custom fields, coordinators, tasks and stages. Manage and automatically assign
                  tasks, run automations & track progress of installation and/or order fulfillment.
               </div>
               <WebButton
                  className='mt-5 mb-8 bg-gradient-to-r from-[#F17402] to-[#E76114]'
                  openWebModal={'contact-luminary-apps'}>
                  Request a Demo
               </WebButton>
            </div>
            <Image
               src={ImageOperations}
               alt='Operations Management'
               className='rounded-t-md col-span-3 shadow-[0_10px_50px_0px_rgba(5,29,43,0.25)] justify-self-end self-end'
            />
         </WebSection>

         {/* Did we mention there's a mobile app? */}
         <WebSection variant='dark' className='!pb-0'>
            <div className={`text-center ${style.title.dark}`}>Did we mention there's a mobile app?</div>
            <div className={`text-center ${style.subTitle.dark}`}>
               The Luminary mobile app meets the specific needs of your field employees giving them the
               <br className='hidden md:inline' /> ability to view tasks, actions and to dos right from their mobile
               device.
            </div>
            <div className='mt-10 w-full max-w-[1080px] pt-7 bg-lum-white rounded-t-[20px] shadow flex justify-center overflow-hidden'>
               <Image src={ImageMobileApp} alt='Mobile App' className='md:max-w-[370px] mr-[20%] md:mr-20' />
            </div>
         </WebSection>

         {/* Luminary has been around the block */}
         <WebSection variant='light' className='md:py-28'>
            <div className={`text-center ${style.title.light}`}>
               Luminary has been around the block... A couple of times
            </div>
            <div className={`text-center ${style.subTitle.light}`}>
               Companies using LuminaryApps have seen huge success within their sales organizations.
               <br className='hidden md:inline' /> Here are a few numbers highlighting what we have processed so far.
            </div>

            <div className='mt-10 grid md:flex md:flex-wrap gap-5 md:gap-7 mx-auto md:justify-center'>
               <div className='md:w-[340px] py-7 px-5 md:py-16 bg-lum-white rounded-xl shadow-[0_10px_50px_0px_rgba(5,24,35,0.05)] flex flex-col place-items-center'>
                  <IconOutboundCall className='mb-2 h-9 md:h-[80px] w-auto' width={'100%'} height={80} />
                  <div className='md:pt-5 text-center text-[#2C5F74] text-base font-medium leading-normal'>
                     In App Calls in Luminary
                  </div>
                  <div className='text-center'>
                     <span className='text-5xl md:text-6xl font-bold leading-none md:leading-[70px] text-transparent bg-clip-text bg-gradient-to-r from-[#0BE779] to-[#09DDC2]'>
                        2.9M
                     </span>
                     <span className='text-[#B5C5CE] text-6xl font-normal leading-none md:leading-[70px]'>+</span>
                  </div>
               </div>
               <div className='md:w-[340px] py-7 px-5 md:py-16 bg-lum-white rounded-xl shadow-[0_10px_50px_0px_rgba(5,24,35,0.05)] flex flex-col place-items-center'>
                  <IconSalesApp className='mb-2 h-9 md:h-[80px] w-auto' width={'100%'} height={80} />
                  <div className='md:pt-5 text-center text-[#2C5F74] text-base font-medium leading-normal'>
                     Total Sales Using LuminaryApps
                  </div>
                  <div className='text-center'>
                     <span className='text-5xl md:text-6xl font-bold leading-none md:leading-[70px] text-transparent bg-clip-text bg-gradient-to-r from-[#0BE779] to-[#09DDC2]'>
                        $250M
                     </span>
                     <span className='text-[#B5C5CE] text-6xl font-normal leading-none md:leading-[70px]'>+</span>
                  </div>
               </div>
               <div className='md:w-[340px] py-7 px-5 md:py-16 bg-lum-white rounded-xl shadow-[0_10px_50px_0px_rgba(5,24,35,0.05)] flex flex-col place-items-center'>
                  <IconLeadUsers className='mb-2 h-9 md:h-[80px] w-auto' width={'100%'} height={80} />
                  <div className='md:pt-5 text-center text-[#2C5F74] text-base font-medium leading-normal'>
                     Leads Processed Using LuminaryApps
                  </div>
                  <div className='text-center'>
                     <span className='text-5xl md:text-6xl font-bold leading-none md:leading-[70px] text-transparent bg-clip-text bg-gradient-to-r from-[#0BE779] to-[#09DDC2]'>
                        160K
                     </span>
                     <span className='text-[#B5C5CE] text-6xl font-normal leading-none md:leading-[70px]'>+</span>
                  </div>
               </div>
            </div>
         </WebSection>

         {/* Testimonials */}
         <WebSection variant='dark' className='md:py-28'>
            <div className={`text-center ${style.title.dark}`}>Testimonials</div>
            <div className='mt-8 md:mt-10 grid md:grid-cols-2 gap-14'>
               <div className='py-5 md:py-10 px-8 md:px-14 bg-lum-white bg-opacity-5 rounded-xl shadow backdrop-blur-[50px]'>
                  <div className='text-lum-white text-sm md:text-[15px] font-normal leading-[22px] md:leading-7'>
                     "Luminary has significantly impacted our operational strategy, providing unparalleled management
                     capabilities compared to systems like ZOHO, ODOO, and PROCORE. It empowers us to effortlessly
                     handle customer management, project tracking, scheduling, and revenue. Serving as an all-in-one
                     tool for communication, reporting, and more, it seamlessly bridges sales and installation,
                     enhancing customer experience.
                     <br />
                     <br />
                     Its customization, support, and integration have revolutionized our business, boosting efficiency,
                     and profitability. As someone with 35+ years in construction, I find this groundbreaking product
                     truly transformative for the industry. Thank you for changing the way we operate!"
                  </div>
                  <div className='mt-6 flex place-items-center gap-3'>
                     <Image src={ImageChrisTrudo} alt='Chris Trudo' width={40} height={40} quality={100} />
                     <div className='text-[#94BCD3] text-lg font-semibold leading-none'>Chris Trudo</div>
                  </div>
               </div>

               <div className='py-5 md:py-10 px-8 md:px-14 bg-lum-white bg-opacity-5 rounded-xl shadow backdrop-blur-[50px]'>
                  <div className='text-lum-white text-sm md:text-[15px] font-normal leading-[22px] md:leading-7'>
                     “As someone who has managed multiple sales floors, I've encountered various CRM systems, but
                     Luminary is the first that feels tailor-made for my approach. Its exceptional accountability tools,
                     intuitive metrics tracking, and seamless call features have exceeded my expectations. Additionally,
                     its integration with our construction processes sets Luminary apart as the most sophisticated CRM
                     I've experienced, benefiting both sales and project management.”
                  </div>
                  <div className='mt-6 flex place-items-center gap-3'>
                     <Image src={ImageNathanPyle} alt='Nathan Pyle' width={40} height={40} quality={100} />
                     <div className='text-[#94BCD3] text-lg font-semibold leading-none'>Nathan Pyle</div>
                  </div>
               </div>
            </div>
         </WebSection>
      </div>
   );
};

export default Home;
