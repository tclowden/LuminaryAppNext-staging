'use client';
import React from 'react';
import DropDown from '../../../../../../../common/components/drop-down/DropDown';
import Explainer from '../../../../../../../common/components/explainer/Explainer';
import Grid from '../../../../../../../common/components/grid/Grid';
import Input from '../../../../../../../common/components/input/Input';
import { useAppSelector } from '../../../../../../../store/hooks';
import { selectPageContext } from '../../../../../../../store/slices/pageContext';

interface Props {
   handleChange: (e: any) => void;
   handleBlur: (e: any) => void;
   values: any;
   errors: any;
}

const TeamInfo = ({ errors, values, handleChange, handleBlur }: Props) => {
   const { teamTypes } = useAppSelector(selectPageContext);

   return (
      <Explainer title='Team Info' description='Give your team a name and select the type of team.'>
         {/* Depending on the type of team, select a product(s) associated to the team. */}
         {/* <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Team Info</div> */}
         <Grid columnCount={1} responsive>
            <Input
               type={'text'}
               data-test={'name'}
               label={'Team Name'}
               placeholder={'Ex) Warner Brothers'}
               value={values?.name ?? ''}
               onChange={handleChange}
               onBlur={handleBlur}
               name={'name'}
               required
               errorMessage={errors?.name}
            />
            <DropDown
               placeholder='ex) HVAC'
               options={teamTypes}
               keyPath={['name']}
               name={'teamType'}
               required
               label='Team Type'
               onOptionSelect={(e: any, selectedTeamType: any) => {
                  handleChange({ target: { type: 'text', value: selectedTeamType, name: 'teamType' } });
                  handleChange({ target: { type: 'text', value: selectedTeamType.id, name: 'teamTypeId' } });
               }}
               selectedValues={values?.teamType ? [values.teamType] : []}
               errorMessage={errors?.teamType}
               onBlur={handleBlur}
            />
         </Grid>
      </Explainer>
   );
};

export default TeamInfo;
