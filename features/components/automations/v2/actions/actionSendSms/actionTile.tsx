'use client'
import TileSendBroadcast from "../../actionTiles/tileSendBroadcast"
import { ActionProps } from "./actionData"

const ActionTile = ({ options }: ActionProps) => {
   return (
      <TileSendBroadcast broadcastName="Send SMS" />
   )
}

export default ActionTile
