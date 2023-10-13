'use client'
import { ActionProps } from './actionData'
import Input from '@/common/components/input/Input'
import React, { useState, useEffect } from 'react'

export const ActionModal = ({ options, onData }: ActionProps) => {
   const [days, setDays] = useState<number>(options?.days || 0)
   const [hours, setHours] = useState<number>(options?.hours || 0)
   const [minutes, setMinutes] = useState<number>(options?.minutes || 0)

   useEffect(() => {
      onData({ days, hours, minutes })
   }, [days, hours, minutes])

   return (
      <div className='flex gap-3 justify-center' >
         <Input label='Days' type='number' value={days} onInput={(e) => setDays(+e.currentTarget.value)} min={0} max={24} />
         <Input label='Hours' type='number' value={hours} onInput={(e) => setHours(+e.currentTarget.value)} min={0} max={23} />
         <Input label='Minutes' type='number' value={minutes} onInput={(e) => setMinutes(+e.currentTarget.value)} min={0} max={59} />
      </div>
   )
}

export default ActionModal