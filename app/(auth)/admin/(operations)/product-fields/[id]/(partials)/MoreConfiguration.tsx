'use client';
import DropDown from '@/common/components/drop-down/DropDown';
import Explainer from '@/common/components/explainer/Explainer';
import Grid from '@/common/components/grid/Grid';
import React, { useEffect, useState } from 'react';

interface Props {
   originalWhereCondition: any;
   values: any;
   handleChange: (e: any) => void;
   handleBlur: (e: any) => void;
   errors: any;

   roles?: Array<any>;
}

const MoreConfiguration = ({ originalWhereCondition, values, handleBlur, handleChange, errors, roles }: Props) => {
   // store the curr condition to lean back on curr database state
   const [initLoad, setInitLoad] = useState<boolean>(true);
   const proposalOptionsGrouping = [{ name: 'Lead' }];

   const usersConfiguredList =
      values?.configuredList && values?.configuredList?.tableName === 'users' && !!roles?.length;
   const proposalOptionsConfiguredList =
      values?.configuredList && values?.configuredList?.tableName === 'proposalOptions';

   useEffect(() => {
      if (!initLoad || (initLoad && !originalWhereCondition?.listType)) {
         let val = null;
         if (originalWhereCondition?.listType === values?.configuredList?.tableName)
            val = { ...originalWhereCondition };
         else if (values?.configuredList?.tableName === 'proposalOptions') {
            val = { listType: values?.configuredList?.tableName, fkToGroupBy: { name: 'Lead' } };
         } else val = { listType: values?.configuredList?.tableName };
         handleChange({ target: { type: 'text', name: 'whereCondition', value: val } });
      } else setInitLoad(false);
   }, [values?.configuredList]);

   return (
      <Explainer description='Build condition for the configured list selection...'>
         {usersConfiguredList && (
            <Grid columnCount={1}>
               <DropDown
                  searchable
                  label='Options Limited To The Following Roles (5 Max):'
                  options={roles}
                  selectedValues={values?.whereCondition?.roles ? values?.whereCondition?.roles : []}
                  multiSelect
                  placeholder='Ex. Admin'
                  keyPath={['name']}
                  // name is for error validation when using the useForm hook
                  name='whereCondition.roles'
                  onOptionSelect={(e: any, roleToAdd: any) => {
                     let rolesArr = values?.whereCondition?.roles?.length ? [...values?.whereCondition?.roles] : [];

                     // see if role already exists.. if so remove it, else add it
                     const roleAlreadyExists = rolesArr?.findIndex((r: any) => r?.id === roleToAdd?.id);
                     if (!!rolesArr?.length && roleAlreadyExists !== -1) {
                        rolesArr?.splice(roleAlreadyExists, 1);
                     } else {
                        rolesArr = [...rolesArr, roleToAdd];
                     }

                     const val = { roles: rolesArr, listType: 'users' };
                     handleChange({ target: { type: 'text', value: val, name: 'whereCondition' } });
                  }}
                  onBlur={handleBlur}
                  errorMessage={errors['whereCondition.roles']}
                  required
               />
            </Grid>
         )}

         {/* {console.log('values?.whereCondition?.fkToGroupBy:', values?.whereCondition?.fkToGroupBy)} */}
         {proposalOptionsConfiguredList && (
            <Grid columnCount={1}>
               <DropDown
                  searchable
                  label='Options Limited To:'
                  options={proposalOptionsGrouping}
                  selectedValues={
                     values?.whereCondition?.fkToGroupBy ? [values?.whereCondition?.fkToGroupBy] : [{ name: 'Lead' }]
                  }
                  placeholder='Proposals are only limited to the applicable lead.'
                  keyPath={['name']}
                  // name is for error validation when using the useForm hook
                  name='whereCondition.fkToGroupBy'
                  onOptionSelect={(e: any, fk: any) => {
                     const val = { fkToGroupBy: fk, listType: 'proposalOptions' };
                     handleChange({ target: { type: 'text', value: val, name: 'whereCondition' } });
                  }}
                  onBlur={handleBlur}
                  errorMessage={errors['whereCondition.fkToGroupBy']}
                  // required
                  disabled
               />
            </Grid>
         )}
      </Explainer>
   );
};

export default MoreConfiguration;
