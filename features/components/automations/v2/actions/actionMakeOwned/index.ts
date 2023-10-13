import actionData from './actionData';
import ActionModal from './actionModal';
import ActionTile from './actionTile';

export const actionMakeOwned = {
   ...actionData,
   Modal: ActionModal,
   Tile: ActionTile,
};
