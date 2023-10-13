import React from 'react'

const TileWait = ({
   days,
   hours,
   minutes,
}: {
   days: number
   hours: number
   minutes: number
}) => {
   return (
      <div className="p-3 bg-lum-gray-500">
         <span className="text-white text-sm font-normal leading-[14px]">Wait: </span>
         <span className="text-white text-sm font-bold leading-[14px]">
            {!!days && days + 'd'}
            {' '}
            {!!hours && hours + 'h'}
            {' '}
            {!!minutes && minutes + 'm'}
         </span>
      </div>
   )
}

export default TileWait
