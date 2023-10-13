import React, { useState, useEffect } from 'react'
import { ActionProps } from './actionData'
import DropDown from '@/common/components/drop-down/DropDown'
import { fetchDbApi } from '@/serverActions'

const ActionModal = ({ options, onData }: ActionProps) => {
   const [productList, setProductList] = useState<any[]>([])
   const [selectedProduct, setSelectedProduct] = useState<any>(options?.selectedProduct)

   const [coordinatorRoleList, setCoordinatorRoleList] = useState<any[]>()
   const [selectedCoordinatorRole, setSelectedCoordinatorRole] = useState<any>(options?.selectedCoordinatorRole)

   const [howToAssign, setHowToAssign] = useState<any>(options?.howToAssign)

   const [roleList, setRoleList] = useState<any[]>([])
   const [selectedRole, setSelectedRole] = useState<any>(options?.selectedRole)

   const [userList, setUserList] = useState<any[]>([])
   const [selectedUser, setSelectedUser] = useState<any>(options?.selectedUser)

   useEffect(() => {
      onData({ selectedProduct, selectedCoordinatorRole, howToAssign, selectedRole, selectedUser })
   }, [selectedProduct, selectedCoordinatorRole, howToAssign, selectedRole, selectedUser])

   // on load get these lists
   useEffect(() => {
      // get the list of products
      fetchDbApi('/api/v2/products', {
         method: 'GET'
      }).then((res) => {
         // console.log('products', res)
         setProductList(res)
      })

      // get the list of roles
      fetchDbApi('/api/v2/roles', {
         method: 'GET'
      }).then((res) => {
         // console.log('roles', res)
         setRoleList(res)
      })

      // get the list of users
      fetchDbApi('/api/v2/users/', {
         method: 'GET'
      }).then((res) => {
         // console.log('res', res)
         setUserList(res)
      })
   }, [])


   return (
      <>
         {productList && (
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
                  setSelectedCoordinatorRole(null)
                  fetchDbApi(`/api/v2/products/${arg.id}/coordinators`, {
                     method: 'GET'
                  }).then((res) => {
                     const productCoordinators = res.map((prod: any) => (prod.productCoordinator))
                     setCoordinatorRoleList(productCoordinators)
                  })
               }}
            />
         )}

         {coordinatorRoleList && (<>
            <DropDown
               label='Coordinator Role'
               searchable={true}
               className='bg-color-white min-w-[160px]'
               placeholder='Select a Task'
               keyPath={['name']}
               selectedValues={selectedCoordinatorRole ? [selectedCoordinatorRole] : []}
               options={coordinatorRoleList}
               onOptionSelect={(e, arg) => setSelectedCoordinatorRole(arg)} />

            <DropDown
               label='Choose how to assign coordinator'
               keyPath={['text']}
               className='bg-color-white min-w-[160px]'
               placeholder='How to assign coordinator'
               selectedValues={howToAssign ? [howToAssign] : []}
               options={[
                  { id: '1', text: 'Round Robin' },
                  { id: '2', text: 'User Role' },
                  { id: '3', text: 'Specific User' }
               ]}
               onOptionSelect={(e, arg) => setHowToAssign(arg)}
            />

         </>)}

         {howToAssign?.id === '2' &&
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

         {howToAssign?.id === '3' &&
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

         <div className='mt-5'>Details</div>
         <div className='text-sm my-2'>The selected product coordinator role will be assigned to a user based on the specified assignment choice:</div>
         <ul className='list-disc ml-7 text-sm'>
            <li>Round Robin (Default): The role defined in the coordinator section of the Product Settings will be used, with specific users assigned by round robin.</li>
            <li>User Role: The role specified here will be used instead, with specific users assigned by Round Robin.</li>
            <li>Specific User: The specific user selected here will be assigned to the product coordinator role.</li>
         </ul>

      </>
   )
}

export default ActionModal
