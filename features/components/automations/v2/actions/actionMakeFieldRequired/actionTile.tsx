'use client'
import TileSendBroadcast from "../../actionTiles/tileSendBroadcast"
import { ActionProps } from "./actionData"

const ActionTile = ({ options }: ActionProps) => {
   return (
      <>
         <TileSendBroadcast broadcastName="Make Field Required" />
      </>
   )
}

export default ActionTile
