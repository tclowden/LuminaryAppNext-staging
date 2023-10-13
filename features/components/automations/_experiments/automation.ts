// Define event types
enum AutomationEventType {
   StatusUpdated = 'StatusUpdated',
   StageUpdated = 'StageUpdated',
   TeamScheduled = 'TeamScheduled',
}

// Define event data structures
interface StatusUpdateEvent {
   type: AutomationEventType.StatusUpdated;
   taskId: string;
   newStatus: string;
}

interface StageUpdateEvent {
   type: AutomationEventType.StageUpdated;
   taskId: string;
   newStage: string;
}

interface TeamScheduledEvent {
   type: AutomationEventType.TeamScheduled;
   taskId: string;
   teamMember: string;
   scheduledTime: Date;
}

interface Action {
   name: string;
   execute: () => Promise<void>;
}

export class Automation {
   private actions: Action[] = [];

   constructor() {}

   addAction(action: Action) {
      this.actions.push(action);
   }

   async execute() {
      for (const action of this.actions) {
         try {
            console.log(`Executing action: ${action.name}`);
            await action.execute();
            console.log(`Action ${action.name} executed successfully`);
         } catch (error) {
            console.error(`Error executing action ${action.name}: ${error}`);
         }
      }
   }
}

// Define the EventDispatcher class to manage event listeners
class EventDispatcher {
   private listeners: Map<AutomationEventType, Function[]> = new Map();

   addEventListener(eventType: AutomationEventType, callback: Function) {
      if (!this.listeners.has(eventType)) {
         this.listeners.set(eventType, []);
      }
      this.listeners.get(eventType)!.push(callback);
   }

   dispatchEvent(event: StatusUpdateEvent | StageUpdateEvent | TeamScheduledEvent) {
      const listeners = this.listeners.get(event.type);
      if (listeners) {
         for (const listener of listeners) {
            listener(event);
         }
      }
   }
}

// Create an instance of EventDispatcher
const eventDispatcher = new EventDispatcher();

// Example actions with event triggers
const statusUpdateAction: Action = {
   name: 'Status Update Action',
   execute: async () => {
      // Simulate a status update
      const event: StatusUpdateEvent = {
         type: AutomationEventType.StatusUpdated,
         taskId: '123',
         newStatus: 'Completed',
      };
      eventDispatcher.dispatchEvent(event);
   },
};

const stageUpdateAction: Action = {
   name: 'Stage Update Action',
   execute: async () => {
      // Simulate a stage update
      const event: StageUpdateEvent = {
         type: AutomationEventType.StageUpdated,
         taskId: '123',
         newStage: 'Final Review',
      };
      eventDispatcher.dispatchEvent(event);
   },
};

const teamScheduledAction: Action = {
   name: 'Team Scheduled Action',
   execute: async () => {
      // Simulate a team scheduling event
      const event: TeamScheduledEvent = {
         type: AutomationEventType.TeamScheduled,
         taskId: '123',
         teamMember: 'John Doe',
         scheduledTime: new Date(),
      };
      eventDispatcher.dispatchEvent(event);
   },
};
