'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import DropDown from '../../../../../common/components/drop-down/DropDown';
import Grid from '../../../../../common/components/grid/Grid';
import Input from '../../../../../common/components/input/Input';
import Panel from '../../../../../common/components/panel/Panel';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { selectUser } from '../../../../../store/slices/user';
import noImageDefault from '../../../../../public/assets/proposal/images/no-image-default.jpg';
import LoadingSpinner from '@/common/components/loaders/loading-spinner/LoadingSpinner';
import { UUID } from 'sequelize';

interface Props {
   handleChange: any;
   formData: any;
   previewURL: any;
   setPreviewUrl: any;
   leadId: any;
   proposalData: any;
}

const Solar = ({ handleChange, formData, previewURL, setPreviewUrl, leadId, proposalData }: Props) => {
   let dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   const [loadingImage, setLoadingImage] = useState(false);

   const solarDummyData: Array<any> = [
      { id: '0', type: 'Roof Mount', value: 'Roof Mount' },
      { id: '1', type: 'Ground Mount', value: 'Ground Mount' },
      { id: '2', type: 'Both', value: 'Both' },
   ];

   const handleSolarPictureUpload = async (e: any) => {
      setLoadingImage(true);

      const file = e.target.files[0];
      const formData = new FormData();

      // How to get leadId..
      // either it's in the url if it's a /new
      // or it's connected to the proposal Option

      const leadIdResolved = leadId == undefined ? proposalData.option[0].leadId : leadId;
      formData.append('file', file);
      formData.append('fileNickName', file.name);
      formData.append('filePath', `leads/${leadIdResolved}/` + crypto.randomUUID());
      formData.append('leadId', leadIdResolved);
      formData.append('userId', user?.id as any);
      fetch(`/api/v2/proposal-options/upload`, {
         method: 'POST',
         headers: {
            Authorization: `Bearer ${user.token}`,
         },
         body: formData,
      })
         .then(async (res) => {
            const results = await res.json();
            if (results.error) throw new Error(results.error.errorMessage);

            setPreviewUrl((e: string) => {
               console.log(e, 'old preview URL');
               console.log(results?.filePath, 'new preview URL');
               setLoadingImage(false);

               return results?.filePath;
            });
         })
         .catch((err) => {
            console.error('err:', err);
            setLoadingImage(false);
         });
   };

   return (
      <Panel title='Payment and Financing'>
         <Input
            type='number'
            label='System Size (Kw)'
            name='roofKw'
            onChange={handleChange}
            value={formData?.roofKw ? formData?.roofKw : 0}
         />
         <Input
            type='number'
            label='Panel Size'
            name='panelSize'
            onChange={handleChange}
            value={formData?.panelSize ? formData?.panelSize : 0}
         />
         <Input
            type='number'
            label='Number of Panels'
            name='numberOfPanels'
            onChange={handleChange}
            value={formData?.numberOfPanels ? formData?.numberOfPanels : 0}
         />

         <DropDown
            label='Solar System Type'
            selectedValues={formData?.systemType ? [formData?.systemType] : []}
            keyPath={['value']}
            options={solarDummyData}
            onOptionSelect={(e: any, options: any) => {
               handleChange({ target: { name: 'systemType', type: 'text', value: options } });
            }}
            placeholder='Select'
            required
         />

         <div className='3dimage'></div>

         <div className='flex flex-col'>
            <input className='flex w-[225px]' name='solarPicture' type='file' onChange={handleSolarPictureUpload} />

            <div className='flex w-full mt-[40px] justify-center align-center flex-col'>
               {loadingImage && <LoadingSpinner isOpen={true} size={75} />}
               {!loadingImage && (
                  <Image
                     className='min-w[700px] max-h[400px] max-w[700px] max-w-3xl '
                     src={previewURL == null || previewURL == '' ? noImageDefault : previewURL}
                     alt='show roof simulation'
                     width='200'
                     height='200'
                  />
               )}
            </div>
         </div>
         <div>
            <Grid columnCount={3}>
               <div className='flex flex-col place-content-evenly h-[800px] text-right'>
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
               </div>

               <div className='flex flex-col place-content-evenly h-[800px] text-center'>
                  <div className='h-[40px]'>Solar Production (Kwh)</div>
                  <Input
                     type='number'
                     name='janProduction'
                     onChange={handleChange}
                     value={formData?.janProduction ? formData?.janProduction : ''}
                  />
                  <Input
                     type='number'
                     name='febProduction'
                     onChange={handleChange}
                     value={formData?.febProduction ? formData?.febProduction : ''}
                  />
                  <Input
                     type='number'
                     name='marProduction'
                     onChange={handleChange}
                     value={formData?.marProduction ? formData?.marProduction : ''}
                  />
                  <Input
                     type='number'
                     name='aprProduction'
                     onChange={handleChange}
                     value={formData?.aprProduction ? formData?.aprProduction : ''}
                  />
                  <Input
                     type='number'
                     name='mayProduction'
                     onChange={handleChange}
                     value={formData?.mayProduction ? formData?.mayProduction : ''}
                  />
                  <Input
                     type='number'
                     name='junProduction'
                     onChange={handleChange}
                     value={formData?.junProduction ? formData?.junProduction : ''}
                  />
                  <Input
                     type='number'
                     name='julProduction'
                     onChange={handleChange}
                     value={formData?.julProduction ? formData?.julProduction : ''}
                  />
                  <Input
                     type='number'
                     name='augProduction'
                     onChange={handleChange}
                     value={formData?.augProduction ? formData?.augProduction : ''}
                  />
                  <Input
                     type='number'
                     name='sepProduction'
                     onChange={handleChange}
                     value={formData?.sepProduction ? formData?.sepProduction : ''}
                  />
                  <Input
                     type='number'
                     name='octProduction'
                     onChange={handleChange}
                     value={formData?.octProduction ? formData?.octProduction : ''}
                  />
                  <Input
                     type='number'
                     name='novProduction'
                     onChange={handleChange}
                     value={formData?.novProduction ? formData?.novProduction : ''}
                  />
                  <Input
                     type='number'
                     name='decProduction'
                     onChange={handleChange}
                     value={formData?.decProduction ? formData?.decProduction : ''}
                  />
               </div>
               <div className='flex flex-col place-content-evenly h-[800px] text-left'>
                  <div className='h-[40px]'>Offset</div>
                  <div className='h-[40px]'>{Math.round((formData?.janProduction / formData?.janUsage) * 100)}%</div>
                  <div className='h-[40px]'>{Math.round((formData?.febProduction / formData?.febUsage) * 100)}%</div>
                  <div className='h-[40px]'>{Math.round((formData?.marProduction / formData?.marUsage) * 100)}%</div>
                  <div className='h-[40px]'>{Math.round((formData?.aprProduction / formData?.aprUsage) * 100)}%</div>
                  <div className='h-[40px]'>{Math.round((formData?.mayProduction / formData?.mayUsage) * 100)}%</div>
                  <div className='h-[40px]'>{Math.round((formData?.junProduction / formData?.junUsage) * 100)}%</div>
                  <div className='h-[40px]'>{Math.round((formData?.julProduction / formData?.julUsage) * 100)}%</div>
                  <div className='h-[40px]'>{Math.round((formData?.augProduction / formData?.augUsage) * 100)}%</div>
                  <div className='h-[40px]'>{Math.round((formData?.sepProduction / formData?.sepUsage) * 100)}%</div>
                  <div className='h-[40px]'>{Math.round((formData?.octProduction / formData?.octUsage) * 100)}%</div>
                  <div className='h-[40px]'>{Math.round((formData?.novProduction / formData?.novUsage) * 100)}%</div>
                  <div className='h-[40px]'>{Math.round((formData?.decProduction / formData?.decUsage) * 100)}%</div>
               </div>
            </Grid>
         </div>

         <Input
            type='number'
            label='Additional Cost'
            name='solarAdditionalCost'
            onChange={handleChange}
            value={formData?.solarAdditionalCost ? formData?.solarAdditionalCost : ''}
         />
         <Input
            type='number'
            label='Check cost'
            name='checkCost'
            onChange={handleChange}
            value={formData?.checkCost ? formData?.checkCost : ''}
         />
         <Input
            type='number'
            label='Trenching Cost'
            name='trenchingCost'
            onChange={handleChange}
            value={formData?.trenchingCost ? formData?.trenchingCost : ''}
         />

         <Input
            type='number'
            label='Solar price override'
            name='solarPriceOverride'
            onChange={handleChange}
            value={formData?.solarPriceOverride ? formData?.solarPriceOverride : ''}
         />

         <Input
            type='text'
            label='Solar Notes'
            name='solarNotes'
            onChange={handleChange}
            value={formData?.solarNotes ? formData?.solarNotes : ''}
         />
      </Panel>
   );
};

export default Solar;
