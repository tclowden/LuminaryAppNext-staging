import actionData from './actionData';
import ActionModal from './actionModal';
import ActionTile from './actionTile';

export const actionRemoveOwner = {
   ...actionData,
   Modal: ActionModal,
   Tile: ActionTile,
};
