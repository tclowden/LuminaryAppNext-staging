import React from 'react'

const TileSendBroadcast = ({
   broadcastName
}: {
   broadcastName: string
}) => {
   return (
      <div className="w-[250px] bg-lum-white rounded shadow cursor-pointer">
         <div className="p-3 text-lum-gray-700 text-sm font-normal leading-[14px]">Send Broadcast</div>
         <div className="w-[250px] h-[0px] border border-lum-gray-300"></div>
         <div className="p-3 bg-lum-gray-100 rounded-b text-lum-gray-700 text-sm font-normal leading-[14px]">{broadcastName}</div>
      </div>
   )
}

export default TileSendBroadcast
