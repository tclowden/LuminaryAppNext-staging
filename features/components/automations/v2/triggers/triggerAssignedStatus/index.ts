import triggerData from './triggerData';
import TriggerModal from './triggerModal';
import TriggerTile from './triggerTile';

export const triggerAssignedStatus = {
   ...triggerData,
   Modal: TriggerModal,
   TileDescription: TriggerTile,
};
