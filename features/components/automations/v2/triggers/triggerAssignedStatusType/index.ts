import triggerData from './triggerData';
import TriggerModal from './triggerModal';
import TriggerTile from './triggerTile';

export const triggerAssignedStatusType = {
   ...triggerData,
   Modal: TriggerModal,
   TileDescription: TriggerTile,
};
