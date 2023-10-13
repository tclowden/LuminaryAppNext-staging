'use client';

import { fetchDbApi } from '@/serverActions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ButtonOptionSelector from '../../../../../../common/components/button-option-selector/ButtonOptionSelector';
import Button from '../../../../../../common/components/button/Button';
import Checkbox from '../../../../../../common/components/checkbox/Checkbox';
import Grid from '../../../../../../common/components/grid/Grid';
import Input from '../../../../../../common/components/input/Input';
import LoadingBackdrop from '../../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';
import PageContainer from '../../../../../../common/components/page-container/PageContainer';
import Panel from '../../../../../../common/components/panel/Panel';
import Table from '../../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../../common/components/table/tableTypes';
import { LeadField, Section, Subsection } from '../../../../../../common/types/Leads';
import { useAppDispatch, useAppSelector } from '../../../../../../store/hooks';
import { setAddToast } from '../../../../../../store/slices/toast';
import { selectUser } from '../../../../../../store/slices/user';
import { findMinMaxValueInArray, getObjectProp, lumId } from '../../../../../../utilities/helpers';

const columns: ColumnType[] = [
   {
      keyPath: ['type'],
      title: 'Input Type',
      colSpan: 1,
   },
   {
      keyPath: ['label'],
      title: 'Field Label',
      colSpan: 2,
   },
   {
      keyPath: ['placeholder'],
      title: 'Placeholder Text',
      colSpan: 2,
   },
   {
      keyPath: ['required'],
      title: 'Required',
      colSpan: 2,
      render: ({ item, callback }) => <Checkbox name={'required'} checked={!!item?.required} onChange={callback} />,
   },
];

type Props = {
   leadFieldsSectionData: Section;
   leadFieldsData: Array<LeadField>;
};

const LeadFieldsSectionClient = ({ leadFieldsSectionData, leadFieldsData }: Props) => {
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);
   const router = useRouter();
   const sectionId = leadFieldsSectionData?.id;

   const [isSaving, setIsSaving] = useState<boolean>(false);

   const [subsections, setSubsections] = useState<Array<Subsection>>([]);
   const [leadFields, setLeadFields] = useState<Array<LeadField>>([]);

   useEffect(() => {
      setSubsections(() =>
         ({ ...leadFieldsSectionData }?.leadFieldsSubsections.sort((a, b) => a.displayOrder - b.displayOrder))
      );
      setLeadFields(() => leadFieldsData);
   }, [leadFieldsSectionData, leadFieldsData]);

   const addTableItemConfig = (leadFieldsData: Array<LeadField>) => {
      const { min, max } = findMinMaxValueInArray(leadFieldsData, ['displayOrder']);
      return leadFieldsData
         .sort((a, b) => a?.displayOrder - b?.displayOrder)
         .map((leadField: LeadField) => ({
            ...leadField,
            type: {
               value: getObjectProp(leadField, ['fieldType', 'name']),
               iconConfig: {
                  name: getObjectProp(leadField, ['fieldType', 'iconName']),
                  color: getObjectProp(leadField, ['fieldType', 'iconColor']),
               },
            },
            actionsConfig: {
               moveup: !(leadField?.displayOrder === min),
               movedown: !(leadField?.displayOrder === max),
               delete: true,
            },
         }));
   };

   const handleActionClick = ({ actionKey, item, newData }: any, subsectionToHandle: Subsection) => {
      const subsectionId = subsectionToHandle?.id || subsectionToHandle?.tempId;
      if (!subsectionId) return;

      switch (actionKey) {
         case 'moveup':
         case 'movedown':
            setLeadFields((prevState) => {
               const tempState = [...prevState];
               const foundLeadField = tempState.find((leadField) => leadField?.id === item?.id);
               // the argument 'item' is the newly updated leadField and will have the newly updated displayOrder. The item.displayOrder will match the displayOrder of the sibling leadField in the previous state data
               const siblingLeadField = tempState.find(
                  (leadField) =>
                     leadField?.subsectionId === subsectionId && leadField?.displayOrder === item?.displayOrder
               );
               if (!foundLeadField || !siblingLeadField) return tempState;
               siblingLeadField.displayOrder = foundLeadField?.displayOrder;
               foundLeadField.displayOrder = item?.displayOrder;
               return tempState;
            });
            break;
         case 'delete':
            setLeadFields((prevState) => {
               const tempState = [...prevState];
               const foundLeadField = tempState.find((leadField) => leadField?.id === item?.id);
               if (!foundLeadField) return tempState;
               foundLeadField.subsectionId = null;
               return tempState;
            });
            break;
         default:
            console.log('Action not recognized');
            break;
      }
   };

   const handleCellEvent = ({ item }: { item: LeadField }, cellSubsection: Subsection) => {
      setLeadFields((prevState) => {
         const tempState = [...prevState];
         const foundLeadField = tempState.find((leadField) => leadField?.id === item?.id);
         if (!foundLeadField) return tempState;
         foundLeadField.required = !foundLeadField?.required;
         return tempState;
      });
   };

   const handleSubsectionTitleChange = (e: any, subsectionToChange: Subsection) => {
      setSubsections((prevState: Array<Subsection>) => {
         const tempSubsections = [...prevState];
         const foundSubsection = tempSubsections.find(
            (subsection: Subsection) => subsection?.displayOrder === subsectionToChange?.displayOrder
         );
         if (!foundSubsection) return tempSubsections;
         foundSubsection.name = e.target.value;
         return tempSubsections;
      });
   };
   const handleSortSubsections = (direction: 'up' | 'down', subsectionToSort: Subsection) => {
      setSubsections((prevState: Array<Subsection>) => {
         const tempSubsections = [...prevState];
         const currentSubsectionIndex = tempSubsections.findIndex(
            (subsection: Subsection) => subsection?.displayOrder === subsectionToSort?.displayOrder
         );
         const siblingSubsectionIndex = direction === 'up' ? currentSubsectionIndex - 1 : currentSubsectionIndex + 1;

         if (!tempSubsections[siblingSubsectionIndex]) return tempSubsections;
         const currentSubsectionDisplayOrder = tempSubsections[currentSubsectionIndex]?.displayOrder;
         const siblingSubsectionDisplayOrder = tempSubsections[siblingSubsectionIndex]?.displayOrder;

         tempSubsections[currentSubsectionIndex].displayOrder = siblingSubsectionDisplayOrder;
         tempSubsections[siblingSubsectionIndex].displayOrder = currentSubsectionDisplayOrder;

         return tempSubsections.sort((a, b) => a.displayOrder - b.displayOrder);
      });
   };

   const handleDeleteSubsection = (subsectionToDelete: Subsection) => {
      const subsectionId = subsectionToDelete?.id || subsectionToDelete?.tempId;
      if (!subsectionId) return;
      setSubsections((prevState: Array<Subsection>) => {
         const tempSubsections = [...prevState];
         if (subsectionToDelete?.id) {
            const foundSubsection = tempSubsections.find((subsection) => subsection?.id === subsectionToDelete.id);
            if (!foundSubsection) return tempSubsections;
            foundSubsection.archived = true;
            return tempSubsections;
         } else if (subsectionToDelete?.tempId) {
            return tempSubsections.filter(
               (subsection: Subsection) => subsection?.displayOrder !== subsectionToDelete?.displayOrder
            );
         } else {
            return tempSubsections;
         }
      });
      setLeadFields((prevState) =>
         [...prevState].map((leadField) => {
            if (leadField?.subsectionId === subsectionId) {
               return { ...leadField, subsectionId: null };
            } else return leadField;
         })
      );
   };

   const handleAddField = (e: any, fieldToAdd: LeadField, subsectionToAddTo: Subsection) => {
      const subsectionId = subsectionToAddTo?.id || subsectionToAddTo?.tempId;
      if (!subsectionId) return;
      setLeadFields((prevState) => {
         const tempState = [...prevState];

         const subsectionLeadFields = leadFields.filter((leadField) => leadField?.subsectionId === subsectionId);
         const { max } = findMinMaxValueInArray(subsectionLeadFields, ['displayOrder']);

         const foundLeadField = tempState.find((leadField) => leadField?.id === fieldToAdd?.id);
         if (!foundLeadField) return tempState;
         foundLeadField.subsectionId = subsectionId;
         foundLeadField.displayOrder = (max || 0) + 1;

         return addTableItemConfig(tempState);
      });
   };

   const handleAddSubsection = () => {
      setSubsections((prevState: Array<Subsection>) => {
         const tempId = lumId();
         const { max } = findMinMaxValueInArray(prevState, ['displayOrder']);
         return [
            ...prevState,
            {
               tempId,
               name: '',
               archived: false,
               sectionId: sectionId,
               leadFields: [],
               displayOrder: (max || 0) + 1,
            },
         ];
      });
   };

   const handleSave = (e: any) => {
      setIsSaving(true);

      fetchDbApi(`/api/v2/leads/sections/${sectionId}`, {
         method: 'PUT',
         body: JSON.stringify({ subsections, leadFields }),
      })
         .then(() => {
            setIsSaving(false);
            router.push('/admin/lead-sections');
            dispatch(
               setAddToast({
                  iconName: 'CheckMarkCircle',
                  details: [{ label: 'Success', text: 'Section Updated' }],
                  variant: 'success',
                  autoCloseDelay: 5,
               })
            );
         })
         .catch((err) => {
            console.error('err:', err);
            setIsSaving(false);
            dispatch(
               setAddToast({
                  iconName: 'XMarkCircle',
                  details: [{ label: 'Error', text: 'Section Was Not Updated' }],
                  variant: 'danger',
                  autoCloseDelay: 5,
               })
            );
         });
   };

   const availableLeadFields = leadFields.filter((leadField: LeadField) => !leadField?.subsectionId);

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Button color='blue' onClick={() => handleSave(subsections)}>
                     Save
                  </Button>
                  <Button color='white' onClick={() => router.back()}>
                     Cancel
                  </Button>
               </>
            }
            breadcrumbsTitle={leadFieldsSectionData?.name}>
            <Grid>
               {subsections
                  .filter((subsection) => !subsection?.archived)
                  .map((subsection: Subsection) => {
                     const subsectionId = subsection?.id || subsection?.tempId;
                     if (!subsectionId) return;
                     const subsectionLeadFields = addTableItemConfig(
                        leadFields.filter((leadField) => leadField?.subsectionId === subsectionId)
                     );
                     const { min, max } = findMinMaxValueInArray(
                        subsections.filter((subsection) => !subsection?.archived),
                        ['displayOrder']
                     );
                     return (
                        <Panel
                           key={subsection.displayOrder}
                           title={
                              <Input
                                 placeholder='Subsection Name...'
                                 value={subsection.name}
                                 onChange={(e) => handleSubsectionTitleChange(e, subsection)}
                              />
                           }
                           topRightChildren={
                              <>
                                 <Button
                                    iconName='UnionUp'
                                    color='transparent'
                                    iconColor={'gray:350'}
                                    disabled={subsection?.displayOrder === min}
                                    onClick={() => handleSortSubsections('up', subsection)}
                                    tooltipContent={'Move Up'}
                                 />
                                 <Button
                                    iconName='UnionDown'
                                    color='transparent'
                                    iconColor={'gray:350'}
                                    disabled={subsection?.displayOrder === max}
                                    onClick={() => handleSortSubsections('down', subsection)}
                                    tooltipContent={'Move Down'}
                                 />
                                 <Button
                                    iconName='TrashCan'
                                    color='transparent'
                                    iconColor={'gray:350'}
                                    onClick={() => handleDeleteSubsection(subsection)}
                                    tooltipContent={'Delete Subsection'}
                                 />
                              </>
                           }>
                           <Table
                              theme='secondary'
                              columns={columns}
                              data={subsectionLeadFields}
                              emptyStateDisplayText={'No Fields'}
                              rowReorder
                              rowReorderKeyPath={['displayOrder']}
                              onCellEvent={(cellEventObj) => handleCellEvent(cellEventObj, subsection)}
                              actions={[
                                 {
                                    icon: 'UnionUp',
                                    actionKey: 'moveup',
                                    toolTip: 'Move Up',
                                    callback: (actionObj) => handleActionClick(actionObj, subsection),
                                 },
                                 {
                                    icon: 'UnionDown',
                                    actionKey: 'movedown',
                                    toolTip: 'Move Down',
                                    callback: (actionObj) => handleActionClick(actionObj, subsection),
                                 },
                                 {
                                    icon: 'TrashCan',
                                    actionKey: 'delete',
                                    toolTip: 'Remove Field',
                                    callback: (actionObj) => handleActionClick(actionObj, subsection),
                                 },
                              ]}
                           />
                           <div className='flex justify-center items-center py-[5px] rounded bg-lum-gray-50 dark:bg-lum-gray-700 relative'>
                              <ButtonOptionSelector
                                 keyPath={['label']}
                                 options={availableLeadFields}
                                 onOptionSelect={(e: any, arg: any) => {
                                    handleAddField(e, arg, subsection);
                                 }}
                                 searchable>
                                 Add Field
                              </ButtonOptionSelector>
                           </div>
                        </Panel>
                     );
                  })}
               <div className='flex justify-center items-center py-[5px] rounded bg-lum-gray-50 dark:bg-lum-gray-700 relative'>
                  <Button size='sm' color='blue' onClick={handleAddSubsection}>
                     Add Subsection
                  </Button>
               </div>
            </Grid>
         </PageContainer>
         <LoadingBackdrop isOpen={isSaving} />
      </>
   );
};

export default LeadFieldsSectionClient;
