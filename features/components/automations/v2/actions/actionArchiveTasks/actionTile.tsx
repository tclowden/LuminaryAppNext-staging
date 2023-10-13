'use client'
import TileSendBroadcast from "../../actionTiles/tileSendBroadcast"
import { ActionProps } from "./actionData"

const ActionTile = ({ options }: ActionProps) => {
   return (
      <>
         <TileSendBroadcast broadcastName="Archive all tasks" />
      </>
   )
}

export default ActionTile
