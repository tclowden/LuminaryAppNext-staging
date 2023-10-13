'use client'
import React, { useState, useEffect } from 'react'
import { TriggerProps } from './triggerData'

export const TriggerModal = ({ options, onData }: TriggerProps) => {

   useEffect(() => {
      onData({})
   }, [])

   return (
      <>
      </>
   )
}

export default TriggerModal