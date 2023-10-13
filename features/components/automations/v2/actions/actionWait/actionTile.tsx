'use client'
import { ActionProps } from "./actionData"
import TileWait from "../../actionTiles/tileWait"

const ActionTile = ({ options }: ActionProps) => {
   return (
      <TileWait days={options.days} hours={options.hours} minutes={options.minutes} />
   )
}

export default ActionTile
