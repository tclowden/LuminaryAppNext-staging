import React, { useState, useEffect } from 'react'
import { ActionProps } from './actionData'

const ActionModal = ({ options, onData }: ActionProps) => {

   useEffect(() => {
      onData({})
   }, [])

   return (
      <>
         Removes only the current owner from this lead.
      </>
   )
}

export default ActionModal
