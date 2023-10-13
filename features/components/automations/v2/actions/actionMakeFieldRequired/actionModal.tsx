import React, { useState, useEffect } from 'react'
import { ActionProps } from './actionData'
import { fetchDbApi } from '@/serverActions'
import DropDown from '@/common/components/drop-down/DropDown'

const ActionModal = ({ options, onData }: ActionProps) => {
   const [productList, setProductList] = useState<any[]>([])
   const [selectedProduct, setSelectedProduct] = useState<any>(options?.selectedProduct)

   const [fieldList, setFieldList] = useState<any[]>([])
   const [selectedField, setSelectedField] = useState<any>(options?.selectedField)

   const [requiredStatus, setRequiredStatus] = useState<any>(options?.requiredStatus)

   useEffect(() => {
      onData({ selectedProduct, selectedField, requiredStatus })
   }, [selectedProduct, selectedField, requiredStatus])

   useEffect(() => {
      // get list of products
      fetchDbApi('/api/v2/products', {
         method: 'GET'
      }).then((res) => {
         console.log('products', res)
         setProductList(res)
      }).catch(error => {
         console.error('Error fetching products:', error);
      });
   }, [])


   return (
      <>
         {productList && (
            <DropDown
               label='Product'
               searchable={true}
               className='bg-color-white min-w-[160px]'
               placeholder='Select Product'
               keyPath={['name']}
               selectedValues={selectedProduct ? [selectedProduct] : []}
               options={productList}
               onOptionSelect={(e, arg) => {
                  setSelectedProduct((prev: any) => (arg))
                  setSelectedField(null)
                  fetchDbApi(`/api/v2/products/${arg.id}/fields`, {
                     method: 'GET'
                  }).then((res) => {
                     console.log('res: ', res)
                     const updatedFields = res.map((prod: any) => (prod.productField))
                     console.log('Updated Fields: ', updatedFields)
                     setFieldList(updatedFields)
                  })
               }}
            />
         )}

         {selectedProduct && <>
            <DropDown
               label='Field'
               searchable={true}
               className='bg-color-white min-w-[160px] mt-[10px]'
               placeholder='Select Field'
               keyPath={['label']}
               selectedValues={selectedField ? [selectedField] : []}
               options={fieldList}
               onOptionSelect={(e, arg) => setSelectedField(arg)}
            />

            <DropDown
               label='Select Hidden Status'
               searchable={false}
               className='bg-color-white min-w-[160px] mt-[10px]'
               placeholder='Select Field'
               keyPath={['status']}
               selectedValues={requiredStatus ? [requiredStatus] : []}
               options={[
                  { id: '1', status: 'Required' },
                  { id: '2', status: 'Not Required' }
               ]}
               onOptionSelect={(e, arg) => setRequiredStatus(arg)}
            />
         </>}

      </>
   )
}

export default ActionModal
