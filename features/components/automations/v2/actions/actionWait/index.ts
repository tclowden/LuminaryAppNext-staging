import actionData from './actionData';
import ActionModal from './actionModal';
import ActionTile from './actionTile';

export const actionWait = {
   ...actionData,
   Modal: ActionModal,
   Tile: ActionTile,
};
