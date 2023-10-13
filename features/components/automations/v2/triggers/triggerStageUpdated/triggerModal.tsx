'use client'
import React, { useState, useEffect } from 'react'
import { TriggerProps } from './triggerData'
import DropDown from '@/common/components/drop-down/DropDown'
import Button from '@/common/components/button/Button'
import { fetchDbApi } from '@/serverActions'

export const TriggerModal = ({ options, onData }: TriggerProps) => {
   const [productList, setProductList] = useState<any[]>([])
   const [selectedProduct, setSelectedProduct] = useState<any>(options?.selectedProduct)

   const [stageList, setStageList] = useState<any[]>([])
   const [selectedStage, setSelectedStage] = useState<any>(options?.selectedStage)

   useEffect(() => {
      onData({ selectedProduct, selectedStage })
   }, [selectedProduct, selectedStage])

   useEffect(() => {
      fetchDbApi('/api/v2/products', {
         method: 'GET'
      }).then((res) => {
         setProductList(res)
      })
   }, [])

   useEffect(() => {
      if (!selectedProduct) return
      fetchDbApi(`/api/v2/products/${selectedProduct.id}/stages`, {
         method: 'GET'
      }).then((res) => {
         const updatedStages = res.map((stage: any) => stage.productStage)
         setStageList(updatedStages)
      })
   }, [selectedProduct])


   const handleProductSelect = (value: any) => {
      setSelectedProduct((prev: any) => (value))
      setSelectedStage((prev: any) => null)
   }

   const handleClearSelection = () => {
      setSelectedProduct((prev: any) => null)
      setSelectedStage((prev: any) => null)
   }

   return (
      <>
         <DropDown
            searchable={true}
            label='Select a Product'
            keyPath={['name']}
            className='bg-color-white min-w-[160px]'
            placeholder='Select an Product'
            selectedValues={selectedProduct ? [selectedProduct] : []}
            options={productList}
            onOptionSelect={(e, arg) => handleProductSelect(arg)}
         />

         {selectedProduct &&
            <DropDown
               searchable={true}
               label='Select the Stage'
               keyPath={['name']}
               className='bg-color-white min-w-[160px]'
               placeholder='Select a Stage'
               selectedValues={selectedStage ? [selectedStage] : []}
               options={stageList}
               onOptionSelect={(e, arg) => setSelectedStage((prev: any) => (arg))}
            />
         }

         {selectedProduct || selectedStage
            ? <div className='my-3 flex justify-between items-center'>
               <div className=''>This automation will run when prduct <span className='text-lum-green-500'>{selectedProduct?.name}</span>'s stage changes
                  {selectedStage && <span> to <span className='text-lum-green-500'>{selectedStage?.name}</span></span>}.</div>
               <Button color='gray' iconColor='blue:200' onClick={handleClearSelection}>
                  <p className='text-white text-sm font-normal leading-[14px] select-none'>
                     Clear Selection
                  </p>
               </Button>
            </div>
            : <div className='my-3'>Leave blank if you want automation to trigger on any stage update.</div>
         }
      </>
   )
}

export default TriggerModal