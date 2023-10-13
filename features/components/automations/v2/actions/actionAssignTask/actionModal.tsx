import React, { useState, useEffect } from 'react'
import { ActionProps } from './actionData'
import DropDown from '@/common/components/drop-down/DropDown'
import { fetchDbApi } from '@/serverActions'
import { set } from 'cypress/types/lodash'

const ActionModal = ({ options, onData }: ActionProps) => {
   const [productList, setProductList] = useState<any[]>([])
   const [selectedProduct, setSelectedProduct] = useState<any>(options?.selectedProduct)

   const [taskList, setTaskList] = useState<any[]>()
   const [selectedTask, setSelectedTask] = useState<any>(options?.selectedTask)

   const [howToAssign, setHowToAssign] = useState<any>(options?.howToAssign)

   const [coordinatorRoleList, setCoordinatorRoleList] = useState<any[]>()
   const [selectedCoordinatorRole, setSelectedCoordinatorRole] = useState<any>(options?.selectedCoordinatorRole)

   const [roleList, setRoleList] = useState<any[]>([])
   const [selectedRole, setSelectedRole] = useState<any>(options?.selectedRole)

   const [userList, setUserList] = useState<any[]>([])
   const [selectedUser, setSelectedUser] = useState<any>(options?.selectedUser)


   useEffect(() => {
      onData({ selectedProduct, selectedTask, howToAssign, selectedCoordinatorRole, selectedRole, selectedUser })
   }, [selectedProduct, selectedTask, howToAssign, selectedCoordinatorRole, selectedRole, selectedUser])

   useEffect(() => {
      // get the list of products
      fetchDbApi('/api/v2/products', {
         method: 'GET'
      }).then((res) => {
         console.log('products', res)
         setProductList(res)
      })

      // get the list of users
      fetchDbApi('/api/v2/users/', {
         method: 'GET'
      }).then((res) => {
         // console.log('res', res)
         setUserList(res)
      })

      // get the list of roles
      fetchDbApi('/api/v2/roles', {
         method: 'GET'
      }).then((res) => {
         console.log('roles', res)
         setRoleList(res)
      })


      return () => {

      }
   }, [])

   const handleProductSelect = (value: any) => {
      setSelectedProduct((prev: any) => (value))
      setSelectedTask(null)
      console.log('productTasks: ', value)

      fetchDbApi(`/api/v2/products/${value.id}/tasks`, {
         method: 'GET'
      }).then((res) => {
         console.log('res: ', res)
         const updatedTasks = res.map((prod: any) => (prod.productTask))
         console.log('updatedTasks', updatedTasks)
         console.log('taskList', taskList)
         setTaskList(updatedTasks)
      })
   }

   const handleHowToAssignSelect = (value: any) => {
      console.log('value', value)
      if (value.id === '1' || value.id === '2') {
         fetchDbApi(`/api/v2/products/${selectedProduct.id}/coordinators`, {
            method: 'GET'
         }).then((res) => {
            const productCoordinators = res.map((prod: any) => (prod.productCoordinator))
            console.log('productCoordinators', productCoordinators)
            setCoordinatorRoleList(productCoordinators)
         })
      }

      setHowToAssign(value)
   }


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
               onOptionSelect={(e, arg) => handleProductSelect(arg)}
            />
         )}

         {taskList && (
            <DropDown
               label='Task'
               searchable={true}
               className='bg-color-white min-w-[160px]'
               placeholder='Select a Task'
               keyPath={['name']}
               selectedValues={selectedTask ? [selectedTask] : []}
               options={taskList}
               onOptionSelect={(e, arg) => setSelectedTask(arg)} />
         )}

         <div className='grid grid-cols-2 gap-3'>

            {taskList &&
               <DropDown
                  label='Assignee'
                  keyPath={['text']}
                  className='bg-color-white min-w-[160px]'
                  placeholder='How to assign coordinator'
                  selectedValues={howToAssign ? [howToAssign] : []}
                  options={[
                     { id: '1', text: 'Coordinator' },
                     { id: '2', text: 'Coordinator Team Lead' },
                     { id: '3', text: 'Current Sales Rep' },
                     { id: '4', text: 'Role - Random' },
                     { id: '5', text: 'Role - Round Robin' },
                     { id: '6', text: 'Specific User' },
                  ]}
                  onOptionSelect={(e, arg) => handleHowToAssignSelect(arg)}
               />
            }

            {howToAssign?.id === '1' && coordinatorRoleList &&
               <DropDown
                  searchable={true}
                  label='Select the type of Coordinator'
                  keyPath={['name']}
                  className='bg-color-white min-w-[160px]'
                  placeholder='Select an option'
                  selectedValues={selectedCoordinatorRole ? [selectedCoordinatorRole] : []}
                  options={coordinatorRoleList}
                  onOptionSelect={(e, arg) => setSelectedCoordinatorRole(arg)}
               />
            }

            {howToAssign?.id === '2' && coordinatorRoleList &&
               <DropDown
                  searchable={true}
                  label='Select the type of Coordinator Team Lead'
                  keyPath={['name']}
                  className='bg-color-white min-w-[160px]'
                  placeholder='Select an option'
                  selectedValues={selectedCoordinatorRole ? [selectedCoordinatorRole] : []}
                  options={coordinatorRoleList}
                  onOptionSelect={(e, arg) => setSelectedCoordinatorRole(arg)}
               />
            }

            {(howToAssign?.id === '4' || howToAssign?.id === '5') &&
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

            {howToAssign?.id === '6' &&
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

         </div>

      </>
   )
}

export default ActionModal
