'use client'
import { ActionProps } from "./actionData"
import TileSendBroadcast from "../../actionTiles/tileSendBroadcast"

const ActionTile = ({ options }: ActionProps) => {
   const { emailRecipientType, selectedProduct, selectedCoordinatorRole, selectedRole, fromName, fromEmail, toEmail, subject, message, ccEmail } = options;
   return (
      <TileSendBroadcast broadcastName={`Send Email to: ${emailRecipientType.status}`} />
   )
}

export default ActionTile
