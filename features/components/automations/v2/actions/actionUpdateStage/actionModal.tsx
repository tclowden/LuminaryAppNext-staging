import React, { useState, useEffect } from 'react'
import { ActionProps } from './actionData'
import { fetchDbApi } from '@/serverActions'
import DropDown from '@/common/components/drop-down/DropDown'

const ActionModal = ({ options, onData }: ActionProps) => {
   const [productList, setProductList] = useState<any[]>([])
   const [selectedProduct, setSelectedProduct] = useState<any>(options?.selectedProduct)

   const [stageList, setStageList] = useState<any[]>([])
   const [selectedStage, setSelectedStage] = useState<any>(options?.selectedStage)

   useEffect(() => {
      onData({ selectedProduct: selectedProduct, selectedStage: selectedStage })
   }, [selectedProduct, selectedStage])

   useEffect(() => {
      fetchDbApi('/api/v2/products', {
         method: 'GET'
      }).then((res) => {
         console.log('res', res)
         setProductList(res)
      })
   }, [])


   const handleProductSelect = (value: any) => {
      setSelectedProduct((prev: any) => (value))

      fetchDbApi(`/api/v2/products/${value.id}/stages`, {
         method: 'GET'
      })
         .then((res) => {
            const updatedStages = res.map((stage: any) => stage.productStage)
            setStageList(updatedStages)
         })
   }

   const handleStageSelect = (value: any) => {
      setSelectedStage((prev: any) => (value))
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

         <div className='my-3'></div>

         {selectedProduct &&
            <DropDown
               searchable={true}
               label='Select the Stage'
               keyPath={['name']}
               className='bg-color-white min-w-[160px]'
               placeholder='Select a Stage'
               selectedValues={selectedStage ? [selectedStage] : []}
               options={stageList}
               onOptionSelect={(e, arg) => handleStageSelect(arg)}
            />
         }
      </>
   )
}

export default ActionModal
