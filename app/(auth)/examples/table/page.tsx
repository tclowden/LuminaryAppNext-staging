import React from 'react';
import Basic from './Basic';
import Sorting from './Sorting';
import WithActions from './WithActions';
import WithFixedColumns from './WithFixedColumns';
import WithFixedHeader from './WithFixedHeader';
import WithNestedRows from './WithNestedRows';
import WithPaginationBar from './WithPaginationBar';
import WithRenderFunction from './WithRenderFunction';

const Table = () => {
   const userData = [
      {
         userId: 1,
         emailAddress: 'ngrisham@shinesolar.com',
         firstName: 'Nathan',
         lastName: 'Grisham',
         phoneNumber: null,
         role: { name: 'Sales Division Lead' },
      },
      {
         userId: 2,
         emailAddress: 'jdickson@shinesolar.com',
         firstName: 'Justin',
         lastName: 'Dickson',
         phoneNumber: null,
         role: { name: 'Net Metering/Permit Manager' },
      },
      {
         userId: 3,
         emailAddress: 'oaubrey@shinesolar.com',
         firstName: 'Oakland',
         lastName: 'Aubrey',
         phoneNumber: null,
         role: { name: 'Account Manager - Lance' },
      },
      {
         userId: 4,
         emailAddress: 'jlyle@shinesolar.com',
         firstName: 'Johnathon',
         lastName: 'Lyle',
         phoneNumber: null,
         role: { name: 'Super Admin' },
      },
      {
         userId: 5,
         emailAddress: 'agormley@shinesolar.com',
         firstName: 'Anthony',
         lastName: 'Gormley',
         phoneNumber: null,
         role: { name: 'Sales Division Lead' },
      },
      {
         userId: 6,
         emailAddress: 'slauderdale@shinesolar.com',
         firstName: 'Stewart',
         lastName: 'Lauderdale',
         phoneNumber: null,
         role: { name: 'Account Manager - Lance' },
      },
      {
         userId: 7,
         emailAddress: 'jhavelka@shinesolar.com',
         firstName: 'Joseph',
         lastName: 'Havelka',
         phoneNumber: null,
         role: { name: 'Account Manager - Zach Marchbank' },
      },
      {
         userId: 8,
         emailAddress: 'nhughes@shinesolar.com',
         firstName: 'Nathan',
         lastName: 'Hughes',
         phoneNumber: null,
         role: { name: 'Disabled User' },
      },
      {
         userId: 9,
         emailAddress: 'htenney@shinesolar.com',
         firstName: 'Haven',
         lastName: 'Tenny',
         phoneNumber: null,
         role: { name: 'Project Coordinators' },
      },
   ];

   return (
      <div className='flex flex-col gap-y-8 py-6 max-w-[1000px] mx-auto'>
         <Basic allData={userData} />
         <WithPaginationBar allData={userData} />
         <Sorting allData={userData} />
         <WithActions allData={userData} />
         <WithFixedColumns allData={userData} />
         <WithFixedHeader allData={userData} />
         <WithRenderFunction allData={userData} />
         <WithNestedRows allData={userData} />
      </div>
   );
};

export default Table;
