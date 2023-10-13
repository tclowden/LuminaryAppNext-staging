'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import Panel from '../../../../../../common/components/panel/Panel';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { selectPageContext, setPageContext } from '../../../../../../store/slices/pageContext';
import { FieldOnLead, Section } from '../../../../../../common/types/Leads';
import { setAddToast } from '../../../../../../store/slices/toast';
import { fetchDbApi } from '@/serverActions';
import LeadFieldSection from './LeadFieldSection';

const CustomerInformation = () => {
   const dispatch = useAppDispatch();
   const contextData = useAppSelector(selectPageContext);
   const { lead, newFieldsOnLeadData } = contextData;

   const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
   const [initialLoad, setInitialLoad] = useState<boolean>(true);
   const [sectionData, setSectionData] = useState<Section>();

   const [isLoading, setIsLoading] = useState<boolean>(false);

   const CUSTOMER_INFORMATION_SECTION_ID = 'f791dcfa-c40e-49f1-9143-41c61d175dd0';

   useEffect(() => {
      if (initialLoad && !isCollapsed) {
         setIsLoading(true);
         setInitialLoad(false);
         fetchDbApi(`/api/v2/leads/${lead?.id}/sections/${CUSTOMER_INFORMATION_SECTION_ID}`, {
            method: 'GET',
         })
            .then(async (res) => {
               setSectionData(res);
               setIsLoading(false);
            })
            .catch((err) => {
               console.error(err);
               setIsLoading(false);
               dispatch(
                  setAddToast({
                     iconName: 'XMarkCircle',
                     details: [{ label: 'Error', text: 'Could Not Get Data' }],
                     variant: 'danger',
                     autoCloseDelay: 5,
                  })
               );
            });
      }
   }, [isCollapsed]);

   const handleFieldOnLeadChange = async (e: any, leadField: any) => {
      const tempData = [...newFieldsOnLeadData];
      const existingFieldOnLead = tempData.find((fieldOnLead: FieldOnLead) => fieldOnLead.leadFieldId === leadField.id);
      if (existingFieldOnLead) {
         existingFieldOnLead.answer = e.target.value;
      } else {
         tempData.push({ answer: e.target.value, leadId: lead?.id, leadFieldId: leadField.id });
      }
      dispatch(setPageContext({ ...contextData, newFieldsOnLeadData: [...tempData] }));
   };

   return (
      <Panel
         title='Customer Information'
         titleIconName='CustomerInfo'
         titleIconColor='cyan'
         collapsible
         isCollapsed={isCollapsed}
         onCollapseBtnClick={(e: any) => {
            setIsCollapsed((prevState: boolean) => !prevState);
         }}>
         <LeadFieldSection
            sectionData={sectionData}
            isLoading={isLoading}
            newFieldsOnLeadData={newFieldsOnLeadData}
            handleFieldOnLeadChange={handleFieldOnLeadChange}
            emptyStateText={'No Customer Information'}
         />
      </Panel>
   );
};

export default CustomerInformation;
