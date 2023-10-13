import Image from 'next/image';
import React from 'react';
import DropDown from '../../../../../../../common/components/drop-down/DropDown';
import Explainer from '../../../../../../../common/components/explainer/Explainer';
import Grid from '../../../../../../../common/components/grid/Grid';
import Input from '../../../../../../../common/components/input/Input';
import UploadFileButton from '../../../../../../../common/components/upload-file-button/UploadFileButton';
import { useAppDispatch, useAppSelector } from '../../../../../../../store/hooks';
import { selectPageContext } from '../../../../../../../store/slices/pageContext';
import { setAddToast } from '../../../../../../../store/slices/toast';
import { UserData, UserProps } from '../../types';
import defaultImageSrc from '../../../../../../../public/assets/images/profile.jpg';

interface Props {
   useFormProps: {
      values: any;
      errors: any;
      setValue: (name: string, value: any) => void;
      handleChange: (e: any) => void;
      handleBlur: (e: any) => void;
   };
   handleUploadImg: (e: any) => void;
}
const GeneralInfo = ({ useFormProps, handleUploadImg }: Props) => {
   const contextData: UserProps = useAppSelector(selectPageContext);
   const dispatch = useAppDispatch();
   const roles = contextData.rolesData;
   const offices = contextData.officesData;

   const handleRoleUnSelect = (e: any, roleToRemove: any) => {
      // make a copy
      let tempRolesOnUser = user?.rolesOnUser?.length ? [...user?.rolesOnUser] : [];
      tempRolesOnUser = tempRolesOnUser.map((roleOnUser) => ({
         ...roleOnUser,
         ...(roleOnUser?.roleId === roleToRemove?.id && { archived: true }),
      }));
      setValue('rolesOnUser', tempRolesOnUser);
   };

   const handleRoleSelect = (e: any, selectedRole: any) => {
      // make a copy of rolesOnUser array
      const tempRolesOnUser = user?.rolesOnUser?.length ? [...user?.rolesOnUser] : [];
      // see if the role already already exists within the user in the array, but is just archived
      const roleAlreadyExistsIndex = tempRolesOnUser.findIndex(
         (roleOnUser: any) => roleOnUser?.role?.id === selectedRole?.id
      );

      if (roleAlreadyExistsIndex !== -1) {
         // already exists... so set archived to false
         tempRolesOnUser[roleAlreadyExistsIndex]['archived'] = false;
         // move to the end of the array
         tempRolesOnUser.push(tempRolesOnUser.splice(roleAlreadyExistsIndex, 1)[0]);
      } else {
         // not found. add the role to the user creating a new roleOnUser obj
         tempRolesOnUser.push({
            role: selectedRole,
            roleId: selectedRole.id,
            userId: user?.id ?? null,
            archived: false,
            id: null,
         });
      }
      setValue('rolesOnUser', tempRolesOnUser);
   };
   const handleOfficeSelect = (e: any, selectedOffice: any) => {
      handleChange({ target: { type: 'text', value: selectedOffice.id, name: 'officeId' } });
      handleChange({ target: { type: 'text', value: selectedOffice, name: 'office' } });
   };
   const handleTeamLeadSelect = (e: any, selectedLeader: any) => {
      handleChange({ target: { type: 'text', value: selectedLeader.id, name: 'teamLeadId' } });
      handleChange({ target: { type: 'text', value: selectedLeader, name: 'teamLead' } });
   };
   const handleDivisionLeadSelect = (e: any, selectedDivisionLeader: any) => {
      handleChange({ target: { type: 'text', value: selectedDivisionLeader.id, name: 'divisionLeadId' } });
      handleChange({ target: { type: 'text', value: selectedDivisionLeader, name: 'divisionLead' } });
   };
   const handleSalesDirectorSelect = (e: any, selectedSalesDirector: any) => {
      handleChange({ target: { type: 'text', value: selectedSalesDirector.id, name: 'salesDirectorId' } });
      handleChange({ target: { type: 'text', value: selectedSalesDirector, name: 'salesDirector' } });
   };

   // use form props from parent component
   const { values: user, errors, handleChange, handleBlur, setValue } = useFormProps;

   const userRoles = user.rolesOnUser
      ?.filter((roleOnUser: any) => !roleOnUser.archived)
      .map((roleOnUser: any) => roleOnUser.role);

   return (
      <Grid>
         <Explainer title='User General Info' description='General user info'>
            <Grid columnCount={2} responsive>
               <>
                  <Input
                     label='First Name'
                     placeholder={'Enter First Name'}
                     value={user?.firstName || ''}
                     name={'firstName'}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     errorMessage={errors?.firstName}
                     required
                  />
                  <Input
                     label='Last Name'
                     placeholder={'Enter Last Name'}
                     value={user?.lastName || ''}
                     name={'lastName'}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     errorMessage={errors?.lastName}
                     required
                  />
               </>
               <>
                  <Input
                     label='Email Address'
                     placeholder={'Enter Email Address'}
                     value={user?.emailAddress || ''}
                     name={'emailAddress'}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     errorMessage={errors?.emailAddress}
                  />
                  <DropDown
                     label='Roles'
                     selectedValues={userRoles?.length ? userRoles : []}
                     options={roles || []}
                     keyPath={['name']}
                     placeholder='Select Role'
                     name='rolesOnUser'
                     onOptionSelect={(e: any, roleSelected: any) => {
                        const checked = e.target.checked;
                        // make sure they aren't checking the default role
                        if (roleSelected.id === '1df5344f-99f0-4450-a1ad-7a752e61aab8') {
                           // throw a toast error
                           return dispatch(
                              setAddToast({
                                 iconName: 'XMarkCircle',
                                 details: [{ label: 'Error', text: "Can't remove the default role from a user." }],
                                 variant: 'danger',
                                 autoCloseDelay: 5,
                              })
                           );
                        }

                        // need to uncheck
                        if (!checked) handleRoleUnSelect(e, roleSelected);
                        // need to check
                        else if (checked) handleRoleSelect(e, roleSelected);
                     }}
                     onBlur={handleBlur}
                     errorMessage={errors?.rolesOnUser}
                     multiSelect
                  />
               </>
               <>
                  <Input
                     label='Preferred First Name (if any)'
                     placeholder={'Ex) Matt'}
                     value={user?.preferredFirstName || ''}
                     name={'preferredFirstName'}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     errorMessage={errors?.preferredFirstName}
                  />
                  <DropDown
                     label='Office'
                     selectedValues={user?.office?.name ? [user.office] : []}
                     keyPath={['name']}
                     options={offices || []}
                     placeholder='Select Office'
                     name='office'
                     onOptionSelect={handleOfficeSelect}
                     onBlur={handleBlur}
                     errorMessage={errors?.office}
                  />
               </>
               {/* <Grid columnCount={2} responsive>
               <DropDown
                  label='Team Lead'
                  selectedValues={[]}
                  keyPath={['name']}
                  options={[]}
                  placeholder='Select Team Leader'
                  name='teamLead'
                  onOptionSelect={handleTeamLeadSelect}
                  onBlur={handleBlur}
                  errorMessage={errors?.teamLead}
               />
               <DropDown
                  label='Division Lead'
                  selectedValues={[]}
                  keyPath={['name']}
                  options={[]}
                  placeholder='Select Division Leader'
                  name='divisionLead'
                  onOptionSelect={handleDivisionLeadSelect}
                  onBlur={handleBlur}
                  errorMessage={errors?.divisionLead}
               />
            </Grid>
            <Grid columnCount={2} responsive>
               <DropDown
                  label='Sales Director'
                  selectedValues={[]}
                  keyPath={['name']}
                  options={[]}
                  placeholder='Select Sales Director'
                  name='salesDirector'
                  onOptionSelect={handleSalesDirectorSelect}
                  onBlur={handleBlur}
                  errorMessage={errors?.salesDirector}
               />
            </Grid> */}
               {useFormProps?.values?.id && (
                  <Grid colSpan={2} responsive>
                     <Input
                        label='Profile Picture URL'
                        placeholder={'Enter your profile picture url'}
                        value={user?.profileUrl || ''}
                        name={'profileUrl'}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errorMessage={errors?.profileUrl}
                     />
                     <UploadFileButton
                        onInput={(e: any) => {
                           // upload the image
                           handleUploadImg(e);
                        }}
                        accept={'.gif, .jpg, .png, .webp'}
                        buttonClassName={`max-w-[200px]`}>
                        Upload Img
                     </UploadFileButton>
                     {/* <Image src={user?.profileUrl || ''} alt={'user profile image'} width={100} height={100} /> */}
                     <div className='relative w-[74px] h-[74px]'>
                        <Image
                           className='rounded-full'
                           src={user?.profileUrl || defaultImageSrc}
                           alt='User Profile Image'
                           style={{ objectFit: 'cover' }}
                           fill
                        />
                     </div>
                  </Grid>
               )}
            </Grid>
         </Explainer>
      </Grid>
   );
};

export default GeneralInfo;
