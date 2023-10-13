'use client'
import { ActionProps } from "./actionData"
import TileWait from "../../actionTiles/tileWait"

const ActionTile = ({ options }: ActionProps) => {
   return (
      // <TileWait days={options.days} hours={options.hours} minutes={options.minutes} />
      <div className="p-3 bg-lum-gray-500">
         <span className="text-white text-sm font-normal leading-[14px]">Filter</span>
         <span className="text-white text-sm font-bold leading-[14px]">
         </span>
      </div>
   )
}

export default ActionTile
