'use client';
import Panel from '../../../../../../common/components/panel/Panel';
import { FieldOnLead, Section } from '../../../../../../common/types/Leads';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { selectPageContext, setPageContext } from '../../../../../../store/slices/pageContext';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { setAddToast } from '../../../../../../store/slices/toast';
import { fetchDbApi } from '@/serverActions';
import LeadFieldSection from './LeadFieldSection';

type Props = {};

const GeneralInformation = ({}: Props) => {
   const dispatch = useAppDispatch();
   const contextData = useAppSelector(selectPageContext);
   const { lead, newFieldsOnLeadData } = contextData;

   const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
   const [initialLoad, setInitialLoad] = useState<boolean>(true);
   const [sectionData, setSectionData] = useState<Section>();

   const [isLoading, setIsLoading] = useState<boolean>(false);

   const GENERAL_INFORMATION_SECTION_ID = 'b69283a9-6e48-465c-849f-562e15a4e20d';

   useEffect(() => {
      if (initialLoad && !isCollapsed) {
         setIsLoading(true);
         setInitialLoad(false);
         fetchDbApi(`/api/v2/leads/${lead?.id}/sections/${GENERAL_INFORMATION_SECTION_ID}`, {
            method: 'GET',
         })
            .then(async (result: any) => {
               setSectionData(result);
               setIsLoading(false);
            })
            .catch((err) => {
               console.error('err:', err);
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
         tempData.push({
            answer: e.target.value,
            leadId: lead?.id,
            leadFieldId: leadField.id,
         });
      }
      dispatch(
         setPageContext({
            ...contextData,
            newFieldsOnLeadData: [...tempData],
         })
      );
   };

   return (
      <Panel
         title='General Information'
         titleIconName='DocumentInfo'
         titleIconColor='gray'
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
            emptyStateText={'No General Information'}
         />
      </Panel>
   );
};

export default GeneralInformation;
