'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

import Button from '../../../../../common/components/button/Button';
import Explainer from '../../../../../common/components/explainer/Explainer';
import Input from '../../../../../common/components/input/Input';
import Panel from '../../../../../common/components/panel/Panel';
import Textarea from '../../../../../common/components/textarea/Textarea';
import DropDown from '../../../../../common/components/drop-down/DropDown';
import LIContentEditable from './contentEditable';
import Tabs from '../../../../../common/components/tabs/Tabs';
import { fetchDbApi } from '@/serverActions';

const LIWebhookDetails = ({
   endpoint,
   runHistory,
}: {
   endpoint: { id: string; name: string; description: string; createdAt: Date; updatedAt: Date };
   runHistory: { id: string; dataIn: any; status: string; createdAt: Date; updatedAt: Date }[];
}) => {
   const router = useRouter();
   const [webhookName, setWebhookName] = useState<string | number | readonly string[] | undefined>(endpoint.name);
   const [webhookDescription, setWebhookDescription] = useState<string | number | readonly string[] | undefined>(
      endpoint.description
   );
   const [webhookTouched, setWebhookTouched] = useState<boolean>(false);

   const [selectedRequest, setSelectedRequest] = useState<any>(null);
   const [parsedRequest, setParsedRequest] = useState<any>(null);
   const [isParsedRequestPretty, setIsParsedRequestPretty] = useState<number>(1);

   // Send updated webhook information
   useEffect(() => {
      let debounceTimer: NodeJS.Timeout | null = null;

      if (webhookTouched && (webhookName !== '' || webhookDescription !== '')) {
         // Debounce
         debounceTimer = setTimeout(() => {
            fetchDbApi(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/leadIngestion/${endpoint.id}`, {
               method: 'PUT',
               body: JSON.stringify({ webhookName, webhookDescription, ertyertyertyerty: 'sdfgsdfg' }),
            }).then((res) => {
               console.log(res);
            });
         }, 500);
      }

      return () => {
         debounceTimer && clearTimeout(debounceTimer);
      };
   }, [webhookTouched, webhookName, webhookDescription]);

   // Parse selected request
   useEffect(() => {
      // Create a list of all the keys , key paths, and values from the payload
      function listKeyValuePairs(jsonObject: object) {
         let keyValuePairs: any[] = [];

         function traverseObject(obj: any, parentKey = '') {
            for (let key in obj) {
               if (obj.hasOwnProperty(key)) {
                  let nestedKey = parentKey ? parentKey + '.' + key : key;
                  let value = obj[key];
                  keyValuePairs.push({ key: key, keyPath: nestedKey, value: value });

                  if (typeof value === 'object') {
                     traverseObject(value, nestedKey);
                  } else {
                  }
               }
            }
         }

         traverseObject(jsonObject);
         return keyValuePairs;
      }

      const parsed = listKeyValuePairs(selectedRequest?.dataIn).sort((a, b) => (a.keyPath > b.keyPath ? 1 : -1));
      setParsedRequest(() => parsed);

      return () => {};
   }, [selectedRequest]);

   const handleInfoChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value, id } = event.target;
      if (id === 'webhookName') setWebhookName(value);
      if (id === 'webhookDesc') setWebhookDescription(value);
      if (!webhookTouched) setWebhookTouched(true);
   };

   const handleRequestOption = (e: any, selectedFieldType: any) => {
      setSelectedRequest(selectedFieldType);
   };

   return (
      <>
         <Panel title={'View Webhook Information'} collapsible>
            <span className='grid grid-cols-[1fr_auto] items-end gap-4'>
               <Input
                  label='Your Webhook URL:'
                  value={`${process.env.NEXT_PUBLIC_LUMINARY_URL}/api/v2/create-lead/${endpoint.id}`}
                  disabled
               />
               <Button>Copy</Button>
            </span>
            <Explainer description={'Name the webhook so you can find it later!'}>
               <Input id='webhookName' label='Webhook Name:' value={webhookName} onChange={handleInfoChange} />
            </Explainer>
            <Explainer description={'What is it that this webhook is for?'}>
               <Textarea
                  id='webhookDesc'
                  label='Webhook Description:'
                  value={webhookDescription}
                  onChange={handleInfoChange}
               />
            </Explainer>
         </Panel>

         <Panel
            title={'Recieve Data:'}
            collapsible
            // isCollapsed={true}
         >
            {runHistory && runHistory.length > 0 ? (
               <>
                  <div className='flex items-center justify-between'>
                     <p>We found a request!</p>
                     <div className='w-26'>
                        <Button size='sm' onClick={() => router.refresh()}>
                           Check for new requests
                        </Button>
                     </div>
                  </div>
                  <DropDown
                     name='requestSelection'
                     label='Select Request'
                     placeholder='Select a Request'
                     options={runHistory || []}
                     selectedValues={selectedRequest ? [selectedRequest] : []}
                     onOptionSelect={handleRequestOption}
                     keyPath={['id']}
                     required
                     className='z-20'
                  />

                  <div className='relative min-h-[40px] rounded bg-lum-gray-100 dark:bg-lum-gray-700 p-4 grid gap-1'>
                     <div className='absolute top-0 right-0'>
                        <Tabs
                           tabs={[{ name: 'Raw' }, { name: 'Pretty' }]}
                           activeTabIndex={isParsedRequestPretty}
                           setActiveTabIndex={setIsParsedRequestPretty}
                        />
                     </div>

                     {isParsedRequestPretty ? (
                        parsedRequest?.map(({ key, keyPath, value }: any) => (
                           <div key={keyPath} className='flex'>
                              <div className='group rounded text-lum-white min-h-[24px] max-h-[24px] mx-[2px] px-[5px] bg-lum-gray-450 hover:bg-lum-gray-350'>
                                 {keyPath}
                              </div>
                              <div className='mx-1'>{JSON.stringify(value)}</div>
                           </div>
                        ))
                     ) : (
                        <pre className='rounded bg-lum-gray-100 dark:bg-lum-gray-700 whitespace-pre'>
                           {JSON.stringify(selectedRequest?.dataIn, null, 2)}
                        </pre>
                     )}
                  </div>
               </>
            ) : (
               <>
                  <p>We are listening. Please send a request to the Webhook URL</p>
                  <div className='w-26'>
                     <Button onClick={() => router.refresh()}>Check for new requests</Button>
                  </div>
               </>
            )}
         </Panel>

         <Panel
            title={'Map Data:'}
            collapsible
            // isCollapsed={true}
         >
            <Explainer description={`Lead's Phone Number. This must be a valid ten digit US phone number.`}>
               <LIContentEditable label={'Phone Number:'} options={parsedRequest} required />
            </Explainer>
            <Explainer description={`What is the lead's first name?`}>
               <LIContentEditable label={'First Name:'} options={parsedRequest} />
            </Explainer>
            <Explainer description={`What is the lead's last name?`}>
               <LIContentEditable label={'Last Name:'} options={parsedRequest} />
            </Explainer>
            <Explainer description={`What is the lead's email address?`}>
               <LIContentEditable label={'Email Address:'} options={parsedRequest} />
            </Explainer>
            <Explainer description={`What street does the lead live on?`}>
               <LIContentEditable label={'Street Address:'} options={parsedRequest} />
            </Explainer>
            <Explainer description={`What city does the lead live in?`}>
               <LIContentEditable label={'City:'} options={parsedRequest} />
            </Explainer>
            <Explainer description={`What state does the lead live in?`}>
               <LIContentEditable label={'State:'} options={parsedRequest} />
            </Explainer>
            <Explainer description={`What is the lead's zipcode?`}>
               <LIContentEditable label={'Zip Code:'} options={parsedRequest} />
            </Explainer>
            <Explainer description={`Did the lead consent to receive SMS? If blank will default to 'False'`}>
               <LIContentEditable label={'SMS Consent:'} options={parsedRequest} />
            </Explainer>
         </Panel>

         {/* <Panel
            title={'Test Webhook:'}
            collapsible
            // isCollapsed={true}
         ></Panel> */}
      </>
   );
};

export default LIWebhookDetails;

// function getNestedProperty(obj: any, key: string) {
//    const keys = key.split('.');
//    let value = obj;

//    for (let i = 0; i < keys.length; i++) {
//       if (value && typeof value === 'object' && keys[i] in value) {
//          value = value[keys[i]];
//       } else {
//          return undefined;
//       }
//    }

//    return value;
// }

// const jsonObject = {
//    name: 'John',
//    age: 30,
//    address: {
//       street: '123 Main St',
//       city: 'New York',
//       country: { USA: 'test' },
//    },
//    hobbies: ['reading', 'painting'],
// };

// const jsonObject2 = {
//    // name: "John",
//    age: 30,
//    address: {
//       street: '123 Main St',
//       city: 'New York',
//       country: { USA: 'test' },
//    },
//    hobbies: ['reading', 'painting'],
// };

// const keyValuePairs = listKeyValuePairs(jsonObject);

// // console.log(keyValuePairs);

// const test = keyValuePairs.map((item , i) => {
//   const val = getNestedProperty(jsonObject2, item.key)
//   console.log(item.key, '=>', val)
//   return val
// })
