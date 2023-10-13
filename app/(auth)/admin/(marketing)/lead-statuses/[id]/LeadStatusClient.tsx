'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../../../../../../common/components/button/Button';
import ChipButton from '../../../../../../common/components/chip-button/ChipButton';
import Chip from '../../../../../../common/components/chip/Chip';
import Explainer from '../../../../../../common/components/explainer/Explainer';
import Grid from '../../../../../../common/components/grid/Grid';
import Input from '../../../../../../common/components/input/Input';
import PageContainer from '../../../../../../common/components/page-container/PageContainer';
import Panel from '../../../../../../common/components/panel/Panel';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import { setAddToast } from '@/store/slices/toast';

type Props = {
   leadStatus: any;
   statusRuleTypes: any;
};

const LeadStatusClient = ({ leadStatus, statusRuleTypes }: Props) => {
   const user = useAppSelector(selectUser);
   const router = useRouter();
   const dispatch = useAppDispatch();
   const [statusName, setStatusName] = useState<string>(leadStatus?.name);
   const [activeStatusRules, setActiveStatusRules] = useState<any[]>([...leadStatus?.rulesOnStatuses]);
   const [allStatusRules, setAllStatusRules] = useState<string[] | []>([...statusRuleTypes]);
   const [requiredCalls, setRequiredCalls] = useState<number>(leadStatus?.statusMetaData?.requiredNumberOfCalls || 0);
   const [webhookUrl, setWebhookUrl] = useState<string | null>(leadStatus?.statusMetaData?.webhookUrl);

   useEffect(() => {
      const rulesFoundOnStatus = leadStatus.rulesOnStatuses.map((rule: any) => {
         return {
            id: rule.statusRulesType.id,
            name: rule.statusRulesType.name,
         };
      });
      setActiveStatusRules(rulesFoundOnStatus);
   }, []);

   const handleAddRule = (e: any, newRule: any) => {
      // Check if the selected rule already exists in the statusRules
      const ruleExists = activeStatusRules.some((rule) => rule.id === newRule.id);

      // If it doesn't exist, add the new rule to the statusRules
      if (!ruleExists) {
         setActiveStatusRules((prevRules) => [...prevRules, newRule]);
      }
   };

   const handleRemoveRule = (e: any, ruleToRemove: any) => {
      const updatedRules = activeStatusRules.filter((rule) => rule.id !== ruleToRemove.id);
      setActiveStatusRules(updatedRules);
   };

   const handleSubmit = async () => {
      const rulesOnStatus = [...activeStatusRules];
      await fetch(`/api/v2/statuses/${leadStatus.id}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
         body: JSON.stringify({
            userId: user.id,
            requiredNumberOfCalls: requiredCalls,
            webhookUrl: webhookUrl,
            statusName: statusName,
            rulesOnStatus: rulesOnStatus,
         }),
      })
         .then(async (res) => {
            const response = await res;
            const data = await res.json();

            console.log('data: ', data);

            if (response.ok) {
               dispatch(
                  setAddToast({
                     details: [{ label: 'Success', text: 'Status Updated!' }],
                     iconName: 'CheckMarkCircle',
                     variant: 'success',
                     autoCloseDelay: 5,
                  })
               );
               router.push(`/admin/lead-statuses`);
            }
         })
         .catch((err: any) => console.log(err));
   };

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Button color='blue' onClick={handleSubmit} disabled={false}>
                     Save
                  </Button>
                  <Button color='white' onClick={() => router.back()}>
                     Cancel
                  </Button>
               </>
            }
            breadcrumbsTitle={statusName}>
            <Grid>
               <Panel title={statusName} titleSize={'lg'}>
                  <Grid columnCount={2}>
                     <Grid>
                        <span>LEADS IN STATUS</span>
                        <span>{leadStatus?.leadCount}</span>
                     </Grid>
                     <Grid>
                        <span>STATUS TYPE</span>
                        <span>{leadStatus.statusType.name}</span>
                     </Grid>
                  </Grid>
               </Panel>
               <Explainer
                  title='Status Settings'
                  description='Give your Status a name, select status attributes and specify required dials.'>
                  <Grid>
                     <Input
                        label='Status Name'
                        placeholder='Status Name...'
                        value={statusName}
                        onChange={(e: any) => setStatusName(e.target.value)}
                     />
                     <hr className='my-[15px] border-lum-gray-100 dark:border-lum-gray-600' />
                     <span>Rules</span>
                     <div>
                        <span className='flex flex-row justify-between p-[5px] items-center'>
                           <p>Status Attributes</p>
                           <ChipButton
                              options={allStatusRules}
                              textKeyPath={['name']}
                              onOptionSelect={handleAddRule}
                              chipBtnText={'+ Attribute'}
                           />
                        </span>
                        <div className='flex flex-wrap gap-[5px]'>
                           {activeStatusRules &&
                              activeStatusRules.map((rule: any, index: number) => (
                                 <Chip
                                    key={index}
                                    value={rule.name}
                                    onClick={(e) => handleRemoveRule(e, rule)}
                                    color='blue'
                                 />
                              ))}
                        </div>
                     </div>
                     <Input
                        label='Dials Required'
                        placeholder={'e.g. 4...'}
                        value={requiredCalls}
                        onChange={(e: any) => {
                           setRequiredCalls(e.target.value);
                        }}
                     />
                  </Grid>
               </Explainer>

               <Explainer
                  title='External Webhook'
                  description={`Luminary will post to the provided webhook when a lead is statused as ${leadStatus.name}`}>
                  <Input
                     label='Webhook'
                     placeholder={'https://my-zapier...'}
                     value={webhookUrl || ''}
                     onChange={(e: any) => {
                        console.log('e.target.val: ', e.target.value);
                        setWebhookUrl(e.target.value);
                     }}></Input>
               </Explainer>

               <Explainer
                  title='Status Options'
                  description={`When a lead's status is being updated from this status, these checked options are the statuses the user will choose from.`}>
                  <Grid>
                     <span>Status Options</span>
                     <Grid></Grid>
                  </Grid>
               </Explainer>
            </Grid>
         </PageContainer>
      </>
   );
};

export default LeadStatusClient;
function dispatch(arg0: any) {
   throw new Error('Function not implemented.');
}
