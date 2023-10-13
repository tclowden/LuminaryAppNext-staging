import actionData from './actionData';
import ActionModal from './actionModal';
import ActionTile from './actionTile';

export const actionMakeFieldHidden = {
   ...actionData,
   Modal: ActionModal,
   Tile: ActionTile,
};
