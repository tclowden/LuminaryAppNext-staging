'use client'
import TileSendBroadcast from "../../actionTiles/tileSendBroadcast"
import { ActionProps } from "./actionData"

const ActionTile = ({ options }: ActionProps) => {
   const { webhookName, webhookUrl, webhookDescription } = options;

   return (
      <TileSendBroadcast broadcastName={`Send to Webhook: ${webhookName}`} />
   )
}

export default ActionTile
