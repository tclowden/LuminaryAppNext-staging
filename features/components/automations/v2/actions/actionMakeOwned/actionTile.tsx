'use client'
import TileSendBroadcast from "../../actionTiles/tileSendBroadcast"
import { ActionProps } from "./actionData"

const ActionTile = ({ options }: ActionProps) => {
   const {selectedUser, selectedValue} = options
   return (
      <>
         {selectedUser
            ? <TileSendBroadcast broadcastName={`Make owned: ${selectedUser?.fullName}`} />
            : <TileSendBroadcast broadcastName={`Make Lead owned by user that initiated the action.`} />
         }
      </>
   )
}

export default ActionTile
