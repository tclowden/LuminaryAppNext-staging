'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import Input from '../../../../../common/components/input/Input';
import Checkbox from '../../../../../common/components/checkbox/Checkbox';
import DropDown from '../../../../../common/components/drop-down/DropDown';
import Panel from '../../../../../common/components/panel/Panel';
import Grid from '../../../../../common/components/grid/Grid';
import axios from 'axios';
import Cookies from 'js-cookie';
import { selectUser, selectUserHasPermission } from '../../../../../store/slices/user';
import { useAppSelector } from '../../../../../store/hooks';

interface Props {
   handleChange: any;
   formData: any;
}

const EnergyUsage = ({ handleChange, formData }: Props) => {
   const [utilityCompanies, setUtilityCompanies] = useState([]);
   const [states, setStates] = useState([]);
   const [dryHide, setDryHide] = useState(false);

   useEffect(() => {
      const userAuthToken = Cookies.get('LUM_AUTH');
      axios({
         method: 'get',
         url: `/api/v2/utility-companies`,
         headers: {
            Authorization: `Bearer ${userAuthToken}`,
         },
      })
         .then(function (response) {
            response.data.map((e: any) => {
               e.stateName = e.state.name;
               e.value = e.name;
            });
            setUtilityCompanies(response.data);
         })
         .catch(function (error) {
            console.log(error);
         });

      //    axios({
      //       method: 'get',
      //       url: `${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/states`,
      //       headers: {
      //          Authorization: `Bearer ${userAuthToken}`,
      //       },
      //    })
      //       .then(function (response) {
      //          response.data.map((e: any) => {
      //             e.value = e.name;
      //          });

      //          console.log('states : ', response.data);
      //          setStates(response.data);
      //       })
      //       .catch(function (error) {
      //          console.log(error);
      //       });
   }, []);

   // For example, goes by use states
   const user = useAppSelector(selectUser); // Import user state
   const userCanViewRevenue = selectUserHasPermission(user, '53c6f540-b51c-4adf-a419-551b07965fed');

   const displayPPW = (month: string) => {
      let ppw = 0;
      const billKey = month + 'Bill';
      const usageKey = month + 'Usage';
      ppw = formData[billKey] / formData[usageKey];

      if (isNaN(ppw)) {
         return '0';
      }
      return String(ppw.toFixed(2));
   };

   const getTotalK = () => {
      return (
         parseFloat(formData['janUsage']) +
         parseFloat(formData['febUsage']) +
         parseFloat(formData['marUsage']) +
         parseFloat(formData['aprUsage']) +
         parseFloat(formData['mayUsage']) +
         parseFloat(formData['junUsage']) +
         parseFloat(formData['julUsage']) +
         parseFloat(formData['augUsage']) +
         parseFloat(formData['sepUsage']) +
         parseFloat(formData['octUsage']) +
         parseFloat(formData['novUsage']) +
         parseFloat(formData['decUsage'])
      );
   };

   const getAverageBill = () => {
      return (
         (parseFloat(formData['janBill']) +
            parseFloat(formData['febBill']) +
            parseFloat(formData['marBill']) +
            parseFloat(formData['aprBill']) +
            parseFloat(formData['mayBill']) +
            parseFloat(formData['junBill']) +
            parseFloat(formData['julBill']) +
            parseFloat(formData['augBill']) +
            parseFloat(formData['sepBill']) +
            parseFloat(formData['octBill']) +
            parseFloat(formData['novBill']) +
            parseFloat(formData['decBill'])) /
         12
      ).toFixed(2);
   };

   return (
      <Panel title='Energy Usage'>
         <DropDown
            label='Utility Company'
            selectedValues={formData?.utilityCompany ? [formData?.utilityCompany] : []}
            keyPath={['name']}
            options={utilityCompanies}
            onOptionSelect={(e: any, utilityCompany: any) => {
               console.log(utilityCompany, 'options');
               handleChange({ target: { name: 'utilityCompany', type: 'text', value: utilityCompany } });
               handleChange({ target: { name: 'utilityCompanyId', type: 'text', value: utilityCompany.id } });
            }}
            placeholder='Select'
            required
         />

         <Checkbox
            checked={dryHide}
            onChange={(e: any) => {
               setDryHide((i) => !i);

               if (dryHide) {
                  handleChange({ target: { name: 'janUsage', type: 'text', value: '' } });
                  handleChange({ target: { name: 'febUsage', type: 'text', value: '' } });
                  handleChange({ target: { name: 'marUsage', type: 'text', value: '' } });
                  handleChange({ target: { name: 'aprUsage', type: 'text', value: '' } });
                  handleChange({ target: { name: 'mayUsage', type: 'text', value: '' } });
                  handleChange({ target: { name: 'junUsage', type: 'text', value: '' } });
                  handleChange({ target: { name: 'julUsage', type: 'text', value: '' } });
                  handleChange({ target: { name: 'augUsage', type: 'text', value: '' } });
                  handleChange({ target: { name: 'sepUsage', type: 'text', value: '' } });
                  handleChange({ target: { name: 'octUsage', type: 'text', value: '' } });
                  handleChange({ target: { name: 'novUsage', type: 'text', value: '' } });
                  handleChange({ target: { name: 'decUsage', type: 'text', value: '' } });
                  handleChange({ target: { name: 'janBill', type: 'text', value: '' } });
                  handleChange({ target: { name: 'febBill', type: 'text', value: '' } });
                  handleChange({ target: { name: 'marBill', type: 'text', value: '' } });
                  handleChange({ target: { name: 'aprBill', type: 'text', value: '' } });
                  handleChange({ target: { name: 'mayBill', type: 'text', value: '' } });
                  handleChange({ target: { name: 'junBill', type: 'text', value: '' } });
                  handleChange({ target: { name: 'julBill', type: 'text', value: '' } });
                  handleChange({ target: { name: 'augBill', type: 'text', value: '' } });
                  handleChange({ target: { name: 'sepBill', type: 'text', value: '' } });
                  handleChange({ target: { name: 'octBill', type: 'text', value: '' } });
                  handleChange({ target: { name: 'novBill', type: 'text', value: '' } });
                  handleChange({ target: { name: 'decBill', type: 'text', value: '' } });
               }
            }}
            name={'dry'}
            label='Dry Proposal?'
         />

         {!dryHide && (
            <Grid columnCount={4}>
               <div className='flex flex-col place-content-evenly h-[650px] text-right'>
                  <div className='h-[40px]'>Month</div>
                  <div className='h-[40px]'>January</div>
                  <div className='h-[40px]'>February</div>
                  <div className='h-[40px]'>March</div>
                  <div className='h-[40px]'>April</div>
                  <div className='h-[40px]'>May</div>
                  <div className='h-[40px]'>June</div>
                  <div className='h-[40px]'>July</div>
                  <div className='h-[40px]'>August</div>
                  <div className='h-[40px]'>September</div>
                  <div className='h-[40px]'>October</div>
                  <div className='h-[40px]'>November</div>
                  <div className='h-[40px]'>December</div>
                  <div className='h-[40px]'></div>
               </div>
               <div className='flex flex-col place-content-evenly h-[650px]'>
                  <div className='h-[40px] self-center'>Usage</div>
                  <Input
                     name='janUsage'
                     onChange={handleChange}
                     value={formData?.janUsage ? formData?.janUsage : ''}
                     type='number'
                  />
                  <Input
                     onChange={handleChange}
                     name='febUsage'
                     value={formData?.febUsage ? formData?.febUsage : ''}
                     type='number'
                  />
                  <Input
                     onChange={handleChange}
                     name='marUsage'
                     value={formData?.marUsage ? formData?.marUsage : ''}
                     type='number'
                  />
                  <Input
                     onChange={handleChange}
                     name='aprUsage'
                     value={formData?.aprUsage ? formData?.aprUsage : ''}
                     type='number'
                  />
                  <Input
                     onChange={handleChange}
                     name='mayUsage'
                     value={formData?.mayUsage ? formData?.mayUsage : ''}
                     type='number'
                  />
                  <Input
                     onChange={handleChange}
                     name='junUsage'
                     value={formData?.junUsage ? formData?.junUsage : ''}
                     type='number'
                  />
                  <Input
                     onChange={handleChange}
                     name='julUsage'
                     value={formData?.julUsage ? formData?.julUsage : ''}
                     type='number'
                  />
                  <Input
                     onChange={handleChange}
                     name='augUsage'
                     value={formData?.augUsage ? formData?.augUsage : ''}
                     type='number'
                  />
                  <Input
                     onChange={handleChange}
                     name='sepUsage'
                     value={formData?.sepUsage ? formData?.sepUsage : ''}
                     type='number'
                  />
                  <Input
                     onChange={handleChange}
                     name='octUsage'
                     value={formData?.octUsage ? formData?.octUsage : ''}
                     type='number'
                  />
                  <Input
                     onChange={handleChange}
                     name='novUsage'
                     value={formData?.novUsage ? formData?.novUsage : ''}
                     type='number'
                  />
                  <Input
                     onChange={handleChange}
                     name='decUsage'
                     value={formData?.decUsage ? formData?.decUsage : ''}
                     type='number'
                  />

                  <div>
                     <h3>Total</h3>
                     <h3>{getTotalK()} KwH</h3>
                  </div>
               </div>
               <div className='flex flex-col place-content-evenly h-[650px] '>
                  <div className='h-[40px] self-center'>Bill Total</div>
                  <Input
                     name='janBill'
                     onChange={handleChange}
                     type='number'
                     value={formData?.janBill ? formData?.janBill : ''}
                  />
                  <Input
                     name='febBill'
                     onChange={handleChange}
                     value={formData?.febBill ? formData?.febBill : ''}
                     type='number'
                  />
                  <Input
                     name='marBill'
                     onChange={handleChange}
                     value={formData?.marBill ? formData?.marBill : ''}
                     type='number'
                  />
                  <Input
                     name='aprBill'
                     onChange={handleChange}
                     value={formData?.aprBill ? formData?.aprBill : ''}
                     type='number'
                  />
                  <Input
                     name='mayBill'
                     onChange={handleChange}
                     value={formData?.mayBill ? formData?.mayBill : ''}
                     type='number'
                  />
                  <Input
                     name='junBill'
                     onChange={handleChange}
                     value={formData?.junBill ? formData?.junBill : ''}
                     type='number'
                  />
                  <Input
                     name='julBill'
                     onChange={handleChange}
                     value={formData?.julBill ? formData?.julBill : ''}
                     type='number'
                  />
                  <Input
                     name='augBill'
                     onChange={handleChange}
                     value={formData?.augBill ? formData?.augBill : ''}
                     type='number'
                  />
                  <Input
                     name='sepBill'
                     onChange={handleChange}
                     value={formData?.sepBill ? formData?.sepBill : ''}
                     type='number'
                  />
                  <Input
                     name='octBill'
                     onChange={handleChange}
                     value={formData?.octBill ? formData?.octBill : ''}
                     type='number'
                  />
                  <Input
                     name='novBill'
                     onChange={handleChange}
                     value={formData?.novBill ? formData?.novBill : ''}
                     type='number'
                  />
                  <Input
                     name='decBill'
                     onChange={handleChange}
                     value={formData?.decBill ? formData?.decBill : ''}
                     type='number'
                  />

                  <div>
                     <h3>Bill Total</h3>
                     <h3>${getAverageBill()}</h3>
                  </div>
               </div>

               <div className='flex flex-col place-content-evenly h-[650px]'>
                  <div className='h-[40px]'>PPW</div>
                  <div className='h-[40px]'>${displayPPW('jan')}</div>
                  <div className='h-[40px]'>${displayPPW('feb')}</div>
                  <div className='h-[40px]'>${displayPPW('mar')}</div>
                  <div className='h-[40px]'>${displayPPW('apr')}</div>
                  <div className='h-[40px]'>${displayPPW('may')}</div>
                  <div className='h-[40px]'>${displayPPW('jun')}</div>
                  <div className='h-[40px]'>${displayPPW('jun')}</div>
                  <div className='h-[40px]'>${displayPPW('aug')}</div>
                  <div className='h-[40px]'>${displayPPW('sep')}</div>
                  <div className='h-[40px]'>${displayPPW('oct')}</div>
                  <div className='h-[40px]'>${displayPPW('nov')}</div>
                  <div className='h-[40px]'>${displayPPW('dec')}</div>
                  <div className='h-[40px]'></div>
               </div>
            </Grid>
         )}
      </Panel>
   );
};

export default EnergyUsage;
