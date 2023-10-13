import actionData from './actionData';
import ActionModal from './actionModal';
import ActionTile from './actionTile';

export const actionAssignTask = {
   ...actionData,
   Modal: ActionModal,
   Tile: ActionTile,
};
