import React, { useState, useEffect } from 'react'
import { ActionProps } from './actionData'

const ActionModal = ({ options, onData }: ActionProps) => {

   useEffect(() => {
      onData({})
   }, [])

   return (
      <>
         This will archive all tasks for this order.
      </>
   )
}

export default ActionModal
