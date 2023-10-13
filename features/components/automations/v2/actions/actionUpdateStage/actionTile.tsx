'use client'
import TileSendBroadcast from "../../actionTiles/tileSendBroadcast"
import { ActionProps } from "./actionData"

const ActionTile = ({ options }: ActionProps) => {
   return (
      <>
         <TileSendBroadcast broadcastName="Update Stage" />
      </>
   )
}

export default ActionTile
