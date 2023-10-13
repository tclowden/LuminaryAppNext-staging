import React from 'react'
import Icon from "@/common/components/Icon"

const AutomationLine = ({
   addAction,
   index = 0
}: {
   addAction?: (index: number) => void
   index?: number
}) => {
   return (
      <div className={`relative w-[2px] pointer-events-none ${addAction ? 'h-14' : 'h-6'} bg-[#7E8F9C]`}>
         {addAction &&
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 bg-transparent rounded-full cursor-pointer group pointer-events-auto' onClick={() => addAction(index)}>
               <div className="w-5 h-5 p-1 rounded-full bg-lum-gray-400 group-hover:scale-125 group-hover:brightness-75 ease-in-out duration-150" />
               <Icon name='Plus' className='fill-lum-white w-3 h-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
            </div>
         }
         <div className="absolute z-10 left-1/2 transform -translate-x-1/2 translate-y-1/2 bottom-0 w-2 h-2 bg-lum-white rounded-full border-2 border-lum-gray-400" />
      </div>
   )
}

export default AutomationLine;
