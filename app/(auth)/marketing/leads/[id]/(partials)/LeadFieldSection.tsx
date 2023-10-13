import Button from '@/common/components/button/Button';
import DropDown from '@/common/components/drop-down/DropDown';
import Grid from '@/common/components/grid/Grid';
import Input from '@/common/components/input/Input';
import InputLoader from '@/common/components/skeleton-loaders/InputLoader';
import { FieldOnLead, LeadField, Section, Subsection } from '@/common/types/Leads';
import { TwilioContext } from '@/providers/TwilioProvider';
import { formatPhoneNumber } from '@/utilities/helpers';
import { useContext } from 'react';

type Props = {
   sectionData?: Section;
   isLoading: boolean;
   newFieldsOnLeadData: any;
   emptyStateText?: string;
   handleFieldOnLeadChange: (e: any, leadField: any) => void;
};

const LeadFieldSection = ({
   sectionData,
   isLoading,
   newFieldsOnLeadData,
   emptyStateText = 'No Data',
   handleFieldOnLeadChange,
}: Props) => {
   const { makeOutboundCall } = useContext(TwilioContext);

   return (
      <Grid>
         {isLoading ? (
            <Grid columnCount={4} responsive>
               <InputLoader count={8} />
            </Grid>
         ) : sectionData?.leadFieldsSubsections?.length ? (
            sectionData?.leadFieldsSubsections?.map((subsection: Subsection) => (
               <div key={subsection.id}>
                  <p>{subsection.name}</p>
                  <Grid columnCount={4} responsive>
                     {subsection?.leadFields.map((leadField: LeadField) => {
                        const fieldOnLeadAnswer = newFieldsOnLeadData.find(
                           (fieldOnLead: FieldOnLead) => fieldOnLead?.leadFieldId === leadField.id
                        );
                        const leadFieldType = leadField.fieldType.name;
                        if (leadFieldType === 'Dropdown') {
                           const selectedValues = fieldOnLeadAnswer?.answer
                              ? [{ value: fieldOnLeadAnswer?.answer }]
                              : [];
                           return (
                              <DropDown
                                 key={leadField?.id}
                                 label={leadField.label}
                                 placeholder={leadField.placeholder}
                                 keyPath={['value']}
                                 options={leadField.leadFieldOptions}
                                 selectedValues={selectedValues}
                                 onOptionSelect={(e, option) =>
                                    handleFieldOnLeadChange({ target: { value: option.value } }, leadField)
                                 }
                              />
                           );
                        } else if (leadFieldType === 'Phone Number') {
                           return (
                              <div className='flex gap-[5px] items-end' key={leadField?.id}>
                                 <Input
                                    type={'text'}
                                    label={leadField.label}
                                    placeholder={leadField.placeholder}
                                    value={formatPhoneNumber(fieldOnLeadAnswer?.answer) || ''}
                                    onChange={(e) => {
                                       const actualValue = e.target.value.replace(/\D/g, '');
                                       if (actualValue?.length >= 11) return;
                                       handleFieldOnLeadChange({ target: { value: actualValue } }, leadField);
                                    }}
                                 />
                                 <Button
                                    iconColor='white'
                                    iconName='PhoneAngled'
                                    color='green'
                                    size='md'
                                    disabled={!fieldOnLeadAnswer?.answer || fieldOnLeadAnswer?.answer?.length !== 10}
                                    onClick={() => makeOutboundCall(fieldOnLeadAnswer.answer)}
                                 />
                              </div>
                           );
                        } else {
                           return (
                              <Input
                                 key={leadField?.id}
                                 type={'text'}
                                 label={leadField.label}
                                 placeholder={leadField.placeholder}
                                 value={fieldOnLeadAnswer?.answer || ''}
                                 onChange={(e) => handleFieldOnLeadChange(e, leadField)}
                              />
                           );
                        }
                     })}
                  </Grid>
               </div>
            ))
         ) : (
            <div className='flex justify-center'>
               <span className='text-lum-gray-300'>{emptyStateText}</span>
            </div>
         )}
      </Grid>
   );
};

export default LeadFieldSection;
