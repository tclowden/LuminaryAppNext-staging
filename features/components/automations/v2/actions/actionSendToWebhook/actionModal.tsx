import React, { useState, useEffect } from 'react'
import { ActionProps } from './actionData'
import Grid from '@/common/components/grid/Grid'
import Input from '@/common/components/input/Input'
import DropDown from '@/common/components/drop-down/DropDown'
import Textarea from '@/common/components/textarea/Textarea'


const ActionModal = ({ options, onData }: ActionProps) => {

   // const [webhookType, setWebhookType] = useState<any>(options?.webhookType)

   const [webhookName, setWebhookName] = useState<string>(options?.webhookName || '')
   const [webhookUrl, setWebhookUrl] = useState<string>(options?.webhookUrl || '')
   // const [webhookMethod, setWebhookMethod] = useState<string>(options?.webhookMethod || '')
   const [webhookDescription, setWebhookDescription] = useState<string>(options?.webhookDescription || '')

   // const [webhookList, setWebhookList] = useState<any[]>([])
   // const [selectedWebhook, setSelectedWebhook] = useState<{
   //    name: string
   //    url: string
   //    method: string
   //    description: string
   // }>(options?.selectedWebhook)


   useEffect(() => {
      onData({ webhookName, webhookUrl, webhookDescription })
   }, [webhookName, webhookUrl, webhookDescription])

   return (
      <>
         {/* <DropDown
            label='Who is the sms recipient?'
            searchable={false}
            className='bg-color-white min-w-[160px] mt-[10px]'
            placeholder='Select type of sms recipient'
            keyPath={['status']}
            selectedValues={webhookType ? [webhookType] : []}
            options={[
               { id: '1', status: 'Saved Webhook' },
               { id: '2', status: 'New Webhook' },
            ]}
            onOptionSelect={(e, arg) => handleWebhookType(arg)}
         /> */}

         {/* {webhookType &&
            <div className='my-4 w-full h-[1px] bg-lum-secondary'></div>
         } */}

         {/* {webhookType?.id === '1' &&
            <DropDown
               label='Select webhook'
               searchable={false}
               className='bg-color-white min-w-[160px] mt-[10px]'
               placeholder='Webhook'
               keyPath={['status']}
               selectedValues={selectedWebhook ? [selectedWebhook] : []}
               options={webhookList}
               onOptionSelect={(e, arg) => setSelectedWebhook(arg)}
            />
         } */}

         {/* {webhookType?.id === '2' && <>
            Create New Webhook:
            <Grid
               columnCount={2}
               columnMinWidth='100%'
               columnGap={20}
               rowGap={10}
               breakPoint='lg'
               responsive={false}
               className='grid-component grid-rows-[max-content]'>

               <Input
                  label='Webhook Name'
                  placeholder={'Enter Webhook Name'}
                  value={webhookName || ''}
                  onChange={(e) => setWebhookName(e.target.value)}
               />

               <DropDown
                  label='Select a Method'
                  keyPath={['name']}
                  className='bg-color-white min-w-[160px]'
                  placeholder='Select a Method'
                  selectedValues={webhookMethod ? [webhookMethod] : []}
                  options={[
                     { name: 'POST' },
                     // { name: 'GET' }
                  ]}
                  onOptionSelect={(e, arg) => setWebhookMethod(arg)}
               />

            </Grid>

            <Input
               label='Webhook URL'
               placeholder={'Enter Webhook URL'}
               value={webhookUrl || ''}
               onChange={(e) => setWebhookUrl(e.target.value)}
            />

            <Textarea label='Webhook Description'
               placeholder={'Enter Webhook Description'}
               value={webhookDescription || ''}
               onChange={(e) => setWebhookDescription(e.target.value)}
            />
         </>} */}

         <Input
            label='Webhook Name'
            placeholder={'Enter Webhook Name'}
            value={webhookName || ''}
            onChange={(e) => setWebhookName(e.target.value)}
         />

         <Input
            label='Webhook URL'
            placeholder={'Enter Webhook URL'}
            value={webhookUrl || ''}
            onChange={(e) => setWebhookUrl(e.target.value)}
         />

         <Textarea label='Webhook Description'
            placeholder={'Enter Webhook Description'}
            value={webhookDescription || ''}
            onChange={(e) => setWebhookDescription(e.target.value)}
         />
      </>
   )
}

export default ActionModal
