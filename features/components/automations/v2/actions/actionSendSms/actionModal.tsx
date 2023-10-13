import React, { useState, useEffect } from 'react'
import { ActionProps } from './actionData'
import { set } from 'cypress/types/lodash'
import Input from '@/common/components/input/Input'
import Textarea from '@/common/components/textarea/Textarea'
import Grid from '@/common/components/grid/Grid'
import DropDown from '@/common/components/drop-down/DropDown'
import { fetchDbApi } from '@/serverActions'


const ActionModal = ({ options, onData }: ActionProps) => {
   const [smsRecipientType, setSmsRecipientType] = useState<any>(options?.smsRecipientType)

   const [productList, setProductList] = useState<any[]>([])
   const [selectedProduct, setSelectedProduct] = useState<any>(options?.selectedProduct)

   const [coordinatorRoleList, setCoordinatorRoleList] = useState<any[]>([])
   const [selectedCoordinatorRole, setSelectedCoordinatorRole] = useState<any>(options?.selectedCoordinatorRole)

   const [roleList, setRoleList] = useState<any[]>([])
   const [selectedRole, setSelectedRole] = useState<any>(options?.selectedRole)

   const [userList, setUserList] = useState<any[]>([])
   const [selectedUser, setSelectedUser] = useState<any>(options?.selectedUser)

   const [toSms, setToSms] = useState<string>(options?.toSms || '')
   const [message, setMessage] = useState<string>(options?.message || '')


   useEffect(() => {
      onData({
         smsRecipientType,
         selectedProduct,
         selectedCoordinatorRole,
         selectedRole,
         selectedUser,
         toSms,
         message,
      })
   }, [smsRecipientType, selectedProduct, selectedCoordinatorRole, selectedRole, selectedUser, toSms, message])


   const handleSmsRecipientType = (value: any) => {
      setSmsRecipientType(value)
      setSelectedProduct(null)
      setSelectedCoordinatorRole(null)
      setSelectedRole(null)
      setSelectedUser(null)

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

      // User
      if (value.id === '6') {
         // get the list of users
         fetchDbApi('/api/v2/users/', {
            method: 'GET'
         }).then((res) => {
            // console.log('res', res)
            setUserList(res)
         })
      }
   }

   return (
      <>
         <DropDown
            label='Who is the sms recipient?'
            searchable={false}
            className='bg-color-white min-w-[160px] mt-[10px]'
            placeholder='Select type of sms recipient'
            keyPath={['status']}
            selectedValues={smsRecipientType ? [smsRecipientType] : []}
            options={[
               { id: '1', status: 'Coordinator' },
               { id: '2', status: 'Coordinator Team Lead' },
               { id: '3', status: 'Current Sales Rep' },
               { id: '4', status: 'Lead' },
               { id: '5', status: 'Role' },
               { id: '6', status: 'Specific User' },
            ]}
            onOptionSelect={(e, arg) => handleSmsRecipientType(arg)}
         />

         {(smsRecipientType?.id === '1' || smsRecipientType?.id === '2') &&
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

         {(smsRecipientType?.id === '1'
            || smsRecipientType?.id === '2')
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

         {smsRecipientType?.id === '5' && roleList &&
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

         {smsRecipientType?.id === '6' &&
            <DropDown
               searchable={true}
               label='Select the user'
               keyPath={['fullName']}
               className='bg-color-white min-w-[160px]'
               placeholder='Select an option'
               selectedValues={selectedUser ? [selectedUser] : []}
               options={userList}
               onOptionSelect={(e, arg) => setSelectedUser(arg)}
            />
         }

         {(smsRecipientType?.id === '3'
            || smsRecipientType?.id === '4'
            || smsRecipientType?.id === '6'
            || selectedCoordinatorRole
            || selectedRole
            || selectedUser)
            && smsRecipientType && <>
               <div className='my-4 w-full h-[1px] bg-lum-secondary'></div>

               <Textarea label='SMS Message Body'
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
