import React, { useState, useEffect } from 'react'
import { ActionProps } from './actionData'

const ActionModal = ({ options, onData }: ActionProps) => {

   useEffect(() => {
      onData({})
   }, [])

   return (
      <>
         <label>Field to Update</label>
         <select id="field-choose">
            <option value="-1">Loading...</option>
         </select>
         <label>Value to update to</label>
         <input id="field-new-value" />
      </>
   )
}

export default ActionModal
