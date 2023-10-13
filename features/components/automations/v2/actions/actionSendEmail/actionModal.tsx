import React, { useState, useEffect } from 'react'
import { ActionProps } from './actionData'
import { set } from 'cypress/types/lodash'
import Input from '@/common/components/input/Input'
import Textarea from '@/common/components/textarea/Textarea'
import Grid from '@/common/components/grid/Grid'
import DropDown from '@/common/components/drop-down/DropDown'
import { fetchDbApi } from '@/serverActions'


const ActionModal = ({ options, onData }: ActionProps) => {
   const [emailRecipientType, setEmailRecipientType] = useState<any>(options?.emailRecipientType)

   const [productList, setProductList] = useState<any[]>([])
   const [selectedProduct, setSelectedProduct] = useState<any>(options?.selectedProduct)

   const [coordinatorRoleList, setCoordinatorRoleList] = useState<any[]>([])
   const [selectedCoordinatorRole, setSelectedCoordinatorRole] = useState<any>(options?.selectedCoordinatorRole)

   const [roleList, setRoleList] = useState<any[]>([])
   const [selectedRole, setSelectedRole] = useState<any>(options?.selectedRole)


   const [fromName, setFromName] = useState<string>(options?.fromName || '')
   const [fromEmail, setFromEmail] = useState<string>(options?.fromEmail || '')
   const [toEmail, setToEmail] = useState<string>(options?.toEmail || '')
   const [subject, setSubject] = useState<string>(options?.subject || '')
   const [message, setMessage] = useState<string>(options?.message || '')
   const [ccEmail, setCcEmail] = useState<string>(options?.ccEmail || '')

   useEffect(() => {
      onData({
         emailRecipientType,
         selectedProduct,
         selectedCoordinatorRole,
         selectedRole,
         fromName,
         fromEmail,
         toEmail,
         subject,
         message,
         ccEmail,
      })
   }, [emailRecipientType, selectedProduct, selectedCoordinatorRole, selectedRole, fromName, fromEmail, toEmail, subject, message, ccEmail])


   const handleEmailRecipientType = (value: any) => {
      setEmailRecipientType(value)
      setSelectedProduct(null)
      setSelectedCoordinatorRole(null)
      setSelectedRole(null)
      setToEmail('')

      // Coordinator
      if (value.id === '1' || value.id === '2') {
         // get the list of products
         fetchDbApi('/api/v2/products', {
            method: 'GET'
         }).then((res) => {
            setProductList(res)
         })
      }

      // Role
      if (value.id === '5') {
         // get the list of roles
         fetchDbApi('/api/v2/roles', {
            method: 'GET'
         }).then((res) => {
            // console.log('roles', res)
            setRoleList(res)
         })
      }
   }

   return (
      <>
         <DropDown
            label='Who is the email recipient?'
            searchable={false}
            className='bg-color-white min-w-[160px] mt-[10px]'
            placeholder='Select type of email recipient'
            keyPath={['status']}
            selectedValues={emailRecipientType ? [emailRecipientType] : []}
            options={[
               // { id: '1', status: 'Coordinator' },
               // { id: '2', status: 'Coordinator Team Lead' },
               { id: '3', status: 'Current Sales Rep/Lead Owner' },
               { id: '4', status: 'Lead' },
               { id: '5', status: 'Role' },
               { id: '6', status: 'Specific Email Address' },
            ]}
            onOptionSelect={(e, arg) => handleEmailRecipientType(arg)}
         />

         {(emailRecipientType?.id === '1' || emailRecipientType?.id === '2') &&
            <DropDown
               label='Product'
               searchable={true}
               className='bg-color-white min-w-[160px]'
               placeholder='Select an option'
               keyPath={['name']}
               selectedValues={selectedProduct ? [selectedProduct] : []}
               options={productList?.sort((a: any, b: any) => a.name?.localeCompare(b.name))}
               onOptionSelect={(e, arg) => {
                  setSelectedProduct((prev: any) => (arg))
                  fetchDbApi(`/api/v2/products/${arg.id}/coordinators`, {
                     method: 'GET'
                  }).then((res) => {
                     const productCoordinators = res.map((prod: any) => (prod.productCoordinator))
                     setCoordinatorRoleList(productCoordinators)
                  })
               }}
            />
         }

         {(emailRecipientType?.id === '1'
            || emailRecipientType?.id === '2')
            && selectedProduct
            && coordinatorRoleList && (<>
               <DropDown
                  label='Coordinator Role'
                  searchable={true}
                  className='bg-color-white min-w-[160px]'
                  placeholder='Select a Task'
                  keyPath={['name']}
                  selectedValues={selectedCoordinatorRole ? [selectedCoordinatorRole] : []}
                  options={coordinatorRoleList}
                  onOptionSelect={(e, arg) => setSelectedCoordinatorRole(arg)} />
            </>)}

         {emailRecipientType?.id === '5' && roleList &&
            <DropDown
               label='Role'
               searchable={true}
               className='bg-color-white min-w-[160px]'
               placeholder='Select a Role'
               keyPath={['name']}
               selectedValues={selectedRole ? [selectedRole] : []}
               options={roleList}
               onOptionSelect={(e, arg) => setSelectedRole(arg)}
            />
         }

         {emailRecipientType?.id === '6' &&
            <Input
               label='To Email Addresses (comma separated)'
               placeholder={'Enter Email Addresses'}
               value={toEmail || ''}
               onChange={(e) => setToEmail(e.target.value)}
            />
         }

         {(emailRecipientType?.id === '3'
            || emailRecipientType?.id === '4'
            || emailRecipientType?.id === '6'
            || selectedCoordinatorRole
            || selectedRole)
            && emailRecipientType && <>
               <div className='my-4 w-full h-[1px] bg-lum-secondary'></div>

               <Grid
                  columnCount={2}
                  columnMinWidth='100%'
                  columnGap={20}
                  rowGap={10}
                  breakPoint='lg'
                  responsive={false}
                  className='grid-component grid-rows-[max-content]'>

                  <Input
                     label='From Name'
                     placeholder={'From Name'}
                     value={fromName || ''}
                     onChange={(e) => setFromName(e.target.value)}></Input>

                  <Input
                     label='From Email Address'
                     placeholder={'From Email Address'}
                     value={fromEmail || ''}
                     onChange={(e) => setFromEmail(e.target.value)}></Input>

               </Grid>

               {/* This does not work yet */}
               {/* <Input
                  label='CC Email Address'
                  placeholder={'Enter CC Email Address (optional)'}
                  value={ccEmail || ''}
                  onChange={(e) => setCcEmail(e.target.value)}
               /> */}

               <Input
                  label='Subject Line'
                  placeholder={'Enter Subject Line'}
                  value={subject || ''}
                  onChange={(e) => setSubject(e.target.value)}
               />

               <Textarea label='Email Message Body'
                  placeholder={'Enter The Body of Your Message Here.'}
                  value={message || ''}
                  onChange={(e) => setMessage(e.target.value)}
               />
            </>
         }
      </>
   )
}

export default ActionModal
