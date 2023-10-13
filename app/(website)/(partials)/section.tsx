import React, { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import Image from 'next/image'

import TopoDark from '@/public/assets/website/topo-dark.png'
import TopoLight from '@/public/assets/website/topo-light.png'

const WebSection = ({ children, variant = 'dark', className, priority = false }: {
   children?: ReactNode
   variant?: 'light' | 'dark'
   className?: string
   priority?: boolean
}) => {
   return (
      <div className={`relative bg-gradient-to-r overflow-hidden
         ${variant === 'dark' && ' from-[#03121B] to-[#062F46]'}
         ${variant === 'light' && ' from-[#ECF1F4] to-[#FFFFFF]'}`}>
         <Image
            src={variant === 'light' ? TopoLight : TopoDark}
            alt='Topo lines'
            className='absolute z-0 select-none w-screen min-w-[1400px] min-h-full object-fill'
            priority={priority}
         />
         <div className={twMerge(`relative z-10 px-8 py-14 md:px-16 md:py-20 flex flex-col place-items-center max-w-[1440px] mx-auto`, className)}>{children}</div>
      </div>
   )
}

export default WebSection
