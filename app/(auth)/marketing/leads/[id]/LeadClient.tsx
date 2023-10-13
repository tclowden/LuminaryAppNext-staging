'use client';
import Appointments from './(partials)/Appointments';
import CallLog from './(partials)/CallLog';
import CustomerInformation from './(partials)/CustomerInformation';
import GeneralInformation from './(partials)/GeneralInformation';
import History from './(partials)/History';
import NotesAttachments from './(partials)/NotesAttachments';
import Orders from './(partials)/Orders';
import Proposals from './(partials)/Proposals';
import Button from '../../../../../common/components/button/Button';
import CustomerProfile from './(partials)/CustomerProfile';
import PageContainer from '../../../../../common/components/page-container/PageContainer';
import Grid from '../../../../../common/components/grid/Grid';
import { selectPageContext, setPageContext } from '../../../../../store/slices/pageContext';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { useContext, useEffect, useState } from 'react';
import { selectUser } from '../../../../../store/slices/user';
import { FieldOnLead } from '../../../../../common/types/Leads';
import { setAddToast } from '../../../../../store/slices/toast';
import LoadingBackdrop from '../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';
import { fetchDbApi, triggerAutomation } from '@/serverActions';
import MessagesTab from './(partials)/MessagesTab';
import { setAcknowledgedByIds } from '@/store/slices/smsLogs';
import { TwilioContext } from '@/providers/TwilioProvider';
import { ActiveCall, selectActiveCall } from '@/store/slices/twilio';
import LeadStatusModal from './(partials)/LeadStatusModal';

type LeadClientProps = {};
const LeadClient = ({ }: LeadClientProps) => {
   const dispatch = useAppDispatch();
   const activeCall: ActiveCall = useAppSelector(selectActiveCall);
   const contextData = useAppSelector(selectPageContext);
   const user = useAppSelector(selectUser);

   const { makeOutboundCall } = useContext(TwilioContext);
   const { lead, originalFieldsOnLeadData, newFieldsOnLeadData } = contextData;

   const [hasChanges, setHasChanges] = useState<boolean>(false);
   const [newChanges, setNewChanges] = useState<any[]>([]);
   const [isSaving, setIsSaving] = useState<boolean>(false);
   const [isMessagesCollapsed, setIsMessagesCollapsed] = useState<boolean>(true);
   // const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);

   useEffect(() => {
      dispatch(
         setAcknowledgedByIds({ leadId: lead?.id, acknowledgedByIds: lead?.smsAcknowledgedBy?.acknowledgedByUserIds })
      );
   }, [lead.id]);

   useEffect(() => {
      const checkAnswer = (a: any, b: any) => a.answer === b.answer && a.leadField?.id === b.leadField?.id;

      const checkFields = (oldData: any, newData: any, compareFunction: (a: any, b: any) => boolean) =>
         oldData?.filter((oldField: any) => !newData.some((newField: any) => compareFunction(oldField, newField)));

      const newChanges = checkFields(newFieldsOnLeadData, originalFieldsOnLeadData, checkAnswer);

      setHasChanges(!!newChanges?.length);
      setNewChanges(newChanges);
   }, [newFieldsOnLeadData, originalFieldsOnLeadData]);

   // useEffect(() => {
   //    console.log('callJustEnded', activeCall);
   //    if (activeCall) setIsStatusModalOpen(true);
   // }, [activeCall]);

   const handleSaveChanges = () => {
      setIsSaving(true);
      fetchDbApi(`/api/v2/leads/${lead.id}/fields-on-lead`, {
         method: 'PUT',
         body: JSON.stringify({
            fieldsOnLead: [...newChanges],
         }),
      })
         .then(async (result: any) => {
            const leadData = await fetchDbApi(`/api/v2/leads/${lead.id}`, {
               method: 'GET',
            });
            const tempData = [...originalFieldsOnLeadData];
            if (result?.length) {
               result.forEach((newChangeField: FieldOnLead) => {
                  const foundField = tempData.find(
                     (field) => field?.id === newChangeField?.id || field?.leadFieldId === newChangeField?.leadFieldId
                  );
                  if (!foundField) {
                     tempData.push(newChangeField);
                  } else {
                     foundField.answer = newChangeField.answer;
                  }

                  const oldValue = originalFieldsOnLeadData.find(
                     (field: any) => field?.id === newChangeField?.id
                  )?.answer;
                  // trigger Field Update Automation
                  triggerAutomation.fire('field_updated', {
                     leadId: lead.id,
                     executorId: user.id,
                     newValue: newChangeField.answer,
                     prevValue: oldValue,
                     orderId: null,
                  });
               });
            }

            dispatch(setPageContext({ ...contextData, lead: leadData, originalFieldsOnLeadData: tempData }));
            // Accident???
            // dispatch(setPageContext({ ...contextData, lead: leadData, originalFieldsOnLeadData: [...tempData] }));
            setIsSaving(false);
            dispatch(
               setAddToast({
                  iconName: 'CheckMarkCircle',
                  details: [{ label: 'Success', text: 'Changes Saved' }],
                  variant: 'success',
                  autoCloseDelay: 5,
               })
            );
         })
         .catch((err) => {
            console.error(err);
            setIsSaving(false);
            dispatch(
               setAddToast({
                  iconName: 'XMarkCircle',
                  details: [{ label: 'Error', text: 'Changes Not Saved' }],
                  variant: 'danger',
                  autoCloseDelay: 5,
               })
            );
         });
   };

   const handleDiscardChanges = () => {
      dispatch(
         setPageContext({
            ...contextData,
            newFieldsOnLeadData: [...originalFieldsOnLeadData],
         })
      );
   };

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  {hasChanges && (
                     <>
                        <Button color={'blue'} onClick={handleSaveChanges}>
                           Save Changes
                        </Button>
                        <Button
                           color='gray:300'
                           iconName='BackArrow'
                           size='md'
                           onClick={handleDiscardChanges}
                           tooltipContent='Discard Changes'
                        />
                        <span className='w-[2px] h-[40px] bg-lum-gray-200 dark:bg-lum-gray-700' />
                     </>
                  )}
                  {lead?.phoneNumber && (
                     <>
                        <Button
                           color='green'
                           iconName='PhoneAngled'
                           size='md'
                           tooltipContent={`Call Lead`}
                           onClick={() => makeOutboundCall(lead?.phoneNumber)}
                        />
                        <Button
                           color='blue'
                           iconName='PaperAirplane'
                           size='md'
                           tooltipContent={`Message Lead`}
                           onClick={() => setIsMessagesCollapsed((prevState) => !prevState)}
                        />
                     </>
                  )}
               </>
            }
            breadcrumbsTitle={lead?.fullName}>
            <Grid>
               <CustomerProfile />
               <CustomerInformation />
               <NotesAttachments />
               <GeneralInformation />
               <Orders />
               <Proposals lead={lead} />
               <Appointments leadId={lead.id} />
               <CallLog />
               <History />
            </Grid>
         </PageContainer>
         <LoadingBackdrop isOpen={isSaving} />
         {lead?.phoneNumber && (
            <MessagesTab
               lead={lead}
               isCollapsed={isMessagesCollapsed}
               onCollapse={() => setIsMessagesCollapsed((prevState) => !prevState)}
            />
         )}
         {/* {isStatusModalOpen && (
            <LeadStatusModal
               isOpen={isStatusModalOpen}
               onClose={() => setIsStatusModalOpen(false)}
               leadId={lead.id}
               currentStatus={lead.status}
               onLeadStatusUpdate={function (status: any): void {
                  setIsStatusModalOpen(false);
               }}
            />
         )} */}
      </>
   );
};

export default LeadClient;

// Working on showing lead status model when call ends
